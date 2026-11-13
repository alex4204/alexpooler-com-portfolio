import { z } from "zod";

import { formatPeriod } from "@/lib/utils/content/dates";

const MONTH_FORMAT = /^(\d{4})-(0[1-9]|1[0-2])$/;

const nonEmpty = z.string().trim().min(1);

/** "YYYY-MM". */
const monthSchema = z.string().regex(MONTH_FORMAT, 'must look like "2024-06"');

const externalLinkSchema = z.object({
    label: nonEmpty,
    href: z.url(),
});

/** Frontmatter every kind of entry may have. */
const entryFields = {
    title: nonEmpty,
    /** Shorter name for the sidebar and link lists. Defaults to the title. */
    label: nonEmpty.optional(),
    /** Name in the sidebar, search and previous/next links. Defaults to the label. */
    sidebarLabel: nonEmpty.optional(),
    /** Employer, institution or client. */
    organisation: nonEmpty.optional(),
    location: nonEmpty.optional(),
    summary: nonEmpty,
    /** Every item here must also be listed in `content/skills.yaml`. */
    stack: z.array(nonEmpty).default([]),
    links: z.array(externalLinkSchema).optional(),
    /** Unfinished template. Keeps its page, but is left out of Ask AI answers. */
    draft: z.boolean().optional(),
};

/** Frontmatter of `content/projects/*.mdx`. Typos are rejected. */
const projectSchema = z
    .strictObject({
        ...entryFields,
        /** Free text, such as "Final-year project". Projects have no dates. */
        period: nonEmpty,
        /** Still being built: listed under "In progress" and badged on its page. */
        inProgress: z.boolean().optional(),
        /** Position in lists, lowest first. */
        order: z.number().int(),
        /** Placeholder screenshot colour until real images exist. */
        hue: z.number().optional(),
    })
    .transform((project) => ({
        ...project,
        kind: "project" as const,
        label: project.label ?? project.title,
    }));

/**
 * Roles and education share a shape: somewhere, from one month to another.
 * The `period` shown on the page is built from those months.
 */
const datedEntrySchema = <Kind extends "role" | "education">(kind: Kind) =>
    z
        .strictObject({
            ...entryFields,
            organisation: nonEmpty,
            start: monthSchema,
            end: monthSchema.optional(),
        })
        .refine(({ start, end }) => end === undefined || end >= start, {
            path: ["end"],
            message: 'is before "start"',
        })
        .transform(({ start, end, ...entry }) => {
            const span = { start, end };
            return {
                ...entry,
                kind,
                label: entry.label ?? entry.title,
                span,
                period: formatPeriod(span),
            };
        });

/** Frontmatter of `content/experience/*.mdx`. */
const roleSchema = datedEntrySchema("role");

/** Frontmatter of `content/education/*.mdx`. */
const educationSchema = datedEntrySchema("education");

/** `content/skills.yaml`. */
const skillGroupSchema = z.object({
    name: nonEmpty,
    skills: z.array(nonEmpty),
});

/** `content/profile.yaml`. */
const profileSchema = z.strictObject({
    name: nonEmpty,
    tagline: nonEmpty,
    role: nonEmpty,
    location: nonEmpty,
    focus: nonEmpty,
    education: nonEmpty,
    email: z.email(),
    /** Where the site is published, for the sitemap and robots.txt. */
    url: z.url(),
    links: z.array(externalLinkSchema).default([]),
    /** Links about the site itself, such as its source code. */
    siteLinks: z.array(externalLinkSchema).default([]),
    intro: nonEmpty,
    outsideWork: nonEmpty,
    /** A PDF in `public/`, offered as a download in the header. */
    cv: nonEmpty.startsWith("/").optional(),
    /** Example questions shown when Ask AI opens. */
    askAiSuggestions: z.array(nonEmpty).max(6).default([]),
});

/** A stretch of time, as "YYYY-MM" months. No `end` means it's still going. */
type Span = { start: string; end?: string };

/** A `##` heading in an entry's MDX body. Drives the contents list. */
type Heading = { id: string; title: string };

/** What loading adds to every `.mdx` file, whatever its frontmatter. */
type Document = {
    /** The filename: `adsum.mdx` is `adsum`. */
    slug: string;
    /** The page, which mirrors the file: `/projects/adsum`. */
    href: string;
    /** MDX with the frontmatter removed. Rendering imports the file itself. */
    body: string;
    headings: Heading[];
};

type Project = z.output<typeof projectSchema> & Document;
type Role = z.output<typeof roleSchema> & Document;
type Education = z.output<typeof educationSchema> & Document;
type Entry = Project | Role | Education;
type EntryKind = Entry["kind"];

export {
    educationSchema,
    profileSchema,
    projectSchema,
    roleSchema,
    skillGroupSchema,
    type Document,
    type Education,
    type Entry,
    type EntryKind,
    type Heading,
    type Project,
    type Role,
    type Span,
};
