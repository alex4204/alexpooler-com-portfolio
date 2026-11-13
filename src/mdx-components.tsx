import { isValidElement, type ComponentProps, type ReactNode } from "react";
import type { MDXComponents } from "mdx/types";

import { DeepDive } from "@/components/article/deep-dive";
import {
    Callout,
    ExternalTextLink,
    Paragraph,
    TextLink,
} from "@/components/article/prose";
import { SectionHeading } from "@/components/article/section-heading";
import { cn } from "@/lib/utils/cn";
import { slugify } from "@/lib/utils/slug";
import { isExternalUrl } from "@/lib/utils/url";

/** The words inside some rendered Markdown, such as a heading with `code`. */
const textOf = (node: ReactNode): string => {
    if (typeof node === "string" || typeof node === "number") {
        return String(node);
    }
    if (Array.isArray(node)) return node.map(textOf).join("");
    if (isValidElement<{ children?: ReactNode }>(node)) {
        return textOf(node.props.children);
    }
    return "";
};

/**
 * Next.js looks for this file at the root of src/. It maps what Markdown
 * produces to the site's own styled pieces.
 */
const useMDXComponents = (): MDXComponents => ({
    p: ({ children }) => <Paragraph>{children}</Paragraph>,
    a: ({ href = "", children }) =>
        isExternalUrl(href) ? (
            <ExternalTextLink href={href}>{children}</ExternalTextLink>
        ) : (
            <TextLink href={href}>{children}</TextLink>
        ),
    // The id matches the one the loader derives for the contents list.
    h2: ({ children }) => (
        <SectionHeading id={slugify(textOf(children))}>
            {children}
        </SectionHeading>
    ),
    h3: ({ children }) => (
        <h3 className="mt-8 mb-1 text-lg font-semibold tracking-tight">
            {children}
        </h3>
    ),
    h4: ({ children }) => (
        <h4 className="mt-6 mb-1 font-semibold">{children}</h4>
    ),
    ul: ({ children }) => (
        <ul className="my-3 list-disc space-y-2.5 pl-5 text-[15px] leading-7 text-foreground/75 marker:text-foreground/30">
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol className="my-3 list-decimal space-y-2.5 pl-5 text-[15px] leading-7 text-foreground/75 marker:text-foreground/40">
            {children}
        </ol>
    ),
    strong: ({ children }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
    ),
    blockquote: ({ children }) => (
        <blockquote className="my-5 border-l-2 border-primary/50 pl-4 text-foreground/70 italic">
            {children}
        </blockquote>
    ),
    hr: () => <hr className="my-8 border-foreground/15" />,
    code: ({ className, ...props }: ComponentProps<"code">) => (
        <code
            className={cn(
                "rounded bg-foreground/[0.07] px-1 py-0.5 font-mono text-[0.85em]",
                // Code inside <pre> gets its styling from the block.
                className?.startsWith("language-") &&
                    "bg-transparent p-0 text-[13px]",
                className,
            )}
            {...props}
        />
    ),
    pre: ({ children }) => (
        <pre className="my-5 overflow-x-auto rounded-lg border border-foreground/10 bg-card p-4 leading-6">
            {children}
        </pre>
    ),
    table: ({ children }) => (
        <div className="my-5 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[15px]">
                {children}
            </table>
        </div>
    ),
    th: ({ children }) => (
        <th className="border-b border-foreground/30 px-3 py-2 font-semibold">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="border-b border-foreground/10 px-3 py-2 text-foreground/75">
            {children}
        </td>
    ),
    // Available in every .mdx file without importing.
    DeepDive,
    Callout,
});

export { useMDXComponents };
