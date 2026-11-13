import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

const Badge = ({ className, ...props }: ComponentProps<"span">) => (
    <span
        data-slot="badge"
        className={cn(
            "inline-flex h-5 w-fit shrink-0 items-center rounded-sm border border-primary/25 bg-primary/10 px-1.5 font-sans text-[11px] leading-none font-medium whitespace-nowrap text-primary",
            className,
        )}
        {...props}
    />
);

export { Badge };
