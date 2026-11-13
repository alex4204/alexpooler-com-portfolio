import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import YAML from "yaml";
import type { z } from "zod";

import type { Document } from "@/lib/types/content";
import { splitFrontmatter } from "@/lib/utils/content/frontmatter";
import { headingsOf } from "@/lib/utils/content/headings";
import { parseOrThrow } from "@/lib/utils/validate";

/*
 * Turns the files in `content/` into validated data. This file is generic:
 * it knows about folders, frontmatter and schemas, not projects or roles.
 *
 * - A collection is a folder of `.mdx` files, each checked against a schema.
 * - Pages mirror files: `content/projects/adsum.mdx` is `/projects/adsum`.
 * - Anything invalid throws, naming the file, so a bad edit fails the build.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

const read = (relativePath: string) =>
    fs.readFile(path.join(CONTENT_DIR, relativePath), "utf8");

/** One `.mdx` file: its checked frontmatter, plus what every page needs. */
const loadDocument = async <Schema extends z.ZodType<object>>(
    folder: string,
    file: string,
    schema: Schema,
): Promise<z.output<Schema> & Document> => {
    const where = `content/${folder}/${file}`;
    const { data, body } = splitFrontmatter(
        await read(`${folder}/${file}`),
        where,
    );
    const slug = path.basename(file, ".mdx");

    return {
        ...parseOrThrow(schema, data, where),
        slug,
        href: `/${folder}/${slug}`,
        body,
        headings: headingsOf(body),
    };
};

/** Every `.mdx` file in `content/<folder>`, in no particular order. */
const loadCollection = async <Schema extends z.ZodType<object>>(
    folder: string,
    schema: Schema,
) => {
    const files = await fs.readdir(path.join(CONTENT_DIR, folder));
    return Promise.all(
        files
            .filter((file) => file.endsWith(".mdx"))
            .map((file) => loadDocument(folder, file, schema)),
    );
};

/** A `.yaml` file in `content/`, checked against `schema`. */
const loadData = async <Schema extends z.ZodType>(
    file: string,
    schema: Schema,
) => parseOrThrow(schema, YAML.parse(await read(file)), `content/${file}`);

export { loadCollection, loadData };
