"use client";

import { useEffect, useState } from "react";
import { DownloadIcon, SearchIcon, SparklesIcon } from "lucide-react";

import { AskAiSheet } from "@/components/site/ask-ai-sheet";
import { ModKey } from "@/components/site/mod-key";
import { SearchDialog } from "@/components/site/search-dialog";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button, LinkButton } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useAskAi } from "@/hooks/use-ask-ai";
import type { AskAiLimits } from "@/lib/types/ask-ai";
import type { SearchItem } from "@/lib/types/navigation";

const isTyping = (target: EventTarget | null) =>
    target instanceof HTMLElement &&
    (target.isContentEditable || Boolean(target.closest("input, textarea")));

type SiteToolsProps = {
    searchItems: SearchItem[];
    askAiLimits: AskAiLimits;
    askAiSuggestions: string[];
    /** Path of the CV to download. No CV, no button. */
    cv?: string;
};

/** Search, Ask AI and the theme toggle, plus their keyboard shortcuts. */
const SiteTools = ({
    searchItems,
    askAiLimits,
    askAiSuggestions,
    cv,
}: SiteToolsProps) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAskAiOpen, setIsAskAiOpen] = useState(false);
    const askAi = useAskAi(askAiLimits);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();
                setIsSearchOpen((open) => !open);
            } else if (event.key === "/" && !isTyping(event.target)) {
                event.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const askFromSearch = (question: string) => {
        setIsAskAiOpen(true);
        askAi.ask(question);
    };

    return (
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
            <Button
                variant="outline"
                aria-label="Search"
                aria-keyshortcuts="Control+K Meta+K"
                className="max-w-60 min-w-0 flex-1 justify-start bg-foreground/[0.04] text-foreground/50 sm:w-60 sm:flex-none"
                onPress={() => setIsSearchOpen(true)}
            >
                <SearchIcon />
                <span className="flex-1 text-left">Search…</span>
                <Kbd className="hidden sm:inline-flex">
                    <ModKey /> K
                </Kbd>
            </Button>
            <Button
                variant="accent"
                aria-label="Ask AI"
                onPress={() => setIsAskAiOpen(true)}
            >
                <SparklesIcon />
                <span className="hidden sm:inline">Ask AI</span>
            </Button>
            {cv && (
                <LinkButton
                    href={cv}
                    download
                    variant="ghost"
                    size="icon"
                    aria-label="Download CV (PDF)"
                >
                    <DownloadIcon />
                </LinkButton>
            )}
            <ThemeToggle />

            <SearchDialog
                items={searchItems}
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onAsk={askFromSearch}
            />
            <AskAiSheet
                open={isAskAiOpen}
                onOpenChange={setIsAskAiOpen}
                askAi={askAi}
                suggestions={askAiSuggestions}
            />
        </div>
    );
};

export { SiteTools };
