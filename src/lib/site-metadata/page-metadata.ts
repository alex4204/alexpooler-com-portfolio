import "server-only";

import type { Metadata } from "next";

import { getProfile } from "@/lib/content/content";

/** Made by app/opengraph-image.tsx, whose one image has the id "site". */
const PREVIEW_IMAGE = {
    url: "/opengraph-image/site",
    width: 1200,
    height: 630,
};

type PageDetails = {
    /** Left out on the home page, which uses the site's name. */
    title?: string;
    description: string;
    /** The page's own path, such as "/projects/adsum". */
    path: string;
};

/**
 * Title, description, canonical address and link-preview tags for one page.
 * A page's `openGraph` replaces the layout's rather than merging with it,
 * image included, so every page sets all of it.
 */
const getPageMetadata = async ({
    title,
    description,
    path,
}: PageDetails): Promise<Metadata> => {
    const profile = await getProfile();
    const fullTitle = title ? `${title} · ${profile.name}` : profile.name;
    const image = {
        ...PREVIEW_IMAGE,
        alt: `${profile.name}: ${profile.tagline}`,
    };
    return {
        ...(title && { title }),
        description,
        alternates: { canonical: path },
        openGraph: {
            type: "website",
            siteName: profile.name,
            locale: "en_GB",
            title: fullTitle,
            description,
            url: path,
            images: [image],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [image],
        },
    };
};

export { getPageMetadata };
