"use client";

import type { ComponentProps, ReactNode } from "react";
import { XIcon } from "lucide-react";
import {
    Heading,
    ModalOverlay as ModalOverlayPrimitive,
    Modal as ModalPrimitive,
    Dialog as SheetPrimitive,
    type ModalOverlayProps as ModalOverlayPrimitiveProps,
} from "react-aria-components";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type SheetSide = "left" | "right";

type SheetProps = Omit<ModalOverlayPrimitiveProps, "className" | "children"> & {
    className?: string;
    children: ReactNode;
    side?: SheetSide;
    "aria-label"?: string;
};

const Sheet = ({
    className,
    children,
    side = "right",
    "aria-label": ariaLabel,
    ...props
}: SheetProps) => (
    <ModalOverlayPrimitive
        data-slot="sheet-overlay"
        isDismissable
        className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 data-entering:opacity-0 data-exiting:opacity-0"
        {...props}
    >
        <ModalPrimitive
            data-slot="sheet-content"
            data-side={side}
            className={cn(
                "fixed inset-y-0 z-50 flex h-full w-full flex-col border-foreground/10 bg-card text-card-foreground shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
                "data-[side=left]:left-0 data-[side=left]:max-w-72 data-[side=left]:border-r data-[side=left]:data-entering:-translate-x-full data-[side=left]:data-exiting:-translate-x-full",
                "data-[side=right]:right-0 data-[side=right]:max-w-[420px] data-[side=right]:border-l data-[side=right]:data-entering:translate-x-full data-[side=right]:data-exiting:translate-x-full",
                className,
            )}
        >
            <SheetPrimitive
                data-slot="sheet"
                aria-label={ariaLabel}
                className="flex h-full min-h-0 flex-col outline-none"
            >
                {children}
            </SheetPrimitive>
        </ModalPrimitive>
    </ModalOverlayPrimitive>
);

const SheetHeader = ({
    className,
    children,
    ...props
}: ComponentProps<"div">) => (
    <div
        data-slot="sheet-header"
        className={cn(
            "flex items-center justify-between gap-3 border-b border-foreground/10 px-4 py-3",
            className,
        )}
        {...props}
    >
        {children}
        <Button slot="close" variant="ghost" size="icon-sm" aria-label="Close">
            <XIcon />
        </Button>
    </div>
);

const SheetTitle = ({
    className,
    ...props
}: Omit<ComponentProps<typeof Heading>, "slot">) => (
    <Heading
        slot="title"
        data-slot="sheet-title"
        className={cn("font-heading text-base font-semibold", className)}
        {...props}
    />
);

export { Sheet, SheetHeader, SheetTitle };
