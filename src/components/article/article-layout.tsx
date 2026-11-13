import type { ReactNode } from "react";

import { Pager } from "@/components/article/pager";
import { SectionHeading } from "@/components/article/section-heading";
import { TableOfContents } from "@/components/site/table-of-contents";
import { getGroupTitle, getPager } from "@/lib/navigation";

type ArticleSection = {
    id: string;
    title: string;
    content: ReactNode;
};

type ArticleLayoutProps = {
    /** This page's own path; drives the eyebrow and the previous/next links. */
    href: string;
    title: ReactNode;
    description: string;
    meta?: ReactNode;
    sections: ArticleSection[];
    /** Rendered after the sections. Its `##` headings go in `contents`. */
    children?: ReactNode;
    /** Contents list. Defaults to the sections. */
    contents?: { id: string; title: string }[];
};

const ArticleLayout = async ({
    href,
    title,
    description,
    meta,
    sections,
    children,
    contents,
}: ArticleLayoutProps) => {
    const [group, { previous, next }] = await Promise.all([
        getGroupTitle(href),
        getPager(href),
    ]);

    return (
        <div className="flex min-w-0 flex-1">
            <main className="min-w-0 flex-1 px-5 py-10 lg:px-14">
                <article className="mx-auto max-w-3xl">
                    {group && (
                        <p className="mb-3 text-sm text-foreground/55 italic">
                            {group.toLowerCase()}
                        </p>
                    )}
                    <h1 className="text-5xl leading-[1.05] font-semibold tracking-tight md:text-6xl">
                        {title}
                    </h1>
                    {meta}
                    <p className="mt-5 max-w-xl text-lg leading-8 text-foreground/65">
                        {description}
                    </p>

                    {sections.map((section) => (
                        <section
                            key={section.id}
                            id={section.id}
                            aria-labelledby={`${section.id}-heading`}
                            className="scroll-mt-20"
                        >
                            <SectionHeading id={`${section.id}-heading`}>
                                {section.title}
                            </SectionHeading>
                            {section.content}
                        </section>
                    ))}

                    {children}

                    <Pager previous={previous} next={next} />
                </article>
            </main>

            <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto py-10 pr-6 xl:block">
                <TableOfContents
                    items={[
                        ...sections.map((section) => ({
                            id: section.id,
                            title: section.title,
                        })),
                        ...(contents ?? []),
                    ]}
                />
            </aside>
        </div>
    );
};

export { ArticleLayout, type ArticleSection };
