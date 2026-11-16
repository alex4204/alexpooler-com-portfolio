"use client";

import { useState } from "react";
import { SparklesIcon } from "lucide-react";

import { AskAiPanelContent } from "@/components/ask-ai/ask-ai-panel-content";
import { Panel } from "@/components/ui/panel/panel";
import { PanelHeader } from "@/components/ui/panel/panel-header";
import { PanelTitle } from "@/components/ui/panel/panel-title";
import type { AskAi } from "@/hooks/use-ask-ai";

type AskAiPanelProps = {
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    askAi: AskAi;
    /** Example questions shown before the first one is asked. */
    suggestions: string[];
};

/** The slide-out panel Ask AI opens in: its frame and header. */
const AskAiPanel = ({
    open,
    onOpenChange,
    askAi,
    suggestions,
}: AskAiPanelProps) => {
    const [draft, setDraft] = useState("");

    return (
        <Panel side="right" isOpen={open} onOpenChange={onOpenChange}>
            <PanelHeader>
                <div>
                    <PanelTitle className="flex items-center gap-2">
                        <SparklesIcon className="size-4 text-primary" />
                        Ask AI
                    </PanelTitle>
                    <p className="text-[11px] text-foreground/45">
                        Automated · answers only from this site
                    </p>
                </div>
            </PanelHeader>

            <AskAiPanelContent
                askAi={askAi}
                suggestions={suggestions}
                draft={draft}
                onDraftChange={setDraft}
                onNavigate={() => onOpenChange(false)}
            />
        </Panel>
    );
};

export { AskAiPanel };
