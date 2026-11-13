"use client";

import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import type { AskAiLimits, AskAiMessage } from "@/lib/types/ask-ai";

/**
 * Adds when to try again to a rate-limit refusal, in the visitor's own time
 * and format, such as "Try again at 14:32." The server can't know either.
 */
const fetchWithRetryTime: typeof fetch = async (input, init) => {
    const response = await fetch(input, init);
    const seconds = Number(response.headers.get("retry-after"));
    if (response.status !== 429 || !seconds) return response;

    const time = new Date(Date.now() + seconds * 1000).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
    const reason = await response.text();
    return new Response(`${reason} Try again at ${time}.`, { status: 429 });
};

/** The Ask AI conversation, shared by the sheet and the search dialog. */
const useAskAi = (limits: AskAiLimits) => {
    const transport = useMemo(
        () =>
            new DefaultChatTransport<AskAiMessage>({
                api: "/api/ask-ai",
                fetch: fetchWithRetryTime,
                // Only recent history is sent: it keeps each question's cost bounded.
                prepareSendMessagesRequest: ({ messages }) => ({
                    body: { messages: messages.slice(-limits.maxMessages) },
                }),
            }),
        [limits.maxMessages],
    );
    const chat = useChat<AskAiMessage>({ transport });
    const isBusy = chat.status === "submitted" || chat.status === "streaming";

    /** Sends `question` unless one is already being answered. */
    const ask = (question: string) => {
        const text = question.trim();
        if (!text || isBusy) return false;
        void chat.sendMessage({ text });
        return true;
    };

    return {
        messages: chat.messages,
        status: chat.status,
        error: chat.error,
        isBusy,
        maxQuestionLength: limits.maxQuestionLength,
        ask,
    };
};

type AskAi = ReturnType<typeof useAskAi>;

export { useAskAi, type AskAi };
