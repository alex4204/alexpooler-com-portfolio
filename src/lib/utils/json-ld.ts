/**
 * JSON for a `<script type="application/ld+json">`. Escaping `<` stops any
 * text in the data from closing the script tag early.
 */
const serializeJsonLd = (data: object) =>
    JSON.stringify(data).replace(/</g, "\u003c");

export { serializeJsonLd };
