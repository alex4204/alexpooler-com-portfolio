"use client";

import type { ComponentProps } from "react";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const PanelHeader = ({
    className,
    children,
    ...props
}: ComponentProps<"div">) => (
    <div
        data-slot="panel-header"
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

export { PanelHeader };
