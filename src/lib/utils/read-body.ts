/**
 * A request's body as text, or `undefined` if it's over `maxBytes`. Reading
 * stops the moment it is, so an oversized body is never held in memory, even
 * when the sender gives no Content-Length.
 */
const readBody = async (request: Request, maxBytes: number) => {
    if (!request.body) return "";
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
        const { done, value } = await reader.read();
        if (done) return Buffer.concat(chunks).toString("utf8");
        size += value.byteLength;
        if (size > maxBytes) {
            await reader.cancel();
            return undefined;
        }
        chunks.push(value);
    }
};

export { readBody };
