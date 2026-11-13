import { serializeJsonLd } from "@/lib/utils/json-ld";

/**
 * Structured data for search engines and AI. It's data, not code, so it
 * never runs; this is how the Next.js docs recommend adding it.
 */
const JsonLd = ({ data }: { data: object }) => (
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
);

export { JsonLd };
