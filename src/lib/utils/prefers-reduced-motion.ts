/** Whether the visitor has asked for less motion. False on the server. */
const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { prefersReducedMotion };
