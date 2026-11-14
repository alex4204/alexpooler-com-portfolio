"use client";

import { useRef } from "react";

import { usePageScrollbar } from "@/hooks/use-page-scrollbar";

/**
 * A slim scrollbar floating over the page's right edge, in place of the
 * browser's, which globals.css hides on mouse-driven devices. It takes no
 * room, so the layout never shifts when a page starts or stops scrolling,
 * and the header's border reaches the edge. Touch screens keep their own.
 *
 * Hidden from assistive tech: the page itself stays the scrollable thing.
 */
const PageScrollbar = () => {
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    usePageScrollbar(trackRef, thumbRef);

    return (
        <div
            ref={trackRef}
            aria-hidden="true"
            className="group fixed top-14 right-0 bottom-0 z-40 hidden w-3 pointer-fine:data-[scrollable=true]:block"
        >
            <div
                ref={thumbRef}
                className="absolute top-0 right-0.5 w-1.5 touch-none rounded-full bg-foreground/25 opacity-0 transition-[opacity,width,background-color] duration-200 group-hover:w-2 group-hover:opacity-100 group-data-dragging:w-2 group-data-dragging:bg-foreground/40 group-data-dragging:opacity-100 group-data-scrolling:opacity-100 hover:bg-foreground/40"
            />
        </div>
    );
};

export { PageScrollbar };
