import "server-only";

import {
    describeEntry,
    getProfile,
    getPublishedEntries,
    getSkillGroups,
} from "@/lib/content/content";
import type { Entry } from "@/lib/types/content";

const SECTIONS = [
    { kind: "project", title: "Projects" },
    { kind: "role", title: "Experience" },
    { kind: "education", title: "Education" },
] as const;

const statusOf = (entry: Entry) =>
    entry.kind === "project" && entry.inProgress ? " (in progress)" : "";

/**
 * `/llms.txt`: a Markdown index of the site for AI tools, following the
 * llmstxt.org convention. `/llms-full.txt` has every page's text.
 */
const getLlmsIndex = async () => {
    const [profile, entries] = await Promise.all([
        getProfile(),
        getPublishedEntries(),
    ]);
    const link = (path: string) => new URL(path, profile.url).href;
    return [
        `# ${profile.name}`,
        `> ${profile.tagline}`,
        profile.intro,
        "## Pages",
        [
            `- [About](${link("/")}): ${profile.role}, based in ${profile.location}.`,
            `- [Skills, A to Z](${link("/skills")}): every technology, with the pages that reference it.`,
            `- [Full text](${link("/llms-full.txt")}): every page below in one file.`,
        ].join("\n"),
        ...SECTIONS.flatMap(({ kind, title }) => [
            `## ${title}`,
            entries
                .filter((entry) => entry.kind === kind)
                .map(
                    (entry) =>
                        `- [${describeEntry(entry)}](${link(entry.href)})${statusOf(entry)}: ${entry.summary}`,
                )
                .join("\n"),
        ]),
        "## Elsewhere",
        [...profile.links, ...profile.siteLinks]
            .map((each) => `- [${each.label}](${each.href})`)
            .join("\n"),
    ].join("\n\n");
};

/** `/llms-full.txt`: the profile, skills and every page's text as Markdown. */
const getLlmsFullText = async () => {
    const [profile, skillGroups, entries] = await Promise.all([
        getProfile(),
        getSkillGroups(),
        getPublishedEntries(),
    ]);
    const link = (path: string) => new URL(path, profile.url).href;
    const page = (entry: Entry) =>
        [
            `## ${describeEntry(entry)}${statusOf(entry)}`,
            [
                `Page: ${link(entry.href)}`,
                `When: ${entry.period}`,
                entry.location && `Location: ${entry.location}`,
                entry.stack.length > 0 && `Skills: ${entry.stack.join(", ")}`,
                ...(entry.links ?? []).map(
                    (each) => `${each.label}: ${each.href}`,
                ),
            ]
                .filter(Boolean)
                .join("\n"),
            entry.summary,
            entry.body.trim(),
        ].join("\n\n");
    return [
        `# ${profile.name}`,
        `> ${profile.tagline}`,
        [
            `Role: ${profile.role}`,
            `Based in: ${profile.location}`,
            `Education: ${profile.education}`,
            ...profile.links.map((each) => `${each.label}: ${each.href}`),
        ].join("\n"),
        profile.intro,
        profile.outsideWork,
        "## Skills",
        skillGroups
            .map((group) => `- ${group.name}: ${group.skills.join(", ")}`)
            .join("\n"),
        ...entries.map(page),
    ].join("\n\n");
};

export { getLlmsFullText, getLlmsIndex };
