"use client";

import { useState } from "react";

import { LinkList } from "@/components/article/prose";
import { SectionHeading } from "@/components/article/section-heading";
import { Input } from "@/components/ui/input";

type Skill = {
    name: string;
    /** Anchor for links such as /skills#skill-react. */
    id: string;
    references: { href: string; label: string }[];
};

type SkillLetter = { id: string; letter: string; skills: Skill[] };

/** A skill's name, or a page that references it: "adsum" finds Adsum's stack. */
const matches = (skill: Skill, query: string) =>
    [skill.name, ...skill.references.map((page) => page.label)].some((text) =>
        text.toLowerCase().includes(query),
    );

/**
 * The A to Z of skills, with a search that filters it as you type. Hidden
 * entries stay in the page, so anchors and the contents list keep working.
 */
const SkillsList = ({ letters }: { letters: SkillLetter[] }) => {
    const [query, setQuery] = useState("");
    const search = query.trim().toLowerCase();
    const isShown = (skill: Skill) => !search || matches(skill, search);
    const hasMatches = letters.some((group) => group.skills.some(isShown));

    return (
        <>
            <Input
                type="search"
                aria-label="Search skills"
                placeholder="Search skills or projects…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="mt-8"
            />
            {!hasMatches && (
                <p role="status" className="mt-6 text-foreground/60">
                    No skills match “{query.trim()}”.
                </p>
            )}

            {letters.map((group) => (
                <section
                    key={group.id}
                    id={group.id}
                    aria-labelledby={`${group.id}-heading`}
                    hidden={!group.skills.some(isShown)}
                    className="scroll-mt-20"
                >
                    <SectionHeading
                        id={`${group.id}-heading`}
                        className="text-6xl leading-none tracking-normal text-primary"
                    >
                        {group.letter}
                    </SectionHeading>
                    <ul className="my-4 space-y-5">
                        {group.skills.map((skill) => (
                            <li
                                key={skill.id}
                                id={skill.id}
                                hidden={!isShown(skill)}
                                className="scroll-mt-20"
                            >
                                <p className="text-xl font-semibold tracking-tight">
                                    {skill.name}
                                    <span className="ml-3 text-sm font-normal text-foreground/50 italic">
                                        skill
                                    </span>
                                </p>
                                {skill.references.length > 0 && (
                                    <p className="mt-0.5 text-[15px] leading-7 text-foreground/70">
                                        <span className="italic">
                                            Referenced in{" "}
                                        </span>
                                        <LinkList links={skill.references} />
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </>
    );
};

export { SkillsList, type SkillLetter };
