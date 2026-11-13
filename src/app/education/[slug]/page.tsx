import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RoleArticle } from "@/components/article/role-article";
import { getEntries, getEntry } from "@/lib/content/content";
import { getPageMetadata } from "@/lib/site-metadata/page-metadata";

const generateStaticParams = async () =>
    (await getEntries("education")).map((course) => ({ slug: course.slug }));

const generateMetadata = async ({
    params,
}: PageProps<"/education/[slug]">): Promise<Metadata> => {
    const { slug } = await params;
    const course = await getEntry("education", slug);
    return course
        ? getPageMetadata({
              title: course.title,
              description: course.summary,
              path: course.href,
          })
        : {};
};

const EducationPageContent = async ({
    params,
}: PageProps<"/education/[slug]">) => {
    const { slug } = await params;
    const course = await getEntry("education", slug);
    if (!course) notFound();
    return <RoleArticle entry={course} />;
};

const EducationPage = (props: PageProps<"/education/[slug]">) => (
    <Suspense>
        <EducationPageContent {...props} />
    </Suspense>
);

export { generateMetadata, generateStaticParams };
export default EducationPage;
