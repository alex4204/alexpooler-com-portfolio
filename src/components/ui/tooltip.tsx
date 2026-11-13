"use client";

import { Children, type ComponentProps, type ReactNode } from "react";
import {
    Focusable,
    Tooltip as TooltipPrimitive,
    TooltipTrigger as TooltipTriggerPrimitive,
} from "react-aria-components";

import { cn } from "@/lib/utils/cn";

/** Takes two children: the element that triggers it, then the `Tooltip`. */
const TooltipTrigger = ({
    delay = 300,
    children,
    ...props
}: ComponentProps<typeof TooltipTriggerPrimitive>) => {
    const [trigger, tooltip] = Children.toArray(children);
    return (
        <TooltipTriggerPrimitive
            data-slot="tooltip-trigger"
            delay={delay}
            {...props}
        >
            <Focusable>
                {trigger as ComponentProps<typeof Focusable>["children"]}
            </Focusable>
            {tooltip}
        </TooltipTriggerPrimitive>
    );
};

type TooltipProps = Omit<
    ComponentProps<typeof TooltipPrimitive>,
    "children" | "className"
> & {
    className?: string;
    children?: ReactNode;
};

const Tooltip = ({
    className,
    placement = "top",
    offset = 6,
    children,
    ...props
}: TooltipProps) => (
    <TooltipPrimitive
        data-slot="tooltip-content"
        placement={placement}
        offset={offset}
        className={cn(
            "z-50 w-fit max-w-xs rounded-md border border-foreground/10 bg-[color-mix(in_oklab,var(--foreground)_6%,var(--background))] px-2.5 py-1 text-xs text-foreground/80 shadow-sm",
            className,
        )}
        {...props}
    >
        {children}
    </TooltipPrimitive>
);

export { Tooltip, TooltipTrigger };
