"use client";

import {
    Collection,
    Header,
    MenuSection,
    type MenuSectionProps,
} from "react-aria-components";

import { cn } from "@/lib/utils/cn";

const CommandKGroup = <T extends object>({
    className,
    children,
    items,
    heading,
    ...props
}: MenuSectionProps<T> & { heading?: string }) => (
    <MenuSection
        data-slot="command-k-group"
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

export { CommandKGroup };
