import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/** A `##` heading with the heavy rule that opens each section of a page. */
const SectionHeading = ({
    id,
    className,
    children,
}: {
    id: string;
    className?: string;
    children: ReactNode;
}) => (
    <h2
        id={id}
        className={cn(
            "mt-12 scroll-mt-20 border-t border-foreground pt-4 text-2xl font-semibold tracking-tight",
            className,
        )}
    >
        {children}
    </h2>
);

export { SectionHeading };
