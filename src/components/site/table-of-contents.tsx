"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { motion } from "motion/react";

import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils/cn";

type TocItem = {
    id: string;
    title: string;
};

const TableOfContents = ({ items }: { items: TocItem[] }) => {
    const [activeId, setActiveId] = useState(items[0]?.id);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (observed) => {
                for (const entry of observed) {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                }
            },
            { rootMargin: "-80px 0px -65% 0px" },
        );
        for (const item of items) {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        }
        return () => observer.disconnect();
    }, [items]);

    const jumpTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
        event.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", `#${id}`);
        setActiveId(id);
    };

    return (
        <nav aria-label="On this page" className="text-sm">
            <p className="mb-2 text-xs font-semibold tracking-wider text-foreground/40 uppercase">
                On this page
            </p>
            <ul className="border-l border-foreground/10">
                {items.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                onClick={(event) => jumpTo(event, item.id)}
                                aria-current={isActive ? "location" : undefined}
                                className={cn(
                                    "relative -ml-px block py-1 pl-4 transition-colors",
                                    isActive
                                        ? "text-foreground"
                                        : "text-foreground/50 hover:text-foreground/80",
                                )}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="toc-bar"
                                        transition={SPRING}
                                        className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary"
                                    />
                                )}
                                {item.title}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export { TableOfContents };
