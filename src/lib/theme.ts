/*
 * The theme follows the system setting through CSS, so it's right before
 * the first paint with no script. The toggle can override it for the rest of
 * the tab: the choice is a "dark" or "light" class on <html>, kept in session
 * storage. public/theme.js puts it back on a reload, before the first paint.
 */

type Theme = "light" | "dark";

/** public/theme.js reads the same key. */
const STORAGE_KEY = "theme";

const root = () => document.documentElement;

const isDark = () =>
    root().classList.contains("dark") ||
    (!root().classList.contains("light") &&
        matchMedia("(prefers-color-scheme: dark)").matches);

const showTheme = (theme: Theme) => {
    root().classList.remove("light", "dark");
    root().classList.add(theme);
};

/** Switches to the other theme for the rest of this tab. */
const toggleTheme = () => {
    const theme = isDark() ? "light" : "dark";
    showTheme(theme);
    try {
        sessionStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // Storage can be blocked. The choice then lasts until a reload.
    }
};

export { toggleTheme };
