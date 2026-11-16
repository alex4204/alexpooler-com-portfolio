import type { UIDataTypes, UIMessage } from "ai";
import { z } from "zod";

/** What the model passes to the `citeSources` tool. */
const citeSourcesInputSchema = z.object({
    paths: z
        .array(z.string())
        .max(6)
        .describe('Site paths the answer used, such as "/projects/adsum".'),
});

/**
 * The body the browser posts. Messages are checked properly afterwards, by
 * the AI SDK against the tools, so here they only need to be a list.
 */
const askAiRequestSchema = z.object({
    messages: z.array(z.unknown()).min(1),
});

/** A page an answer drew on, shown as a link under it. */
type Source = { label: string; href: string };

type CiteSourcesInput = z.infer<typeof citeSourcesInputSchema>;

/** Set by environment variables on the server and passed to the browser. */
type AskAiLimits = {
    /** How many recent messages are sent with each question. */
    maxMessages: number;
    /** The longest question a visitor can ask, in characters. */
    maxQuestionLength: number;
};

/** Whether a question is answered, and if not, why and when to try again. */
type Verdict =
    | { ok: true }
    | { ok: false; reason: "busy" }
    | { ok: false; reason: "unavailable" }
    | { ok: false; reason: "visitor" | "daily"; retryAfterSeconds: number };

/** The tools an answer can use, as the browser sees them. */
type AskAiTools = {
    citeSources: { input: CiteSourcesInput; output: Source[] };
};

/** One message in an Ask AI conversation, shared by the route and the panel. */
type AskAiMessage = UIMessage<unknown, UIDataTypes, AskAiTools>;

export {
    askAiRequestSchema,
    citeSourcesInputSchema,
    type AskAiLimits,
    type AskAiMessage,
    type Source,
    type Verdict,
};
