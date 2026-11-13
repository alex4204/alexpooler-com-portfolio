import type { LinkIcon } from "@/lib/types/navigation";

const ICONS_BY_HOST: Record<string, LinkIcon> = {
    "github.com": "github",
    "linkedin.com": "linkedin",
};

/** The brand icon for a profile link, from its host. */
const linkIconFor = (href: string): LinkIcon =>
    ICONS_BY_HOST[new URL(href).hostname.replace(/^www\./, "")] ?? "external";

export { linkIconFor };
