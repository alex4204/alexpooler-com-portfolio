import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RoleArticle } from "@/components/article/role-article";
import { getEntries, getEntry } from "@/lib/content/content";

const generateStaticParams = async () =>
    (await getEntries("role")).map((role) => ({ slug: role.slug }));

const generateMetadata = async ({
    params,
}: PageProps<"/experience/[slug]">): Promise<Metadata> => {
    const { slug } = await params;
    const role = await getEntry("role", slug);
    return role
        ? {
              title: `${role.title}, ${role.organisation}`,
              description: role.summary,
          }
        : {};
};

const ExperiencePageContent = async ({
    params,
}: PageProps<"/experience/[slug]">) => {
    const { slug } = await params;
    const role = await getEntry("role", slug);
    if (!role) notFound();
    return <RoleArticle entry={role} />;
};

const ExperiencePage = (props: PageProps<"/experience/[slug]">) => (
    <Suspense>
        <ExperiencePageContent {...props} />
    </Suspense>
);

export { generateMetadata, generateStaticParams };
export default ExperiencePage;
