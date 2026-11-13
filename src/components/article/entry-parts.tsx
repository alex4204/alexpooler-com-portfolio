import type { Fact } from "@/components/article/fact-table";
import {
    ExternalTextLink,
    LinkList,
    Paragraph,
} from "@/components/article/prose";
import type { Entry } from "@/lib/types/content";
import { getRelatedEntries, skillId } from "@/lib/content/content";

/** "project · 2023", or "role · HighRoads · Jun 2024 — Sep 2025". */
const EntryMeta = ({ entry }: { entry: Entry }) => (
    <p className="mt-3 flex flex-wrap items-baseline gap-3 text-sm">
        <span className="text-foreground/55 italic">{entry.kind}</span>
        {entry.organisation && (
            <span className="text-foreground/55">{entry.organisation}</span>
        )}
        <span className="text-foreground/45">{entry.period}</span>
    </p>
);

const SkillLinks = ({ skills }: { skills: string[] }) => (
    <LinkList
        links={skills.map((skill) => ({
            href: `/skills#${skillId(skill)}`,
            label: skill,
        }))}
    />
);

/** Rows for the facts table. Skips anything the entry doesn't have. */
const entryFacts = (entry: Entry, labels: { period: string }): Fact[] => [
    ...(entry.organisation
        ? [
              [
                  entry.kind === "project" ? "For" : "Organisation",
                  entry.organisation,
              ] satisfies Fact,
          ]
        : []),
    ...(entry.location ? [["Location", entry.location] satisfies Fact] : []),
    [labels.period, entry.period],
    ...(entry.stack.length > 0
        ? [
              [
                  "Stack",
                  <SkillLinks key="stack" skills={entry.stack} />,
              ] satisfies Fact,
          ]
        : []),
    ...(entry.links ?? []).map((link): Fact => [
        link.label,
        <ExternalTextLink key={link.href} href={link.href}>
            {link.href.replace(/^https:\/\/(www\.)?/, "")}
        </ExternalTextLink>,
    ]),
];

/** The skills behind an entry, and other work that shares them. */
const SeeAlso = async ({ entry }: { entry: Entry }) => {
    const related = await getRelatedEntries(entry);
    return (
        <Paragraph>
            <span className="italic">Skills: </span>
            <SkillLinks skills={entry.stack} />
            {related.length > 0 && (
                <>
                    <br />
                    <span className="italic">Related: </span>
                    <LinkList
                        links={related.map((other) => ({
                            href: other.href,
                            label: other.label,
                        }))}
                    />
                </>
            )}
        </Paragraph>
    );
};

export { EntryMeta, SeeAlso, entryFacts };
