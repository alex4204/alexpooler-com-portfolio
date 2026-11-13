"use client";

import { useEffect } from "react";
import { motion } from "motion/react";

/**
 * The first load renders visible, so the server HTML is readable without
 * JavaScript. Only later navigations fade in.
 */
let hasNavigated = false;

/** Unlike a layout, a template remounts on every navigation, so it replays. */
const Template = ({ children }: LayoutProps<"/">) => {
    useEffect(() => {
        hasNavigated = true;
    }, []);

    return (
        <motion.div
            className="flex min-w-0 flex-1"
            initial={hasNavigated ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
};

export default Template;
