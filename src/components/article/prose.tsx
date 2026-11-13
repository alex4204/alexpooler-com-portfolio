import type { ReactNode } from "react";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

const Paragraph = ({ children }: { children: ReactNode }) => (
    <p className="my-3 text-[15px] leading-7 text-foreground/75">{children}</p>
);

const TextLink = ({
    href,
    className,
    children,
}: {
    href: string;
    className?: string;
    children: ReactNode;
}) => (
    <Link
        href={href}
        className={cn(
            "text-primary underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-primary",
            className,
        )}
    >
        {children}
    </Link>
);

/** "A, B, C" where each item is a link. */
const LinkList = ({ links }: { links: { href: string; label: string }[] }) =>
    links.map((link, index) => (
        <span key={link.href}>
            <TextLink href={link.href}>{link.label}</TextLink>
            {index < links.length - 1 && ", "}
        </span>
    ));

/** A link to another site, with an icon so it's clear it leaves this one. */
const ExternalTextLink = ({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-primary underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-primary"
    >
        {children}
        <ExternalLinkIcon
            aria-label="Opens in a new tab"
            className="size-3.5"
        />
    </a>
);

const Callout = ({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) => (
    <div className="my-5 rounded-lg border border-primary/25 bg-primary/[0.06] px-4 py-3 text-sm leading-6 text-foreground/80">
        <p className="mb-0.5 font-semibold text-primary">{title}</p>
        {children}
    </div>
);

export { Callout, ExternalTextLink, LinkList, Paragraph, TextLink };
