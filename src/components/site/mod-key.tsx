"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const isApple = () => /Mac|iPhone|iPad/.test(navigator.userAgent);

/**
 * The key shortcuts are held with: "⌘" on Apple devices, "Ctrl" elsewhere.
 * Pages are built ahead of time, so the server says "Ctrl" and the browser
 * corrects it once it loads.
 */
const ModKey = () =>
    useSyncExternalStore(
        subscribe,
        () => (isApple() ? "⌘" : "Ctrl"),
        () => "Ctrl",
    );

export { ModKey };
