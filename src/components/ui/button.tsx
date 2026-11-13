"use client";

import type { RefAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
    Button as ButtonPrimitive,
    Link as LinkPrimitive,
    type ButtonProps as ButtonPrimitiveProps,
    type LinkProps as LinkPrimitiveProps,
} from "react-aria-components";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
    "group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-transparent text-sm whitespace-nowrap transition-[color,background-color,border-color,scale] duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40 data-pressed:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    "bg-primary font-medium text-primary-foreground hover:bg-primary/90",
                outline:
                    "border-foreground/10 text-foreground/70 hover:border-foreground/25 hover:text-foreground",
                accent: "border-primary/45 text-primary hover:bg-primary/10",
                ghost: "text-foreground/60 hover:bg-foreground/5 hover:text-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-8 px-3",
                sm: "h-7 px-2.5 text-xs",
                lg: "h-10 px-4",
                icon: "size-8",
                "icon-sm": "size-7",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

type ButtonProps = Omit<ButtonPrimitiveProps, "className"> &
    RefAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
        className?: string;
    };

type LinkButtonProps = Omit<LinkPrimitiveProps, "className"> &
    VariantProps<typeof buttonVariants> & {
        className?: string;
    };

const Button = ({
    className,
    variant = "default",
    size = "default",
    ...props
}: ButtonProps) => (
    <ButtonPrimitive
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
    />
);

const LinkButton = ({
    className,
    variant = "default",
    size = "default",
    ...props
}: LinkButtonProps) => (
    <LinkPrimitive
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
    />
);

export { Button, buttonVariants, LinkButton };
