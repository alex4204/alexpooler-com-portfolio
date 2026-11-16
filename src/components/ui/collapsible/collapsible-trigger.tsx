"use client";

import {
    Button as CollapsibleTriggerPrimitive,
    composeRenderProps,
    type ButtonProps,
} from "react-aria-components";

import { cn } from "@/lib/utils/cn";

const CollapsibleTrigger = ({ className, ...props }: ButtonProps) => (
    <CollapsibleTriggerPrimitive
        slot="trigger"
        data-slot="collapsible-trigger"
        className={composeRenderProps(className, (className) =>
            cn("cursor-pointer", className),
        )}
        {...props}
    />
);

export { CollapsibleTrigger };
