import "server-only";

import { setTimeout as sleep } from "node:timers/promises";
import { createClient } from "redis";

import type { Verdict } from "@/lib/types/ask-ai";
import { numberFromEnv } from "@/lib/utils/env";

/*
 * Ask AI's limits, kept in Redis so they hold across restarts and instances:
 *
 * - one answer at a time per visitor,
 * - ASK_RATE_LIMIT questions per visitor in a sliding window,
 * - ASK_DAILY_TOKEN_BUDGET tokens a day for the whole site.
 *
 * Without Redis there are no limits, so Ask AI turns itself off instead.
 */

const VISITOR_LIMIT = numberFromEnv("ASK_RATE_LIMIT", 12);
const WINDOW_MS = numberFromEnv("ASK_RATE_WINDOW_MINUTES", 10) * 60_000;
const DAILY_TOKEN_BUDGET = numberFromEnv("ASK_DAILY_TOKEN_BUDGET", 2_000_000);

/**
 * Frees a visitor whose answer never finished, such as when the server dies
 * mid-answer. Far longer than any real answer: if one outlived it, finishing
 * would free the slot of the visitor's next answer instead.
 */
const ANSWER_LOCK_MS = 120_000;

const keys = (visitor: string, now: number) => ({
    answering: `ask-ai:answering:${visitor}`,
    questions: `ask-ai:questions:${visitor}`,
    tokens: `ask-ai:tokens:${new Date(now).toISOString().slice(0, 10)}`,
});

const secondsUntilTomorrow = (now: number) =>
    Math.ceil((86_400_000 - (now % 86_400_000)) / 1000);

let client: ReturnType<typeof createClient> | undefined;
let connecting: Promise<unknown> | undefined;

/** The shared client. While Redis is down, its commands fail at once. */
const getRedis = async () => {
    if (!client) {
        const url = process.env.REDIS_URL;
        if (!url) throw new Error("REDIS_URL isn't set");
        client = createClient({
            url,
            disableOfflineQueue: true,
            socket: {
                connectTimeout: 2000,
                reconnectStrategy: (retries) => Math.min(retries * 200, 5000),
            },
        });
        client.on("error", (error) => console.error("Ask AI: Redis:", error));
        connecting = client.connect().catch(() => undefined);
    }
    // Only a cold start waits, and only briefly.
    if (!client.isReady) await Promise.race([connecting, sleep(1000)]);
    return client;
};

/**
 * Counts a question from `visitor` and says whether to answer it. Refused
 * questions count too, so hammering keeps a visitor out until they stop.
 */
const admit = async (visitor: string, now = Date.now()): Promise<Verdict> => {
    const key = keys(visitor, now);
    try {
        const redis = await getRedis();
        const [locked, , earlier, , , oldest, tokensToday] = await redis
            .multi()
            .set(key.answering, "1", { NX: true, PX: ANSWER_LOCK_MS })
            .zRemRangeByScore(key.questions, 0, now - WINDOW_MS)
            .zCard(key.questions)
            .zAdd(key.questions, { score: now, value: crypto.randomUUID() })
            // Only the newest questions matter, so the set never grows past the limit.
            .zRemRangeByRank(key.questions, 0, -VISITOR_LIMIT - 1)
            .zRangeWithScores(key.questions, 0, 0)
            .get(key.tokens)
            .pExpire(key.questions, WINDOW_MS)
            .execTyped();

        const refusal = (): Verdict | undefined => {
            if (locked !== "OK") return { ok: false, reason: "busy" };
            if (Number(earlier) >= VISITOR_LIMIT) {
                const [first] = oldest;
                const retryAfterMs = first.score + WINDOW_MS - now;
                return {
                    ok: false,
                    reason: "visitor",
                    retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
                };
            }
            if (Number(tokensToday) >= DAILY_TOKEN_BUDGET) {
                return {
                    ok: false,
                    reason: "daily",
                    retryAfterSeconds: secondsUntilTomorrow(now),
                };
            }
        };

        const verdict = refusal();
        if (!verdict) return { ok: true };
        // Free the slot this question took, but never one still answering.
        if (locked === "OK") await redis.del(key.answering);
        return verdict;
    } catch (error) {
        console.error("Ask AI: rate limits unavailable:", error);
        return { ok: false, reason: "unavailable" };
    }
};

/** Ends `visitor`'s answer: frees their slot and adds what it cost. */
const settle = async (visitor: string, tokens: number, now = Date.now()) => {
    const key = keys(visitor, now);
    try {
        const redis = await getRedis();
        await redis
            .multi()
            .del(key.answering)
            .incrBy(key.tokens, tokens)
            .expire(key.tokens, 2 * 86_400)
            .exec();
    } catch (error) {
        // The lock expires on its own. Only this answer's cost goes unrecorded.
        console.error("Ask AI: couldn't record an answer:", error);
    }
};

export { admit, settle };
