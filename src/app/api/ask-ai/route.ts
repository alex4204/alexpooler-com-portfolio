import { readConversation, streamAnswer } from "@/services/ask-ai/ask-ai";
import { admit, settle } from "@/services/ask-ai/rate-limit";
import type { Verdict } from "@/lib/types/ask-ai";
import { visitorOf } from "@/lib/utils/ask-ai/visitor";
import { parseJson } from "@/lib/utils/json";
import { readBody } from "@/lib/utils/read-body";

/** Real conversations are far smaller. Anything bigger isn't worth reading. */
const MAX_BODY_BYTES = 64_000;

const UNAVAILABLE = "Ask AI is unavailable right now. Try again later.";

/** Plain text, which `useChat` shows as the error message. */
const reply = (status: number, message: string, headers?: HeadersInit) =>
    new Response(message, { status, headers });

/** Browsers say where a request came from. Only this site may ask. */
const isCrossSite = (request: Request) => {
    const site = request.headers.get("sec-fetch-site");
    return site !== null && site !== "same-origin";
};

/**
 * A sentence for the visitor. When to try again goes in `Retry-After`, and
 * the browser adds it to the sentence in the visitor's own time.
 */
const refuse = (verdict: Exclude<Verdict, { ok: true }>) => {
    if (verdict.reason === "busy") {
        return reply(429, "Wait for the current answer to finish.");
    }
    if (verdict.reason === "unavailable") return reply(503, UNAVAILABLE);
    return reply(
        429,
        verdict.reason === "daily"
            ? "Ask AI has hit its limit for today."
            : "You've asked a lot of questions.",
        { "retry-after": String(verdict.retryAfterSeconds) },
    );
};

/*
 * Cheapest checks first, and nothing is counted until the request is valid,
 * so junk can't use up anyone's limits.
 */
const POST = async (request: Request) => {
    if (isCrossSite(request)) return reply(403, "Not allowed.");

    const body = await readBody(request, MAX_BODY_BYTES);
    if (body === undefined) {
        return reply(413, "That conversation is too long. Start a new one.");
    }

    const conversation = await readConversation(parseJson(body));
    if (!conversation) return reply(400, "That request wasn't valid.");

    const visitor = visitorOf(request);
    if (!visitor) {
        console.error(
            "Ask AI: no cf-connecting-ip. Is the site behind Cloudflare?",
        );
        return reply(503, UNAVAILABLE);
    }

    const verdict = await admit(visitor);
    if (!verdict.ok) return refuse(verdict);

    return streamAnswer(conversation, request.signal, (tokens) => {
        void settle(visitor, tokens);
    });
};

export { POST };
