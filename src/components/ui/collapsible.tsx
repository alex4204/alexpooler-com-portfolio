"use client";

import {
    DisclosurePanel as CollapsibleContentPrimitive,
    Disclosure as CollapsiblePrimitive,
    Button as CollapsibleTriggerPrimitive,
    composeRenderProps,
    type ButtonProps,
    type DisclosurePanelProps,
    type DisclosureProps,
} from "react-aria-components";

import { cn } from "@/lib/utils/cn";

const Collapsible = (props: DisclosureProps) => (
    <CollapsiblePrimitive data-slot="collapsible" {...props} />
);

const CollapsibleTrigger = (props: ButtonProps) => (
    <CollapsibleTriggerPrimitive
        slot="trigger"
        data-slot="collapsible-trigger"
        {...props}
    />
);

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

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
