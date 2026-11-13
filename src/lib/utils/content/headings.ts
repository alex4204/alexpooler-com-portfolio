import type { Heading } from "@/lib/types/content";
import { slugify } from "@/lib/utils/slug";

const FENCE = /^\s*(```|~~~)/;
const NEWLINE = /\r?\n/;

/** The `##` headings of some Markdown, ignoring any inside code fences. */
const headingsOf = (markdown: string) => {
    let isFenced = false;
    const headings: Heading[] = [];
    for (const line of markdown.split(NEWLINE)) {
        if (FENCE.test(line)) isFenced = !isFenced;
        if (isFenced || !line.startsWith("## ")) continue;
        // As the reader sees it: link text without its URL, and no code marks.
        const title = line
            .slice(3)
            .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
            .replace(/`/g, "")
            .trim();
        headings.push({ id: slugify(title), title });
    }
    return headings;
};

export { headingsOf };
