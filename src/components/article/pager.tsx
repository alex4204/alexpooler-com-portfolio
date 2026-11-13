import Link from "next/link";

import type { NavItem } from "@/lib/types/navigation";
import { cn } from "@/lib/utils/cn";

type PagerLinkProps = {
    item: NavItem;
    direction: "previous" | "next";
};

const PagerLink = ({ item, direction }: PagerLinkProps) => {
    const isNext = direction === "next";
    return (
        <Link
            href={item.href}
            className={cn(
                "group block rounded-xl border border-foreground/10 p-4 transition-colors hover:border-foreground/25",
                isNext && "text-right sm:col-start-2",
            )}
        >
            <span className="block text-xs text-foreground/45">
                {isNext ? "Next" : "Previous"}
            </span>
            <span className="mt-0.5 block font-medium">
                {!isNext && (
                    <span className="mr-1 inline-block text-foreground/50 transition-transform group-hover:-translate-x-1">
                        ←
                    </span>
                )}
                {item.label}
                {isNext && (
                    <span className="ml-1 inline-block text-foreground/50 transition-transform group-hover:translate-x-1">
                        →
                    </span>
                )}
            </span>
        </Link>
    );
};

const Pager = ({ previous, next }: { previous?: NavItem; next?: NavItem }) => (
    <nav
        aria-label="Pages"
        className="mt-20 grid gap-3 border-t border-foreground/10 pt-8 sm:grid-cols-2"
    >
        {previous && <PagerLink item={previous} direction="previous" />}
        {next && <PagerLink item={next} direction="next" />}
    </nav>
);

export { Pager };
