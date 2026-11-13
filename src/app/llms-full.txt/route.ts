import { getLlmsFullText } from "@/lib/site-metadata/llms";

const GET = async () =>
    new Response(await getLlmsFullText(), {
        headers: { "content-type": "text/plain; charset=utf-8" },
    });

export { GET };
