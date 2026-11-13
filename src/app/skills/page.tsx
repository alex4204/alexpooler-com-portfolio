import type { Metadata } from "next";

import { ArticleLayout } from "@/components/article/article-layout";
import { SkillsList, type SkillLetter } from "@/components/article/skills-list";
import { getEntriesUsing, getSkills, skillId } from "@/lib/content/content";

const metadata = {
    title: "Skills, A to Z",
    description:
        "Every technology I work with, and the projects and roles that reference it.",
} satisfies Metadata;

/** Every skill with the pages that reference it, grouped by first letter. */
const getSkillLetters = async () => {
    const letters = new Map<string, SkillLetter>();
    for (const name of await getSkills()) {
        const letter = name[0].toUpperCase();
        const group = letters.get(letter) ?? {
            id: `letter-${letter.toLowerCase()}`,
            letter,
            skills: [],
        };
        group.skills.push({
            name,
            id: skillId(name),
            references: (await getEntriesUsing(name)).map((entry) => ({
                href: entry.href,
                label: entry.label,
            })),
        });
        letters.set(letter, group);
    }
    return [...letters.values()];
};

const SkillsPage = async () => {
    const letters = await getSkillLetters();
    return (
        <ArticleLayout
            href="/skills"
            title={metadata.title}
            description={metadata.description}
            sections={[]}
            contents={letters.map((group) => ({
                id: group.id,
                title: group.letter,
            }))}
        >
            <SkillsList letters={letters} />
        </ArticleLayout>
    );
};

export { metadata };
export default SkillsPage;
