"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SparklesIcon } from "lucide-react";

import { CommandK } from "@/components/command-k/command-k";
import { CommandKDialog } from "@/components/command-k/command-k-dialog";
import { CommandKEmpty } from "@/components/command-k/command-k-empty";
import { CommandKGroup } from "@/components/command-k/command-k-group";
import { CommandKInput } from "@/components/command-k/command-k-input";
import { CommandKItem } from "@/components/command-k/command-k-item";
import { CommandKList } from "@/components/command-k/command-k-list";
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
        <CommandKDialog
            title="Search"
            open={open}
            onOpenChange={handleOpenChange}
        >
            <CommandK inputValue={query} onInputChange={setQuery}>
                <CommandKInput placeholder="Search projects, roles, skills…" />
                <CommandKList
                    aria-label="Results"
                    renderEmptyState={() => (
                        <CommandKEmpty>No results</CommandKEmpty>
                    )}
                >
                    {groups.map((group) => (
                        <CommandKGroup key={group.name} heading={group.name}>
                            {group.items.map((item) => (
                                <CommandKItem
                                    key={item.href}
                                    id={item.href}
                                    textValue={`${item.label} ${item.group} ${item.keywords}`}
                                    onAction={() => goTo(item.href)}
                                >
                                    <span>{item.label}</span>
                                    <span className="text-xs text-foreground/40">
                                        {item.group}
                                    </span>
                                </CommandKItem>
                            ))}
                        </CommandKGroup>
                    ))}
                    {trimmed && (
                        // Its text is the query itself, so the filter always keeps it.
                        <CommandKGroup heading="Not finding it?">
                            <CommandKItem
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
                            </CommandKItem>
                        </CommandKGroup>
                    )}
                </CommandKList>
            </CommandK>
        </CommandKDialog>
    );
};

export { SearchDialog };
