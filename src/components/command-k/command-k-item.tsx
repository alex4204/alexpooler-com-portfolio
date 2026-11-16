"use client";

import { MenuItem, type MenuItemProps } from "react-aria-components";

import { cn } from "@/lib/utils/cn";

const CommandKItem = <T extends object>({
    className,
    ...props
}: MenuItemProps<T>) => (
    <MenuItem
        data-slot="command-k-item"
        className={cn(
            "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm outline-none select-none data-focused:bg-foreground/[0.08] data-disabled:opacity-50",
            className,
        )}
        {...props}
    />
);

export { CommandKItem };
