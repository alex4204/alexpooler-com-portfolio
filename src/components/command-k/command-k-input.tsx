"use client";

import { SearchIcon } from "lucide-react";
import { Input, SearchField, type InputProps } from "react-aria-components";

import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils/cn";

// A whole-pixel height (h-12), so the results below sit exactly on pixels.
// Padding around 15px text came to 50.5px, and the half pixel left faint
// lines in Chrome when a result's hover highlight went away.
const CommandKInput = ({ className, placeholder, ...props }: InputProps) => (
    <SearchField
        autoFocus
        aria-label={placeholder ?? "Search"}
        data-slot="command-k-input-wrapper"
        className="flex items-center gap-3 border-b border-foreground/10 px-4"
    >
        <SearchIcon className="size-4 shrink-0 text-foreground/40" />
        <Input
            placeholder={placeholder}
            data-slot="command-k-input"
            className={cn(
                "h-12 w-full bg-transparent text-base outline-none placeholder:text-foreground/40 md:text-[15px] [&::-webkit-search-cancel-button]:hidden",
                className,
            )}
            {...props}
        />
        {/* Touch screens have no Esc key. */}
        <Kbd className="pointer-coarse:hidden">Esc</Kbd>
    </SearchField>
);

export { CommandKInput };
