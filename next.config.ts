import createMDX from "@next/mdx";
import type { NextConfig } from "next";

/**
 * Sent with every response. No script policy: allowing Next's own inline
 * scripts safely needs a new nonce per request, which would stop pages being
 * prerendered.
 */
const SECURITY_HEADERS = [
    // Browsers must trust the declared type, never guess it.
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Other sites see where a visitor came from, not the full URL.
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Nothing on the site needs these.
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
    },
    // HTTPS only, for two years.
    { key: "Strict-Transport-Security", value: "max-age=63072000" },
    {
        key: "Content-Security-Policy",
        // No framing (clickjacking), no plugins, and no redirecting
        // relative links or forms to another site.
        value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
    },
];

const nextConfig: NextConfig = {
    // A self-contained server in .next/standalone, for the Docker image.
    output: "standalone",
    // Pages read content/ when their cache refreshes, so ship it with them.
    outputFileTracingIncludes: { "/*": ["./content/**/*"] },
    cacheComponents: true,
    partialPrefetching: true,
    poweredByHeader: false,
    headers: async () => [{ source: "/:path*", headers: SECURITY_HEADERS }],
    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
};

const withMDX = createMDX({
    options: {
        // Named by string because Turbopack can't take functions.
        remarkPlugins: ["remark-frontmatter", "remark-gfm"],
    },
});

export default withMDX(nextConfig);
