"use client";

import {
    DisclosurePanel as CollapsibleContentPrimitive,
    composeRenderProps,
    type DisclosurePanelProps,
} from "react-aria-components";

import { cn } from "@/lib/utils/cn";

// React Aria exposes the panel's height as a CSS variable, so it can animate.
const CollapsibleContent = ({ className, ...props }: DisclosurePanelProps) => (
    <CollapsibleContentPrimitive
        data-slot="collapsible-content"
        className={composeRenderProps(className, (className) =>
            cn(
                "h-(--disclosure-panel-height) overflow-clip transition-[height] duration-300 ease-out motion-reduce:transition-none",
                className,
            ),
        )}
        {...props}
    />
);

export { CollapsibleContent };
