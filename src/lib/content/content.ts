import "server-only";

import { cacheLife } from "next/cache";
import { z } from "zod";

import { loadCollection, loadData } from "@/lib/content/loader";
import {
    educationSchema,
    profileSchema,
    projectSchema,
    roleSchema,
    skillGroupSchema,
    type Education,
    type Entry,
    type EntryKind,
    type Project,
    type Role,
} from "@/lib/types/content";
import { slugify } from "@/lib/utils/slug";

/*
 * Everything the site shows, read from `content/`. Pages import from here.
 *
 * The getters use "use cache" with the `max` profile: content only changes
 * with a deploy, so each file is read once while the site is prerendered.
 */

type Collections = {
    project: Project[];
    role: Role[];
    education: Education[];
};

/** The page adds sections with these ids itself, so entries can't use them. */
const RESERVED_HEADINGS = ["overview", "summary", "see-also"];

const newestFirst = (a: Role | Education, b: Role | Education) =>
    b.span.start.localeCompare(a.span.start);

const getProfile = async () => {
    "use cache";
    cacheLife("max");
    return loadData("profile.yaml", profileSchema);
};

const getSkillGroups = async () => {
    "use cache";
    cacheLife("max");
    return loadData("skills.yaml", z.array(skillGroupSchema));
};

/** Every skill, A to Z. */
const getSkills = async () =>
    (await getSkillGroups())
        .flatMap((group) => group.skills)
        .sort((a, b) => a.localeCompare(b));

/**
 * Checks that span more than one file, which a schema can't do. Throws with
 * every problem at once, so one build shows everything to fix.
 */
const checkEntries = (entries: Entry[], skills: string[]) => {
    const problems = entries.flatMap((entry) => [
        ...entry.stack
            .filter((skill) => !skills.includes(skill))
            .map(
                (skill) =>
                    `content${entry.href}.mdx: "${skill}" isn't in content/skills.yaml`,
            ),
        ...entry.headings
            .filter((heading) => RESERVED_HEADINGS.includes(heading.id))
            .map(
                (heading) =>
                    `content${entry.href}.mdx: "## ${heading.title}" clashes with a built-in section`,
            ),
    ]);
    if (problems.length > 0) throw new Error(problems.join("\n"));
};

/** Every entry, sorted and checked. The other entry getters build on this. */
const getCollections = async (): Promise<Collections> => {
    "use cache";
    cacheLife("max");
    const [projects, roles, education, skills] = await Promise.all([
        loadCollection("projects", projectSchema),
        loadCollection("experience", roleSchema),
        loadCollection("education", educationSchema),
        getSkills(),
    ]);
    checkEntries([...projects, ...roles, ...education], skills);

    return {
        project: projects.sort((a, b) => a.order - b.order),
        role: roles.sort(newestFirst),
        education: education.sort(newestFirst),
    };
};

const getEntries = async <Kind extends EntryKind>(
    kind: Kind,
): Promise<Collections[Kind]> => (await getCollections())[kind];

const getEntry = async <Kind extends EntryKind>(
    kind: Kind,
    slug: string,
): Promise<Collections[Kind][number] | undefined> =>
    (await getEntries(kind)).find((entry) => entry.slug === slug);

/** Projects, then experience, then education: the order of the sidebar. */
const getAllEntries = async (): Promise<Entry[]> => {
    const { project, role, education } = await getCollections();
    return [...project, ...role, ...education];
};

/** Roles grouped by employer, most recent employer first. */
const getRolesByCompany = async () => {
    const byCompany = new Map<string, Role[]>();
    for (const role of await getEntries("role")) {
        byCompany.set(role.organisation, [
            ...(byCompany.get(role.organisation) ?? []),
            role,
        ]);
    }
    return [...byCompany].map(([organisation, roles]) => ({
        organisation,
        roles,
    }));
};

const getEntriesUsing = async (skill: string) =>
    (await getAllEntries()).filter((entry) => entry.stack.includes(skill));

/** Other work that shares at least one skill with this entry. */
const getRelatedEntries = async (entry: Entry) =>
    (await getAllEntries()).filter(
        (other) =>
            other.href !== entry.href &&
            other.stack.some((skill) => entry.stack.includes(skill)),
    );

/** The anchor for a skill on the skills page. */
const skillId = (skill: string) => `skill-${slugify(skill)}`;

/** "Junior Software Engineer at HighRoads", or just the project name. */
const describeEntry = (entry: Entry) =>
    entry.kind === "project" || !entry.organisation
        ? entry.title
        : `${entry.title} at ${entry.organisation}`;

export {
    describeEntry,
    getAllEntries,
    getEntries,
    getEntriesUsing,
    getEntry,
    getProfile,
    getRelatedEntries,
    getRolesByCompany,
    getSkillGroups,
    getSkills,
    skillId,
};
