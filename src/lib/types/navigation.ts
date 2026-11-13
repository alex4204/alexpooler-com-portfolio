import type { Span } from "@/lib/types/content";

type LinkIcon = "github" | "linkedin" | "code" | "external";

type NavItem = {
    href: string;
    label: string;
    /** Opens another site. Kept out of search and paging. */
    external?: boolean;
    /** Stands in for the label in the sidebar's row of external links. */
    icon?: LinkIcon;
    /** Items sharing a subgroup, such as a company, are listed under its name. */
    subgroup?: string;
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

export type { LinkIcon, NavGroup, NavItem, SearchItem };
