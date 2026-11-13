import type { z } from "zod";

/** Parses `data`, and on failure throws a message that names `where`. */
const parseOrThrow = <Schema extends z.ZodType>(
    schema: Schema,
    data: unknown,
    where: string,
): z.output<Schema> => {
    const result = schema.safeParse(data);
    if (result.success) return result.data;
    const problems = result.error.issues.map(
        (issue) =>
            `${issue.path.length > 0 ? `"${issue.path.join(".")}" ` : ""}${issue.message}`,
    );
    throw new Error(`${where}: ${problems.join("; ")}`);
};

export { parseOrThrow };
