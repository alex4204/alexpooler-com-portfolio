/** "How it works" becomes "how-it-works". Safe to use as an id or anchor. */
const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

export { slugify };
