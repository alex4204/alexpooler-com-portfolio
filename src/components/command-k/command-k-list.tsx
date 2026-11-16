"use client";

import { Menu, type MenuProps } from "react-aria-components";

import { cn } from "@/lib/utils/cn";

const CommandKList = <T extends object>({
    className,
    ...props
}: MenuProps<T>) => (
    <Menu
        data-slot="command-k-list"
        className={cn(
            "max-h-[50vh] scroll-py-2 overflow-y-auto overscroll-contain p-2 outline-none",
            className,
        )}
        {...props}
    />
);

export { CommandKList };
