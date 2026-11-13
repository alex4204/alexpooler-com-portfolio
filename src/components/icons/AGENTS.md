# Custom icons

Icons come from `lucide-react` everywhere else. This folder is only for icons Lucide doesn't have, such as brand logos: Lucide leaves those out on purpose.

Before adding one here, check Lucide first. If it has a suitable icon, use that instead.

Each icon:

- is its own file, named `<name>-icon.tsx`, exporting one component (`GitHubIcon`);
- takes `ComponentProps<"svg">` and spreads them onto the `<svg>`, so it can be sized and labelled like a Lucide icon;
- uses `viewBox="0 0 24 24"` and `fill="currentColor"`, so it follows the text colour in both themes, never a hard-coded colour;
- is `aria-hidden="true"`: the link or button around it carries the accessible name.

Brand logos are their owners' trademarks. Use them only to link to that brand, such as a profile page.
