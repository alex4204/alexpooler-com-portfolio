"use client";

import type { ComponentProps } from "react";
import { Heading } from "react-aria-components";

import { cn } from "@/lib/utils/cn";

const PanelTitle = ({
    className,
    ...props
}: Omit<ComponentProps<typeof Heading>, "slot">) => (
    <Heading
        slot="title"
        data-slot="panel-title"
        className={cn("font-heading text-base font-semibold", className)}
        {...props}
    />
);

export { PanelTitle };
