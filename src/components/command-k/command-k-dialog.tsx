"use client";

import type { ReactNode } from "react";

import { Dialog } from "@/components/ui/dialog/dialog";
import { DialogTitle } from "@/components/ui/dialog/dialog-title";
import { cn } from "@/lib/utils/cn";

type CommandKDialogProps = {
    title: string;
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    className?: string;
    children: ReactNode;
};

const CommandKDialog = ({
    title,
    open,
    onOpenChange,
    className,
    children,
}: CommandKDialogProps) => (
    <Dialog
        isOpen={open}
        onOpenChange={onOpenChange}
        // A whole-pixel top. A percentage of the window height lands between
        // pixels, and Chrome then leaves faint lines when a hover highlight goes.
        // Centred with margins rather than a transform, and without clipping:
        // Safari hands touch scrolling in a list inside a transformed,
        // clipped box to the page while the on-screen keyboard is up.
        className={cn(
            "inset-x-0 top-24 mx-auto translate-none overflow-visible sm:max-w-xl",
            className,
        )}
    >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {children}
    </Dialog>
);

export { CommandKDialog };
