import type { UIMessage } from "ai";

/** The text of a chat message: its text parts, joined. */
const messageText = (message: UIMessage) =>
    message.parts
        .flatMap((part) => (part.type === "text" ? [part.text] : []))
        .join("");

export { messageText };
