"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

import { ExperienceDuration } from "@/components/site/experience-duration";
import { LinkIcon } from "@/components/site/link-icon";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { SPRING } from "@/lib/motion";
import type { NavGroup, NavItem } from "@/lib/types/navigation";
import { cn } from "@/lib/utils/cn";

type SidebarNavListProps = {
    groups: NavGroup[];
    activeHref?: string;
    onNavigate?: () => void;
    /** Keeps the sliding indicator separate when two navs are mounted. */
    layoutId?: string;
};

/**
 * An icon-only link to another site, named by its label. A plain <a> styled
 * as a button, because the tooltip needs a trigger that passes its props on.
 */
const ExternalButton = ({ item }: { item: NavItem }) => (
    <TooltipTrigger>
        <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${item.label} (opens in a new tab)`}
            className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className: "text-foreground/55 hover:text-foreground",
            })}
        >
            <LinkIcon name={item.icon ?? "external"} />
        </a>
        <Tooltip placement="bottom">{item.label}</Tooltip>
    </TooltipTrigger>
);

const SidebarNavList = ({
    groups,
    activeHref,
    onNavigate,
    layoutId = "sidebar",
}: SidebarNavListProps) => (
    <nav aria-label="Site" className="space-y-5 py-6 pr-4 text-sm">
        {groups.map((group, groupIndex) => (
            <div key={group.title ?? groupIndex}>
                {group.title && (
                    <p className="mb-1 flex items-baseline justify-between gap-2 px-3 font-semibold text-primary">
                        {group.title}
                        {group.spans && (
                            <span className="text-xs font-normal text-foreground/45 tabular-nums">
                                <ExperienceDuration spans={group.spans} />
                            </span>
                        )}
                    </p>
                )}
                <ul
                    className={cn(
                        group.items.every((item) => item.external) &&
                            "flex gap-1 px-1",
                    )}
                >
                    {group.items.map((item, itemIndex) => {
                        const subgroup = item.subgroup;
                        const startsSubgroup =
                            subgroup &&
                            subgroup !== group.items[itemIndex - 1]?.subgroup;
                        if (item.external) {
                            return (
                                <li key={item.href}>
                                    <ExternalButton item={item} />
                                </li>
                            );
                        }
                        const isActive = item.href === activeHref;
                        return (
                            <Fragment key={item.href}>
                                {startsSubgroup && (
                                    <li className="px-3 pt-1 pb-0.5 text-[13px] text-foreground/50 italic">
                                        {subgroup}
                                    </li>
                                )}
                                <li
                                    className={cn(
                                        subgroup &&
                                            "ml-4 border-l border-foreground/10",
                                    )}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={onNavigate}
                                        aria-current={
                                            isActive ? "page" : undefined
                                        }
                                        className={cn(
                                            "relative block rounded-md px-3 py-1.5 transition-colors",
                                            isActive
                                                ? "text-foreground"
                                                : "text-foreground/60 hover:text-foreground",
                                        )}
                                    >
                                        {isActive && (
                                            <>
                                                <motion.span
                                                    layoutId={`${layoutId}-background`}
                                                    transition={SPRING}
                                                    className="absolute inset-0 rounded-md bg-foreground/[0.07]"
                                                />
                                                <motion.span
                                                    layoutId={`${layoutId}-bar`}
                                                    transition={SPRING}
                                                    className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary"
                                                />
                                            </>
                                        )}
                                        <span className="relative">
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            </Fragment>
                        );
                    })}
                </ul>
            </div>
        ))}
    </nav>
);

type SidebarNavProps = Omit<SidebarNavListProps, "activeHref">;

/** Reads the current path, so render it inside <Suspense> in shared layouts. */
const SidebarNav = (props: SidebarNavProps) => {
    const pathname = usePathname();
    return <SidebarNavList {...props} activeHref={pathname} />;
};

export { SidebarNav, SidebarNavList };
