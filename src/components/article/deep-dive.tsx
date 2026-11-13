"use client";

import type { ReactNode } from "react";
import { ChevronDownIcon } from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

/** Optional detail most readers can skip, folded away until they want it. */
const DeepDive = ({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) => (
    <Collapsible className="group/deep-dive my-5 overflow-hidden rounded-xl border border-foreground/10 bg-card">
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
            <span>
                <span className="block text-xs font-semibold tracking-wider text-primary uppercase">
                    Deep dive
                </span>
                <span className="font-semibold">{title}</span>
            </span>
            <ChevronDownIcon className="size-4 text-foreground/50 transition-transform duration-300 group-data-expanded/deep-dive:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
            <div className="border-t border-foreground/10 px-4 pt-1 pb-3">
                {children}
            </div>
        </CollapsibleContent>
    </Collapsible>
);

export { DeepDive };
