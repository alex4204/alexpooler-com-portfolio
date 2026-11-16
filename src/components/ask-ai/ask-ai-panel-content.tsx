"use client";

import type { FormEvent } from "react";

import { AssistantMessage } from "@/components/ask-ai/assistant-message";
import { ThinkingDots } from "@/components/ask-ai/thinking-dots";
import { UserMessage } from "@/components/ask-ai/user-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AskAi } from "@/hooks/use-ask-ai";
import { messageText } from "@/lib/utils/ask-ai/message-text";

type AskAiPanelContentProps = {
    askAi: AskAi;
    /** Example questions shown before the first one is asked. */
    suggestions: string[];
    /** The question being typed. Held by the panel, so it survives closing. */
    draft: string;
    onDraftChange: (draft: string) => void;
    /** Called when a source link is followed, to close the panel. */
    onNavigate: () => void;
};

/** The conversation and the question box, inside the Ask AI panel. */
const AskAiPanelContent = ({
    askAi,
    suggestions,
    draft,
    onDraftChange,
    onNavigate,
}: AskAiPanelContentProps) => {
    const { messages, status, error, isBusy, maxQuestionLength, ask } = askAi;
    const last = messages.at(-1);
    // Dots until the answer's first words arrive.
    const isThinking =
        status === "submitted" ||
        (status === "streaming" &&
            last?.role === "assistant" &&
            messageText(last) === "");
    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (ask(draft)) onDraftChange("");
    };

    return (
        <>
            {/* Reversed, so the browser keeps the newest message in view: on
                opening, as messages arrive and as answers type out. */}
            <div className="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto overscroll-contain px-4 py-4">
                {/* mb-auto keeps a short conversation at the top. */}
                <div className="mb-auto space-y-4">
                    {messages.length === 0 && (
                        <div className="space-y-2">
                            <p className="mb-3 text-sm text-foreground/65">
                                Ask about my projects, roles or skills.
                            </p>
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => ask(suggestion)}
                                    className="block w-full animate-in cursor-pointer rounded-lg border border-foreground/10 px-3 py-2 text-left text-sm text-foreground/80 fill-mode-both fade-in slide-in-from-bottom-2 hover:border-foreground/25"
                                    style={{
                                        animationDelay: `${120 + index * 50}ms`,
                                    }}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    {messages.map((message) =>
                        message.role === "user" ? (
                            <UserMessage key={message.id} message={message} />
                        ) : (
                            <AssistantMessage
                                key={message.id}
                                message={message}
                                isStreaming={
                                    status === "streaming" && message === last
                                }
                                onNavigate={onNavigate}
                            />
                        ),
                    )}

                    {isThinking && <ThinkingDots />}
                    {status === "error" && error && (
                        <p role="alert" className="text-sm text-foreground/70">
                            {error.message}
                        </p>
                    )}
                </div>
            </div>

            <form
                onSubmit={submit}
                className="flex gap-2 border-t border-foreground/10 p-3"
            >
                <Input
                    aria-label="Your question"
                    placeholder="Ask a question…"
                    value={draft}
                    maxLength={maxQuestionLength}
                    onChange={(event) => onDraftChange(event.target.value)}
                />
                <Button
                    type="submit"
                    isDisabled={isBusy || !draft.trim()}
                    className="h-9 px-4"
                >
                    Send
                </Button>
            </form>
        </>
    );
};

export { AskAiPanelContent };
