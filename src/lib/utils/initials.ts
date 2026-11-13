/** "Alex Pooler" is "AP": the first letter of the first and last names. */
const initialsOf = (name: string) => {
    const words = name.trim().split(/\s+/);
    const first = words[0]?.[0] ?? "";
    const last = words.length > 1 ? (words.at(-1)?.[0] ?? "") : "";
    return (first + last).toUpperCase();
};

export { initialsOf };
