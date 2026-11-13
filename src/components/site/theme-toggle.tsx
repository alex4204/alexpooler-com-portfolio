"use client";

import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleTheme } from "@/lib/theme";

// Both icons render and CSS shows the right one, so the server and browser agree.
const ThemeToggle = () => (
    <Button
        variant="outline"
        size="icon"
        aria-label="Toggle dark mode"
        className="relative overflow-hidden"
        onPress={toggleTheme}
    >
        <SunIcon className="scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90" />
        <MoonIcon className="absolute scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0" />
    </Button>
);

export { ThemeToggle };
