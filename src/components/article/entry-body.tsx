import { SeeAlso } from "@/components/article/entry-parts";
import { SectionHeading } from "@/components/article/section-heading";
import type { Entry } from "@/lib/types/content";

/** The entry's .mdx file, then "See also" when it has skills to link. */
const EntryBody = async ({ entry }: { entry: Entry }) => {
    // Pages mirror files: /projects/adsum is content/projects/adsum.mdx. The
    // literal `@content/` prefix tells the bundler which folder to include.
    const file = entry.href.slice(1);
    const { default: Body } = await import(`@content/${file}.mdx`);
    return (
        <>
            <Body />
            {entry.stack.length > 0 && (
                <>
                    <SectionHeading id="see-also">See also</SectionHeading>
                    <SeeAlso entry={entry} />
                </>
            )}
        </>
    );
};

/** Contents-list items for the entry's own headings, plus "See also". */
const entryContents = (entry: Entry) => [
    ...entry.headings,
    ...(entry.stack.length > 0 ? [{ id: "see-also", title: "See also" }] : []),
];

export { EntryBody, entryContents };
