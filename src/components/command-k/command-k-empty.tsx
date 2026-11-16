"use client";

import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

const CommandKEmpty = ({ className, ...props }: ComponentProps<"div">) => (
    <div
        data-slot="command-k-empty"
        className={cn(
            "px-3 py-6 text-center text-sm text-foreground/45",
            className,
        )}
        {...props}
    />
);

export { CommandKEmpty };
