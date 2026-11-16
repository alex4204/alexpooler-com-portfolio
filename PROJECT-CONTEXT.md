# Project context

What's specific to this project: Alex Pooler's portfolio site. These rules add to [`CODING-STANDARDS.md`](./CODING-STANDARDS.md), which applies everywhere.

## Stack

Next.js with Cache Components, React Aria based shadcn components, Tailwind and `motion`, managed with pnpm. Dynamic routes follow the pattern in `src/app/projects/[slug]/page.tsx`. The one place client-side `fetch` is used is Ask AI, which needs a streaming response from a Route Handler.

## Layout

These add to the layout in the coding standards.

| Path                         | What belongs there                                                                                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/`                   | All site content: MDX for entries, YAML for the profile and skills.                                                                                        |
| `src/components/article/`    | Building blocks for content pages (layout, prose, MDX mapping).                                                                                            |
| `src/components/site/`       | Site-wide pieces that belong to no one feature: table of contents, page scrollbar, theme toggle, JSON-LD and the like.                                     |
| `src/components/navigation/` | The header and its tools, and the sidebar and mobile navigation.                                                                                           |
| `src/components/ask-ai/`     | The Ask AI panel (`AskAiPanel`, `AskAiPanelContent`) and the parts it is built from.                                                                       |
| `src/components/command-k/`  | The Ctrl+K search: its building blocks (`command-k*.tsx`, one per part) and the dialog that fills them (`search-dialog.tsx`).                              |
| `src/components/icons/`      | Icons Lucide doesn't have, such as brand logos, one per file. See its `AGENTS.md`.                                                                         |
| `src/lib/content/`           | `loader.ts` turns files into validated data and knows nothing about the site. `content.ts` has the cached getters pages use (`getEntries`, `getProfile`…). |
| `src/lib/site-metadata/`     | How the site describes itself to search engines, link previews and AI tools: page metadata, structured data and `llms.txt`.                                |
| `src/services/ask-ai/`       | Ask AI's server side: the model call, prompt and rate limits.                                                                                              |

## Look

Theme tokens are in `src/app/globals.css`. Source Serif, warm paper background, teal accent, small corners, heavy rules between sections, italic labels. `motion` is used for page changes and the sliding sidebar indicator.

## Content

- Content lives in `content/` as typed MDX. Entry frontmatter and sections are validated at build time.
- Pages mirror files: `content/projects/adsum.mdx` is `/projects/adsum`. Roles and education are ordered by `start`; projects have no dates, so they set `order`.
- Read content only through the getters in `src/lib/content/content.ts`. They use `"use cache"` with `cacheLife("max")`; do not read `content/` anywhere else.
- Every skill listed on an entry's `stack` must exist in `content/skills.yaml`.
- Only state what Alex has provided. Never invent employers, dates, metrics or claims. Do not write "open to work" or "available for hire". Do not publish a phone number.
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
- A change to the prompt, model or limits needs a note on how it was checked.
