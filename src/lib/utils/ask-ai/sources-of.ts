import type { AskAiMessage } from "@/lib/types/ask-ai";

/** The pages an answer cited, once its `citeSources` call has run. */
const sourcesOf = (message: AskAiMessage) =>
    message.parts.flatMap((part) =>
        part.type === "tool-citeSources" && part.state === "output-available"
            ? part.output
            : [],
    );

export { sourcesOf };
