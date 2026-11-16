"use client";

import type { ComponentProps } from "react";
import { Heading } from "react-aria-components";

import { cn } from "@/lib/utils/cn";

const DialogTitle = ({
    className,
    ...props
}: Omit<ComponentProps<typeof Heading>, "slot">) => (
    <Heading
        slot="title"
        data-slot="dialog-title"
        className={cn("font-heading text-base font-semibold", className)}
        {...props}
    />
);

export { DialogTitle };
