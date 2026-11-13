import "server-only";

import {
    getAllEntries,
    getEntries,
    getProfile,
    getRolesByCompany,
    getSkills,
} from "@/lib/content/content";
import type { Entry } from "@/lib/types/content";
import type { NavGroup, NavItem, SearchItem } from "@/lib/types/navigation";

const toNavItem = (entry: Entry): NavItem => ({
    href: entry.href,
    label: entry.label,
});

const getNavGroups = async (): Promise<NavGroup[]> => {
    const [profile, projects, companies, education] = await Promise.all([
        getProfile(),
        getEntries("project"),
        getRolesByCompany(),
        getEntries("education"),
    ]);

    return [
        { items: [{ href: "/", label: "About" }] },
        { title: "Projects", items: projects.map(toNavItem) },
        {
            title: "Experience",
            spans: companies.flatMap(({ roles }) =>
                roles.map((role) => role.span),
            ),
            items: companies.flatMap(({ organisation, roles }) =>
                roles.map((role) => ({
                    ...toNavItem(role),
                    company: {
                        name: organisation,
                        spans: roles.map((each) => each.span),
                    },
                })),
            ),
        },
        { title: "Education", items: education.map(toNavItem) },
        { title: "Skills", items: [{ href: "/skills", label: "All skills" }] },
        { items: profile.links.map((link) => ({ ...link, external: true })) },
    ];
};

/** The site's own pages in sidebar order, each with its group's title. */
const getPages = async () =>
    (await getNavGroups()).flatMap((group) =>
        group.items
            .filter((item) => !item.external)
            .map((item) => ({ ...item, group: group.title })),
    );

/** The pages either side of `href`, for the links at the foot of a page. */
const getPager = async (href: string) => {
    const pages = await getPages();
    const index = pages.findIndex((page) => page.href === href);
    return {
        previous: index > 0 ? pages[index - 1] : undefined,
        next:
            index >= 0 && index < pages.length - 1
                ? pages[index + 1]
                : undefined,
    };
};

const getGroupTitle = async (href: string) =>
    (await getPages()).find((page) => page.href === href)?.group;

const getSearchItems = async (): Promise<SearchItem[]> => {
    const [pages, entries, skills] = await Promise.all([
        getPages(),
        getAllEntries(),
        getSkills(),
    ]);

    return pages.map((page) => {
        const entry = entries.find((each) => each.href === page.href);
        const keywords = entry
            ? [
                  entry.title,
                  entry.organisation,
                  entry.period,
                  entry.summary,
                  ...entry.stack,
              ].join(" ")
            : page.href === "/skills"
              ? skills.join(" ")
              : "about overview hobbies";
        return { ...page, group: page.group ?? "Pages", keywords };
    });
};

export { getGroupTitle, getNavGroups, getPager, getSearchItems };
