# Coding standards

These apply to **every** change, however small. If a rule here conflicts with what existing code does, the rule wins: fix the code you touch, and mention the mismatch rather than copying it. If a rule seems wrong for a case, say so before breaking it.

Many rules are enforced by ESLint and Prettier. Passing the checks is the minimum, not the whole standard.

## Before you finish any change

Run all four and fix what they report. Do not hand work back with any of them failing.

```bash
pnpm format       # Prettier
pnpm lint         # ESLint
pnpm typecheck    # next typegen + tsc
pnpm build        # catches content and route errors the others miss
```

- Use **pnpm** for everything. Never npm or yarn, and never commit another lockfile.
- Do not commit or push unless asked.

## Functions and exports

- **Arrow functions only.** No `function` declarations or function expressions, including callbacks. (Generators are the one thing arrows can't express; avoid needing them.)
- **Exports go at the bottom of the file, in a single `export { … }`.** Nothing is exported inline. Types are exported there too (`type Foo`).
- **Named exports by default.** A default export is allowed only where Next.js requires it: `page`, `layout`, `template`, `not-found`, `error`, `loading`, `default`, `sitemap`, `robots`, `opengraph-image` and config files. Never add a default export elsewhere, and never add barrel (`index.ts`) files.
- Import with the `@/` alias, not long relative paths. Use `import type` for types.

## Next.js

- This is a newer Next.js than your training data. **Read the relevant guide in `node_modules/next/dist/docs/` before writing Next code**, and heed deprecation notices.
- Cache Components is on. Server Components by default. Keep `"use client"` to the smallest leaf that needs state, effects or browser APIs, and pass server-rendered content to it as `children` where possible.
- `await params` / `searchParams` / `cookies()` only inside a component wrapped in `<Suspense>`, never at the top of a page. Follow the pattern in `src/app/projects/[slug]/page.tsx`.
- Every dynamic route has `generateStaticParams` and uses `notFound()` for unknown slugs.
- Code that must never reach the browser starts with `import "server-only"`.
- Reads happen in Server Components. Mutations use **Server Functions / Actions**. **Use client-side `fetch` only when nothing else works.** The one current case is Ask AI, which needs a streaming response from a Route Handler. Validate every input to a Server Function or Route Handler as if it were hostile, because it can be called directly.
- Never use the Pages Router or `getServerSideProps`-style APIs.

## Formatting

Prettier decides. Do not hand-format or fight it.

- 4 spaces, never tabs. Semicolons always.
- Tailwind classes are sorted by `prettier-plugin-tailwindcss` (it also sorts inside `cn()` and `cva()`).
- Format the whole repo with `pnpm format`; don't leave formatting churn out of a diff.

## TypeScript

- Strict. No `any`, no non-null `!` to silence a real problem, no `@ts-ignore`.
- Use types the library already provides (`ModelMessage`, `PageProps<…>`, `LayoutProps<…>`) instead of redefining them.
- Parse and validate anything from outside the program (request bodies, frontmatter, env vars) and fail with a message that names the file or field.
- Keep comments for _why_, not _what_. No commented-out code.

## Project layout

| Path                      | What belongs there                                                                                                                                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/`                | All site content: MDX for entries, YAML for the profile and skills. Content is never hard-coded in TSX.                                                                                                                                  |
| `src/app/`                | Routes and Next special files only. Keep pages thin.                                                                                                                                                                                     |
| `src/components/ui/`      | Generic, themed shadcn (React Aria) primitives. No site-specific logic.                                                                                                                                                                  |
| `src/components/article/` | Building blocks for content pages (layout, prose, MDX mapping).                                                                                                                                                                          |
| `src/components/site/`    | Site chrome: header, sidebar, search, Ask AI sheet.                                                                                                                                                                                      |
| `src/components/icons/`   | Icons Lucide doesn't have, such as brand logos, one per file. See its `AGENTS.md`.                                                                                                                                                       |
| `src/lib/`                | Shared domain logic safe for server and client.                                                                                                                                                                                          |
| `src/lib/types/`          | **All** types. Zod schemas at the top of each file, `z.infer` types below.                                                                                                                                                               |
| `src/lib/content/`        | `loader.ts` turns files into validated data and knows nothing about the site. `content.ts` has the cached getters pages use (`getEntries`, `getProfile`…).                                                                               |
| `src/lib/site-metadata/`  | How the site describes itself to search engines, link previews and AI tools: page metadata, structured data and `llms.txt`.                                                                                                              |
| `src/lib/utils/`          | **All** small generic helper functions, one concern per file (`cn.ts`, `slug.ts`, `url.ts`…). Helpers that only serve one area go in a subfolder named after it (`utils/content/`). Do not define a helper inline if it could live here. |
| `src/services/`           | Server-side integrations (e.g. `services/ask-ai/`). Always `server-only`.                                                                                                                                                                |
| `src/hooks/`              | Client hooks.                                                                                                                                                                                                                            |

- Files are kebab-case. Components are PascalCase and one main component per file.
- Put new code where the table says. If nothing fits, ask rather than creating a new top-level folder.

## UI and styling

- Build with the existing shadcn components (React Aria base). Add new ones with the shadcn CLI and style them to match; do not hand-roll a primitive that exists.
- Colours, radius and fonts come from the tokens in `src/app/globals.css`. **No hard-coded colours.** Every change must look right in both light and dark mode.
- Match the established look: Source Serif, warm paper background, teal accent, small corners, heavy rules between sections, italic labels. Do not introduce a new visual style.
- **`motion` is for navigation and transitions** (page changes, the sliding sidebar indicator). Do not add decorative animation. Respect `prefers-reduced-motion`.
- Accessibility is not optional: real buttons and links, labels on icon-only buttons, visible focus, sensible heading order.

## Content

- Content lives in `content/` as typed MDX. Entry frontmatter and sections are validated at build time; a bad file should fail the build with a message that names it.
- Pages mirror files: `content/projects/adsum.mdx` is `/projects/adsum`. Roles and education are ordered by `start`; projects have no dates, so they set `order`.
- Read content only through the getters in `src/lib/content/content.ts`. They use `"use cache"` with `cacheLife("max")`; do not read `content/` anywhere else.
- Every skill listed on an entry's `stack` must exist in `content/skills.yaml`.
- Only state things that are true and that Alex has provided. **Never invent** employers, dates, metrics or claims. Do not write "open to work" or "available for hire". Do not publish a phone number.
- No rating or scoring of skills (no "8/10", stars or bars). Describe skills with evidence instead.
- Do not use documentation-site vocabulary in the UI ("Getting started", "Changelog", "Reference", "Docs"). Sections are About, Projects, Experience, Education, Skills.
- No cheesy or gimmicky elements: no fake terminals or code, no novelty widgets.
- British spelling in copy. Refer to Alex without guessing pronouns.
- Unfinished entries get `draft: true`, which keeps them out of Ask AI.
- Projects still being built get `inProgress: true`. Describe what they will be and the plans for them, confidently, not their current state: no "only a dry run so far" or "not connected yet". Avoid details that are likely to change.

## Ask AI

- It is **provider-agnostic** by design: Vercel's AI SDK (`ai`), with the model chosen by `ASK_MODEL` as `provider:model`. Do not import a provider's own SDK, and keep provider-specific options confined to `src/services/ask-ai/` with a comment saying others ignore them.
- Visitor messages, and earlier assistant turns sent back by the browser, are **untrusted input**. Do not loosen the scope rules, length limits or rate limits without saying so.
- Rate limits live in Redis (`services/ask-ai/rate-limit.ts`). Ask AI **fails closed**: no Redis, no visitor IP or no model means no answers. Visitors are identified by `cf-connecting-ip` only, because the site is served through Cloudflare. Never fall back to a header the visitor controls, such as `x-forwarded-for`.
- Answers must come only from the site's own content. The model cites pages through the `citeSources` tool, and every path is checked against real pages in code, never trusted.
- The client uses `useChat` from `@ai-sdk/react`, and the route returns a UI message stream. Do not hand-roll a streaming protocol.
- API keys are read from the environment on the server only. Never log them, ship them to the client or commit them.
- A change to the prompt, model or limits needs a note on how it was checked.
