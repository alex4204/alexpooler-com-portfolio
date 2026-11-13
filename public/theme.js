// Puts back this tab's theme choice before the page is first drawn, so it
// never flashes. It loads from <head> and blocks rendering on purpose, which
// is why it's a tiny plain script. The choice is made in src/lib/theme.ts.
try {
    var theme = sessionStorage.getItem("theme");
    if (theme === "light" || theme === "dark") {
        document.documentElement.classList.add(theme);
    }
} catch {
    // Storage can be blocked. The system setting applies.
}
