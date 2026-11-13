"use client";

import type { ComponentProps, ReactNode } from "react";
import {
    Dialog as DialogPrimitive,
    Heading,
    ModalOverlay as ModalOverlayPrimitive,
    Modal as ModalPrimitive,
    type ModalOverlayProps as ModalOverlayPrimitiveProps,
} from "react-aria-components";

import { cn } from "@/lib/utils/cn";

type DialogProps = Omit<
    ModalOverlayPrimitiveProps,
    "className" | "children"
> & {
    className?: string;
    children: ReactNode;
};

const DialogOverlay = ({ className, children, ...props }: DialogProps) => (
    <ModalOverlayPrimitive
        data-slot="dialog-overlay"
        className={cn(
            "fixed inset-0 isolate z-50 bg-black/60 duration-150 data-entering:animate-in data-entering:fade-in-0 data-exiting:animate-out data-exiting:fade-out-0 supports-backdrop-filter:backdrop-blur-sm",
            className,
        )}
        {...props}
    >
        {children}
    </ModalOverlayPrimitive>
);

const Dialog = ({
    className,
    children,
    isDismissable = true,
    ...props
}: DialogProps) => (
    <DialogOverlay isDismissable={isDismissable} {...props}>
        <ModalPrimitive
            data-slot="dialog-content"
            className={cn(
                "fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-foreground/10 bg-popover text-popover-foreground shadow-2xl outline-none data-entering:animate-in data-entering:duration-200 data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:duration-100 data-exiting:fade-out-0 data-exiting:zoom-out-[0.97] sm:max-w-md",
                className,
            )}
        >
            <DialogPrimitive data-slot="dialog" className="outline-none">
                {children}
            </DialogPrimitive>
        </ModalPrimitive>
    </DialogOverlay>
);

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

export { Dialog, DialogTitle };
