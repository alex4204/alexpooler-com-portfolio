import YAML from "yaml";

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** Splits a file into its YAML frontmatter (unchecked) and the body after it. */
const splitFrontmatter = (source: string, where: string) => {
    const match = FRONTMATTER.exec(source);
    if (!match) throw new Error(`${where}: missing frontmatter`);
    return { data: YAML.parse(match[1]) as unknown, body: match[2].trim() };
};

export { splitFrontmatter };
