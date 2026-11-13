import type { Span } from "@/lib/types/content";

type NavItem = {
    href: string;
    label: string;
    /** Opens another site. Shown as a button and kept out of search and paging. */
    external?: boolean;
    /** Items sharing a company are listed together under its name. */
    company?: { name: string; spans: Span[] };
};

type NavGroup = {
    /** Untitled groups render without a heading. */
    title?: string;
    /** Time covered by the group, shown beside its title. */
    spans?: Span[];
    items: NavItem[];
};

type SearchItem = NavItem & {
    group: string;
    /** Extra words the search should match on. */
    keywords: string;
};

export type { NavGroup, NavItem, SearchItem };
