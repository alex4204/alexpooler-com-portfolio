/** Parses JSON, or returns `undefined` instead of throwing. */
const parseJson = (text: string): unknown => {
    try {
        return JSON.parse(text);
    } catch {
        return undefined;
    }
};

export { parseJson };
