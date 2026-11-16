"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { AskAiMessage } from "@/lib/types/ask-ai";
import { messageText } from "@/lib/utils/ask-ai/message-text";
import { sourcesOf } from "@/lib/utils/ask-ai/sources-of";
import { prefersReducedMotion } from "@/lib/utils/prefers-reduced-motion";

const CHARACTERS_PER_TICK = 3;

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

export { AssistantMessage };
