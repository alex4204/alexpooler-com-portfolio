import { getLlmsIndex } from "@/lib/site-metadata/llms";

const GET = async () =>
    new Response(await getLlmsIndex(), {
        headers: { "content-type": "text/plain; charset=utf-8" },
    });

export { GET };
