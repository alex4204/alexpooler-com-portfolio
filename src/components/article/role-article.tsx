import { ArticleLayout } from "@/components/article/article-layout";
import { EntryBody, entryContents } from "@/components/article/entry-body";
import { EntryMeta, entryFacts } from "@/components/article/entry-parts";
import { FactTable } from "@/components/article/fact-table";
import type { Education, Role } from "@/lib/types/content";

/** A job or a course: where, when, what with, and what came of it. */
const RoleArticle = ({ entry }: { entry: Role | Education }) => (
    <ArticleLayout
        href={entry.href}
        title={entry.title}
        meta={<EntryMeta entry={entry} />}
        description={entry.summary}
        sections={[
            {
                id: "summary",
                title: "Summary",
                content: (
                    <FactTable
                        facts={entryFacts(entry, { period: "Period" })}
                    />
                ),
            },
        ]}
        contents={entryContents(entry)}
    >
        <EntryBody entry={entry} />
    </ArticleLayout>
);

export { RoleArticle };
