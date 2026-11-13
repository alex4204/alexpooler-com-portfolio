"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SparklesIcon } from "lucide-react";

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import type { SearchItem } from "@/lib/types/navigation";

type SearchDialogProps = {
    items: SearchItem[];
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onAsk: (question: string) => void;
};

const groupItems = (items: SearchItem[]) =>
    items.reduce<{ name: string; items: SearchItem[] }[]>((groups, item) => {
        const group = groups.find((candidate) => candidate.name === item.group);
        if (group) group.items.push(item);
        else groups.push({ name: item.group, items: [item] });
        return groups;
    }, []);

const SearchDialog = ({
    items,
    open,
    onOpenChange,
    onAsk,
}: SearchDialogProps) => {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const groups = groupItems(items);
    const trimmed = query.trim();

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) setQuery("");
        onOpenChange(isOpen);
    };

    const goTo = (href: string) => {
        router.push(href);
        handleOpenChange(false);
    };

    const ask = () => {
        onAsk(trimmed);
        handleOpenChange(false);
    };

    return (
        <CommandDialog
            title="Search"
            open={open}
            onOpenChange={handleOpenChange}
        >
            <Command inputValue={query} onInputChange={setQuery}>
                <CommandInput placeholder="Search projects, roles, skills…" />
                <CommandList
                    aria-label="Results"
                    renderEmptyState={() => (
                        <CommandEmpty>No results</CommandEmpty>
                    )}
                >
                    {groups.map((group) => (
                        <CommandGroup key={group.name} heading={group.name}>
                            {group.items.map((item) => (
                                <CommandItem
                                    key={item.href}
                                    id={item.href}
                                    textValue={`${item.label} ${item.group} ${item.keywords}`}
                                    onAction={() => goTo(item.href)}
                                >
                                    <span>{item.label}</span>
                                    <span className="text-xs text-foreground/40">
                                        {item.group}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ))}
                    {trimmed && (
                        // Its text is the query itself, so the filter always keeps it.
                        <CommandGroup heading="Not finding it?">
                            <CommandItem
                                id="ask-ai"
                                textValue={query}
                                onAction={ask}
                            >
                                <span className="flex items-center gap-2">
                                    <SparklesIcon className="size-4 text-primary" />
                                    Ask AI: “{trimmed}”
                                </span>
                                <span className="text-xs text-foreground/40">
                                    Answer from this site
                                </span>
                            </CommandItem>
                        </CommandGroup>
                    )}
                </CommandList>
            </Command>
        </CommandDialog>
    );
};

export { SearchDialog };
