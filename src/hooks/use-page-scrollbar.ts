"use client";

import { useEffect, type RefObject } from "react";

/** Short pages still get a thumb big enough to grab. */
const MIN_THUMB_HEIGHT = 32;

/** How long the thumb stays visible after scrolling stops. */
const IDLE_MS = 1000;

/**
 * Keeps a drawn scrollbar in step with the page's own scrolling. The browser
 * still does all the scrolling (wheel, keys, touch, restoring the position
 * on Back); this only mirrors it, and lets the thumb be dragged.
 *
 * It writes to the elements directly rather than through state, since it
 * runs on every scroll frame. The track gets `data-scrollable`, and
 * `data-scrolling` / `data-dragging` while those are happening, for styling.
 */
const usePageScrollbar = (
    trackRef: RefObject<HTMLDivElement | null>,
    thumbRef: RefObject<HTMLDivElement | null>,
) => {
    useEffect(() => {
        const track = trackRef.current;
        const thumb = thumbRef.current;
        if (!track || !thumb) return;
        const page = document.documentElement;

        const measure = () => {
            const maxScroll = page.scrollHeight - page.clientHeight;
            const trackHeight = track.clientHeight;
            const thumbHeight = Math.max(
                MIN_THUMB_HEIGHT,
                (trackHeight * page.clientHeight) / page.scrollHeight,
            );
            return {
                maxScroll,
                thumbHeight,
                travel: trackHeight - thumbHeight,
            };
        };

        let frame = 0;
        const draw = () => {
            frame = 0;
            const { maxScroll, thumbHeight, travel } = measure();
            track.dataset.scrollable = String(maxScroll > 0);
            if (maxScroll <= 0) return;
            const top = (page.scrollTop / maxScroll) * travel;
            thumb.style.height = `${thumbHeight}px`;
            thumb.style.transform = `translateY(${top}px)`;
        };
        const redraw = () => {
            frame ||= requestAnimationFrame(draw);
        };

        let idle: ReturnType<typeof setTimeout> | undefined;
        const onScroll = () => {
            redraw();
            track.dataset.scrolling = "";
            clearTimeout(idle);
            idle = setTimeout(() => delete track.dataset.scrolling, IDLE_MS);
        };

        const onPointerDown = (down: PointerEvent) => {
            if (down.button !== 0) return;
            // Stops the drag selecting text.
            down.preventDefault();
            const { maxScroll, travel } = measure();
            const startScroll = page.scrollTop;
            thumb.setPointerCapture(down.pointerId);
            track.dataset.dragging = "";

            const onMove = (move: PointerEvent) => {
                const moved = move.clientY - down.clientY;
                window.scrollTo({
                    top: startScroll + (moved * maxScroll) / travel,
                    behavior: "instant",
                });
            };
            const onEnd = () => {
                thumb.removeEventListener("pointermove", onMove);
                thumb.removeEventListener("pointerup", onEnd);
                thumb.removeEventListener("pointercancel", onEnd);
                delete track.dataset.dragging;
            };
            thumb.addEventListener("pointermove", onMove);
            thumb.addEventListener("pointerup", onEnd);
            thumb.addEventListener("pointercancel", onEnd);
        };

        // The page's height changes when content loads or the route changes.
        const resizes = new ResizeObserver(redraw);
        resizes.observe(document.body);
        resizes.observe(track);
        window.addEventListener("scroll", onScroll, { passive: true });
        thumb.addEventListener("pointerdown", onPointerDown);
        draw();

        return () => {
            resizes.disconnect();
            window.removeEventListener("scroll", onScroll);
            thumb.removeEventListener("pointerdown", onPointerDown);
            cancelAnimationFrame(frame);
            clearTimeout(idle);
        };
    }, [trackRef, thumbRef]);
};

export { usePageScrollbar };
