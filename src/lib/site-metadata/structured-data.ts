import "server-only";

import { getEntries, getProfile } from "@/lib/content/content";

/** Who the site is about, as schema.org structured data for search and AI. */
const getPersonJsonLd = async () => {
    const [profile, roles, education] = await Promise.all([
        getProfile(),
        getEntries("role"),
        getEntries("education"),
    ]);
    const currentRole = roles.find((role) => !role.span.end);
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        url: profile.url,
        description: profile.tagline,
        ...(currentRole && {
            jobTitle: currentRole.title,
            worksFor: {
                "@type": "Organization",
                name: currentRole.organisation,
            },
        }),
        alumniOf: [
            ...new Set(education.map((course) => course.organisation)),
        ].map((name) => ({ "@type": "EducationalOrganization", name })),
        homeLocation: { "@type": "Place", name: profile.location },
        sameAs: profile.links.map((link) => link.href),
    };
};

export { getPersonJsonLd };
