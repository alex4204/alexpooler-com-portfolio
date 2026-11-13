import { ArticleLayout } from "@/components/article/article-layout";
import { EntryBody, entryContents } from "@/components/article/entry-body";
import { EntryMeta, entryFacts } from "@/components/article/entry-parts";
import { FactTable } from "@/components/article/fact-table";
import { ProjectPreview } from "@/components/article/project-preview";
import type { Project } from "@/lib/types/content";

const ProjectArticle = ({ project }: { project: Project }) => (
    <ArticleLayout
        href={project.href}
        title={project.title}
        meta={<EntryMeta entry={project} />}
        description={project.summary}
        sections={[
            {
                id: "overview",
                title: "Overview",
                content: (
                    <>
                        <ProjectPreview hue={project.hue} />
                        <FactTable
                            facts={entryFacts(project, { period: "Type" })}
                        />
                    </>
                ),
            },
        ]}
        contents={entryContents(project)}
    >
        <EntryBody entry={project} />
    </ArticleLayout>
);

export { ProjectArticle };
