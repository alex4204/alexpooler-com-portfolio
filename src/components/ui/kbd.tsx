"use client";

import type { ComponentProps } from "react";
import { Keyboard as KbdPrimitive } from "react-aria-components";

import { cn } from "@/lib/utils/cn";

const Kbd = ({ className, ...props }: ComponentProps<"kbd">) => (
    <KbdPrimitive
        data-slot="kbd"
        className={cn(
            "pointer-events-none inline-flex h-5 items-center rounded-sm border border-foreground/15 px-1.5 font-sans text-[11px] text-foreground/45 select-none",
            className,
        )}
        {...props}
    />
);

export { Kbd };
