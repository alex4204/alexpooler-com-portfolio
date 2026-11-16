import type { AskAiMessage } from "@/lib/types/ask-ai";
import { messageText } from "@/lib/utils/ask-ai/message-text";

const UserMessage = ({ message }: { message: AskAiMessage }) => (
    <div className="flex animate-in justify-end duration-200 fade-in slide-in-from-bottom-2">
        <div className="max-w-[90%] rounded-2xl bg-primary px-3.5 py-2 text-sm leading-6 text-primary-foreground">
            {messageText(message)}
        </div>
    </div>
);

export { UserMessage };
