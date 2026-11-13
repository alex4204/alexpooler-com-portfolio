"use client";

import type { ComponentProps, ReactNode } from "react";
import { SearchIcon } from "lucide-react";
import {
    Autocomplete,
    Collection,
    Header,
    Input,
    Menu,
    MenuItem,
    MenuSection,
    SearchField,
    type AutocompleteProps,
    type InputProps,
    type MenuItemProps,
    type MenuProps,
    type MenuSectionProps,
} from "react-aria-components";

import { Dialog, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils/cn";

// Every whitespace-separated word has to appear somewhere in the item's text.
const matchesAllWords = (textValue: string, inputValue: string) => {
    const haystack = textValue.toLowerCase();
    return inputValue
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((word) => haystack.includes(word));
};

const Command = ({ filter = matchesAllWords, ...props }: AutocompleteProps) => (
    <Autocomplete filter={filter} {...props} />
);

type CommandDialogProps = {
    title: string;
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    className?: string;
    children: ReactNode;
};

const CommandDialog = ({
    title,
    open,
    onOpenChange,
    className,
    children,
}: CommandDialogProps) => (
    <Dialog
        isOpen={open}
        onOpenChange={onOpenChange}
        className={cn("top-[14vh] translate-y-0 sm:max-w-xl", className)}
    >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {children}
    </Dialog>
);

const CommandInput = ({ className, placeholder, ...props }: InputProps) => (
    <SearchField
        autoFocus
        aria-label={placeholder ?? "Search"}
        data-slot="command-input-wrapper"
        className="flex items-center gap-3 border-b border-foreground/10 px-4"
    >
        <SearchIcon className="size-4 shrink-0 text-foreground/40" />
        <Input
            placeholder={placeholder}
            data-slot="command-input"
            className={cn(
                "w-full bg-transparent py-3.5 text-[15px] outline-none placeholder:text-foreground/40 [&::-webkit-search-cancel-button]:hidden",
                className,
            )}
            {...props}
        />
        <Kbd>Esc</Kbd>
    </SearchField>
);

const CommandList = <T extends object>({
    className,
    ...props
}: MenuProps<T>) => (
    <Menu
        data-slot="command-list"
        className={cn(
            "max-h-[50vh] scroll-py-2 overflow-y-auto p-2 outline-none",
            className,
        )}
        {...props}
    />
);

const CommandEmpty = ({ className, ...props }: ComponentProps<"div">) => (
    <div
        data-slot="command-empty"
        className={cn(
            "px-3 py-6 text-center text-sm text-foreground/45",
            className,
        )}
        {...props}
    />
);

const CommandGroup = <T extends object>({
    className,
    children,
    items,
    heading,
    ...props
}: MenuSectionProps<T> & { heading?: string }) => (
    <MenuSection
        data-slot="command-group"
        className={cn("not-first:mt-2", className)}
        {...props}
    >
        {heading && (
            <Header className="px-3 pt-1 pb-1.5 text-xs text-foreground/45">
                {heading}
            </Header>
        )}
        <Collection items={items}>{children}</Collection>
    </MenuSection>
);

const CommandItem = <T extends object>({
    className,
    ...props
}: MenuItemProps<T>) => (
    <MenuItem
        data-slot="command-item"
        className={cn(
            "flex cursor-default items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm outline-none select-none data-focused:bg-foreground/[0.08] data-disabled:opacity-50",
            className,
        )}
        {...props}
    />
);

export {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
};
