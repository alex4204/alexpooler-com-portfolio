"use client";

import type { ComponentProps } from "react";
import {
    composeRenderProps,
    Input as InputPrimitive,
} from "react-aria-components";

import { cn } from "@/lib/utils/cn";

/**
 * Text is 16px on phones, the size below which iOS zooms the page in when
 * an input is focused. Smaller from md up, where it never does.
 */
const Input = ({
    className,
    ...props
}: ComponentProps<typeof InputPrimitive>) => (
    <InputPrimitive
        data-slot="input"
        className={composeRenderProps(className, (className) =>
            cn(
                "h-9 w-full min-w-0 rounded-lg bg-foreground/[0.06] px-3.5 text-base text-foreground transition-shadow outline-none placeholder:text-foreground/40 focus-visible:ring-1 focus-visible:ring-foreground/30 disabled:pointer-events-none disabled:opacity-50 md:text-sm",
                className,
            ),
        )}
        {...props}
    />
);

export { Input };
