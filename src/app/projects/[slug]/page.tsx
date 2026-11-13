import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProjectArticle } from "@/components/article/project-article";
import { getEntries, getEntry } from "@/lib/content/content";

const generateStaticParams = async () =>
    (await getEntries("project")).map((project) => ({ slug: project.slug }));

const generateMetadata = async ({
    params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> => {
    const { slug } = await params;
    const project = await getEntry("project", slug);
    return project
        ? { title: project.title, description: project.summary }
        : {};
};

const ProjectPageContent = async ({
    params,
}: PageProps<"/projects/[slug]">) => {
    const { slug } = await params;
    const project = await getEntry("project", slug);
    if (!project) notFound();
    return <ProjectArticle project={project} />;
};

const ProjectPage = (props: PageProps<"/projects/[slug]">) => (
    <Suspense>
        <ProjectPageContent {...props} />
    </Suspense>
);

export { generateMetadata, generateStaticParams };
export default ProjectPage;
