import type { MetadataRoute } from "next";

import { getProfile } from "@/lib/content/content";

/** Everything may be crawled except Ask AI's API. */
const robots = async (): Promise<MetadataRoute.Robots> => {
    const profile = await getProfile();
    return {
        rules: { userAgent: "*", allow: "/", disallow: "/api/" },
        sitemap: new URL("/sitemap.xml", profile.url).href,
    };
};

export default robots;
