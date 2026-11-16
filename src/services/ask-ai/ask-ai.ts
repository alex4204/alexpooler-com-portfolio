import "server-only";

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import {
    APICallError,
    LoadAPIKeyError,
    convertToModelMessages,
    createProviderRegistry,
    createUIMessageStreamResponse,
    safeValidateUIMessages,
    streamText,
    toUIMessageStream,
    tool,
} from "ai";

import {
    askAiRequestSchema,
    citeSourcesInputSchema,
    type AskAiLimits,
    type AskAiMessage,
} from "@/lib/types/ask-ai";
import { numberFromEnv } from "@/lib/utils/env";
import { messageText } from "@/lib/utils/ask-ai/message-text";
import { getSystemPrompt, resolveSources } from "@/services/ask-ai/prompt";

/*
 * Answers a visitor's question about Alex, streamed to the Ask AI panel.
 *
 * Provider-agnostic through the AI SDK: ASK_MODEL picks the model as
 * "provider:model", e.g. "anthropic:claude-sonnet-5-5" or "openai:gpt-…", and
 * that provider's API key must be set. There is no default: until both are
 * set, Ask AI says it isn't set up. Switching needs no code change.
 */

/** Answers are meant to be short. This also caps what one question can cost. */
const MAX_OUTPUT_TOKENS = 1024;

/** Keeps what each question sends, and so costs, bounded. */
const askAiLimits: AskAiLimits = {
    maxMessages: numberFromEnv("ASK_MAX_MESSAGES", 10),
    maxQuestionLength: numberFromEnv("ASK_MAX_QUESTION_LENGTH", 500),
};

/**
 * Every provider the site can use. Each reads its own key from the
 * environment, and only when first used, so unused ones need no key. To add
 * one, install its `@ai-sdk/*` package and list it here.
 */
const PROVIDERS = { anthropic, google, openai };
const registry = createProviderRegistry(PROVIDERS);

/** The model ASK_MODEL names, or `undefined` if it's unset or unknown. */
const getModel = () => {
    const id = process.env.ASK_MODEL;
    const provider = id?.split(":")[0];
    if (!id || !provider || !(provider in PROVIDERS)) {
        console.error(
            `Ask AI: set ASK_MODEL to "provider:model", where provider is one of: ${Object.keys(PROVIDERS).join(", ")}`,
        );
        return undefined;
    }
    return registry.languageModel(
        id as Parameters<typeof registry.languageModel>[0],
    );
};

const NOT_SET_UP = "Ask AI isn't set up yet.";

/** How the model links its answer to pages. Paths are checked, never trusted. */
const tools = {
    citeSources: tool({
        description:
            "List the site pages the answer used. Call once, after answering.",
        inputSchema: citeSourcesInputSchema,
        execute: ({ paths }) => resolveSources(paths),
    }),
};

/**
 * The conversation the browser sent, or `undefined` if it isn't one we'll
 * answer. All of it is untrusted, including earlier "assistant" messages: it
 * must be well-formed, short, and end with a question from the visitor.
 */
const readConversation = async (
    body: unknown,
): Promise<AskAiMessage[] | undefined> => {
    const request = askAiRequestSchema.safeParse(body);
    if (!request.success) return undefined;

    const validated = await safeValidateUIMessages<AskAiMessage>({
        messages: request.data.messages.slice(-askAiLimits.maxMessages),
        tools,
    });
    if (!validated.success) return undefined;

    // Models expect the conversation to open with the visitor.
    const messages = validated.data;
    const conversation = messages.slice(
        messages.findIndex((message) => message.role === "user"),
    );
    const questions = conversation.filter((message) => message.role === "user");
    const isValid =
        conversation.at(-1)?.role === "user" &&
        conversation.every((message) => message.role !== "system") &&
        questions.every((message) => {
            const text = messageText(message).trim();
            return (
                text.length > 0 && text.length <= askAiLimits.maxQuestionLength
            );
        });
    return isValid ? conversation : undefined;
};

/** What the visitor sees when something goes wrong. Never the raw error. */
const describeFailure = (error: unknown) => {
    console.error("Ask AI request failed:", error);
    if (LoadAPIKeyError.isInstance(error)) return NOT_SET_UP;
    if (APICallError.isInstance(error)) {
        if (error.statusCode === 429) {
            return "Ask AI is busy right now. Try again in a minute.";
        }
        if (error.statusCode === 401 || error.statusCode === 403) {
            return NOT_SET_UP;
        }
    }
    return "Something went wrong. Try asking again.";
};

/**
 * Streams the answer as a UI message stream, the format `useChat` reads.
 * `onDone` gets the tokens it used once it ends, however it ends.
 */
const streamAnswer = async (
    conversation: AskAiMessage[],
    signal: AbortSignal,
    onDone: (tokens: number) => void,
) => {
    const model = getModel();
    if (!model) {
        onDone(0);
        return new Response(NOT_SET_UP, { status: 503 });
    }

    const result = streamText({
        model,
        // The whole site is in the prompt. Anthropic can cache it between
        // questions; other providers ignore this option.
        instructions: {
            role: "system",
            content: await getSystemPrompt(),
            providerOptions: {
                anthropic: { cacheControl: { type: "ephemeral" } },
            },
        },
        messages: await convertToModelMessages(conversation),
        tools,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        // Answers are short lookups over content that is already in the
        // prompt. "none" is the lowest each model allows: no thinking, or
        // its least where thinking can't be turned off.
        reasoning: "none",
        abortSignal: signal,
        onEnd: ({ totalUsage }) => onDone(totalUsage.totalTokens ?? 0),
        // Whatever a failed or cancelled answer used isn't reported.
        onError: () => onDone(0),
        onAbort: () => onDone(0),
    });

    return createUIMessageStreamResponse({
        stream: toUIMessageStream({
            stream: result.stream,
            tools,
            // Thinking is signed against the whole conversation, so once old
            // messages are trimmed the provider rejects it. Visitors never
            // see it, so it never reaches the browser and never comes back.
            sendReasoning: false,
            onError: describeFailure,
        }),
    });
};

export { askAiLimits, readConversation, streamAnswer };
