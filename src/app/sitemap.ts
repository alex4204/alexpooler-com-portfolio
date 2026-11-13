import type { MetadataRoute } from "next";

import { getAllEntries, getProfile } from "@/lib/content/content";

/** Every page on the site, for search engines. */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
    const [profile, entries] = await Promise.all([
        getProfile(),
        getAllEntries(),
    ]);
    const paths = ["/", "/skills", ...entries.map((entry) => entry.href)];
    return paths.map((path) => ({ url: new URL(path, profile.url).href }));
};

export default sitemap;
