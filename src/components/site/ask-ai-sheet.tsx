"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { AskAi } from "@/hooks/use-ask-ai";
import type { AskAiMessage } from "@/lib/types/ask-ai";
import { messageText } from "@/lib/utils/ask-ai/message-text";

const CHARACTERS_PER_TICK = 3;

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The pages an answer cited, once its `citeSources` call has run. */
const sourcesOf = (message: AskAiMessage) =>
    message.parts.flatMap((part) =>
        part.type === "tool-citeSources" && part.state === "output-available"
            ? part.output
            : [],
    );

const AssistantMessage = ({
    message,
    isStreaming,
    onNavigate,
}: {
    message: AskAiMessage;
    /** Only the answer arriving now types itself out; older ones show whole. */
    isStreaming: boolean;
    onNavigate: () => void;
}) => {
    const text = messageText(message);
    const sources = sourcesOf(message);
    const [shown, setShown] = useState(() =>
        isStreaming && !prefersReducedMotion() ? 0 : text.length,
    );
    const isDone = shown >= text.length;

    useEffect(() => {
        if (isDone) return;
        const timer = setInterval(
            () =>
                setShown((count) =>
                    Math.min(count + CHARACTERS_PER_TICK, text.length),
                ),
            16,
        );
        return () => clearInterval(timer);
    }, [isDone, text.length]);

    return (
        <div className="max-w-[90%] text-sm leading-6 whitespace-pre-wrap text-foreground/85">
            {text.slice(0, shown)}
            {isDone && sources.length > 0 && (
                <div className="mt-3 animate-in duration-200 fade-in">
                    <p className="mb-1 text-[11px] tracking-wider text-foreground/40 uppercase">
                        Sources
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {sources.map((source) => (
                            <Link
                                key={source.href}
                                href={source.href}
                                onClick={onNavigate}
                                className="rounded-md border border-foreground/15 px-2 py-1 text-xs hover:bg-foreground/10"
                            >
                                {source.label} ↗
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const ThinkingDots = () => (
    <div className="flex gap-1 py-1" aria-label="Thinking">
        {[0, 150, 300].map((delay) => (
            <span
                key={delay}
                className="size-1.5 animate-bounce rounded-full bg-foreground/50"
                style={{ animationDelay: `${delay}ms` }}
            />
        ))}
    </div>
);

type AskAiSheetProps = {
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    askAi: AskAi;
    /** Example questions shown before the first one is asked. */
    suggestions: string[];
};

const AskAiSheet = ({
    open,
    onOpenChange,
    askAi,
    suggestions,
}: AskAiSheetProps) => {
    const { messages, status, error, isBusy, maxQuestionLength, ask } = askAi;
    const last = messages.at(-1);
    // Dots until the answer's first words arrive.
    const isThinking =
        status === "submitted" ||
        (status === "streaming" &&
            last?.role === "assistant" &&
            messageText(last) === "");
    const [draft, setDraft] = useState("");
    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (ask(draft)) setDraft("");
    };

    return (
        <Sheet side="right" isOpen={open} onOpenChange={onOpenChange}>
            <SheetHeader>
                <div>
                    <SheetTitle className="flex items-center gap-2">
                        <SparklesIcon className="size-4 text-primary" />
                        Ask AI
                    </SheetTitle>
                    <p className="text-[11px] text-foreground/45">
                        Automated · answers only from this site
                    </p>
                </div>
            </SheetHeader>

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
                            <div
                                key={message.id}
                                className="flex animate-in justify-end duration-200 fade-in slide-in-from-bottom-2"
                            >
                                <div className="max-w-[90%] rounded-2xl bg-primary px-3.5 py-2 text-sm leading-6 text-primary-foreground">
                                    {messageText(message)}
                                </div>
                            </div>
                        ) : (
                            <AssistantMessage
                                key={message.id}
                                message={message}
                                isStreaming={
                                    status === "streaming" && message === last
                                }
                                onNavigate={() => onOpenChange(false)}
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
                    onChange={(event) => setDraft(event.target.value)}
                />
                <Button
                    type="submit"
                    isDisabled={isBusy || !draft.trim()}
                    className="h-9 px-4"
                >
                    Send
                </Button>
            </form>
        </Sheet>
    );
};

export { AskAiSheet };
