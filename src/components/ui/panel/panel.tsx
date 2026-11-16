"use client";

import type { ReactNode } from "react";
import {
    ModalOverlay as ModalOverlayPrimitive,
    Modal as ModalPrimitive,
    Dialog as PanelPrimitive,
    type ModalOverlayProps as ModalOverlayPrimitiveProps,
} from "react-aria-components";

import { cn } from "@/lib/utils/cn";

type PanelSide = "left" | "right";

type PanelProps = Omit<ModalOverlayPrimitiveProps, "className" | "children"> & {
    className?: string;
    children: ReactNode;
    side?: PanelSide;
    "aria-label"?: string;
};

const Panel = ({
    className,
    children,
    side = "right",
    "aria-label": ariaLabel,
    ...props
}: PanelProps) => (
    <ModalOverlayPrimitive
        data-slot="panel-overlay"
        isDismissable
        // Sized to the visible area, which React Aria measures, rather than
        // the screen, so an on-screen keyboard never covers the bottom.
        className="fixed top-0 left-0 z-50 h-(--visual-viewport-height) w-full bg-black/40 transition-opacity duration-300 data-entering:opacity-0 data-exiting:opacity-0"
        {...props}
    >
        <ModalPrimitive
            data-slot="panel-content"
            data-side={side}
            className={cn(
                // The after: element continues the panel's colour below it,
                // so if iOS leaves a gap above the keyboard, nothing behind
                // the panel shows through.
                "fixed top-0 z-50 flex h-(--visual-viewport-height) w-full flex-col border-foreground/10 bg-card text-card-foreground shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] after:absolute after:inset-x-0 after:top-full after:h-screen after:bg-card motion-reduce:transition-none",
                "data-[side=left]:left-0 data-[side=left]:max-w-72 data-[side=left]:border-r data-[side=left]:data-entering:-translate-x-full data-[side=left]:data-exiting:-translate-x-full",
                "data-[side=right]:right-0 data-[side=right]:max-w-[420px] data-[side=right]:border-l data-[side=right]:data-entering:translate-x-full data-[side=right]:data-exiting:translate-x-full",
                className,
            )}
        >
            <PanelPrimitive
                data-slot="panel"
                aria-label={ariaLabel}
                className="flex h-full min-h-0 flex-col outline-none"
            >
                {children}
            </PanelPrimitive>
        </ModalPrimitive>
    </ModalOverlayPrimitive>
);

export { Panel };
