"use client";

import { useSyncExternalStore } from "react";

import type { Span } from "@/lib/types/content";
import { formatDuration, monthsCovered } from "@/lib/utils/content/dates";

const subscribe = () => () => {};
const getServerSnapshot = () => null;

/**
 * Time worked, measured against the reader's clock. It renders nothing on the
 * server, so a page built months ago never shows a stale figure.
 */
const ExperienceDuration = ({ spans }: { spans: Span[] }) => {
    const label = useSyncExternalStore(
        subscribe,
        () => formatDuration(monthsCovered(spans, new Date())),
        getServerSnapshot,
    );
    return <>{label}</>;
};

export { ExperienceDuration };
