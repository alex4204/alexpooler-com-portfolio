"use client";

import { type ComponentProps, type ReactNode } from "react";
import { Tooltip as TooltipPrimitive } from "react-aria-components";

import { cn } from "@/lib/utils/cn";

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

export { Tooltip };
