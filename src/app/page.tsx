import Link from "next/link";

import { ArticleLayout } from "@/components/article/article-layout";
import { FactTable } from "@/components/article/fact-table";
import { Callout, Paragraph } from "@/components/article/prose";
import { ExperienceDuration } from "@/components/site/experience-duration";
import { JsonLd } from "@/components/site/json-ld";
import { ModKey } from "@/components/site/mod-key";
import { Kbd } from "@/components/ui/kbd";
import { getEntries, getProfile } from "@/lib/content/content";
import { getPersonJsonLd } from "@/lib/site-metadata/structured-data";

const AboutPage = async () => {
    const [profile, projects, roles, person] = await Promise.all([
        getProfile(),
        getEntries("project"),
        getEntries("role"),
        getPersonJsonLd(),
    ]);
    const experienceSpans = roles.map((role) => role.span);

    // Each card opens the first page of its section, if the section has one.
    const startingPoints = [
        projects[0] && {
            href: projects[0].href,
            title: "Projects",
            description: "Things I've built and why.",
        },
        roles[0] && {
            href: roles[0].href,
            title: "Experience",
            description: "Where I've worked.",
            spans: experienceSpans,
        },
        {
            href: "/skills",
            title: "Skills",
            description: "Every technology I work with, A to Z.",
        },
    ].filter((point) => point !== undefined);

    return (
        <>
            <JsonLd data={person} />
            <ArticleLayout
                href="/"
                title={profile.name}
                description={profile.tagline}
                sections={[
                    {
                        id: "overview",
                        title: "Overview",
                        content: (
                            <>
                                <Paragraph>{profile.intro}</Paragraph>
                                <FactTable
                                    facts={[
                                        ["Role", profile.role],
                                        [
                                            "Experience",
                                            <ExperienceDuration
                                                key="experience"
                                                spans={experienceSpans}
                                            />,
                                        ],
                                        ["Based in", profile.location],
                                        ["Mostly", profile.focus],
                                        ["Education", profile.education],
                                    ]}
                                />
                            </>
                        ),
                    },
                    {
                        id: "where-to-start",
                        title: "Where to start",
                        content: (
                            <div className="my-4 grid gap-3 sm:grid-cols-3">
                                {startingPoints.map((point) => (
                                    <Link
                                        key={point.href}
                                        href={point.href}
                                        className="group block h-full rounded-xl border border-foreground/10 p-4 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-foreground/[0.03]"
                                    >
                                        <span className="flex items-center justify-between font-medium">
                                            <span>
                                                {point.title}
                                                {point.spans && (
                                                    <span className="ml-2 text-xs font-normal text-foreground/45 tabular-nums">
                                                        <ExperienceDuration
                                                            spans={point.spans}
                                                        />
                                                    </span>
                                                )}
                                            </span>
                                            <span className="text-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-foreground">
                                                →
                                            </span>
                                        </span>
                                        <span className="mt-1 block text-sm text-foreground/55">
                                            {point.description}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ),
                    },
                    {
                        id: "outside-work",
                        title: "Outside of work",
                        content: <Paragraph>{profile.outsideWork}</Paragraph>,
                    },
                    {
                        id: "ask",
                        title: "Prefer to ask?",
                        content: (
                            <Callout title="Search or ask">
                                {/* Phones have no keyboard shortcut to offer. */}
                                <span className="sm:hidden">
                                    Search every page from the search bar,
                                </span>
                                <span className="hidden sm:inline">
                                    Press{" "}
                                    <Kbd>
                                        <ModKey />
                                    </Kbd>{" "}
                                    <Kbd>K</Kbd> to search every page,
                                </span>{" "}
                                or use <b>Ask AI</b> in the top bar to question
                                my experience in plain English. It answers from
                                the content on this site and links its sources.
                            </Callout>
                        ),
                    },
                ]}
            />
        </>
    );
};

export default AboutPage;
