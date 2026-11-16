/** Whether every whitespace-separated word appears somewhere in the text. */
const matchesAllWords = (textValue: string, inputValue: string) => {
    const haystack = textValue.toLowerCase();
    return inputValue
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((word) => haystack.includes(word));
};

export { matchesAllWords };
