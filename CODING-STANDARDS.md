# Coding standards

These apply to **every** change, however small. If a rule here conflicts with what existing code does, the rule wins: fix the code you touch, and mention the mismatch rather than copying it. If a rule seems wrong for a case, say so before breaking it.

These are project-agnostic rules. Anything specific to this project (its features, folders, content and visual style) is in [`PROJECT-CONTEXT.md`](./PROJECT-CONTEXT.md), which adds to these rules.

Many rules are enforced by ESLint and Prettier. Passing the checks is the minimum, not the whole standard.

## Before you finish any change

Run all four and fix what they report. Do not hand work back with any of them failing.

```bash
pnpm format       # Prettier
pnpm lint         # ESLint
pnpm typecheck    # next typegen + tsc
pnpm build        # catches errors the others miss
```

- Use **pnpm** for everything. Never npm or yarn, and never commit another lockfile.
- Do not commit or push unless asked.

## Functions and exports

- **Arrow functions only.** No `function` declarations or function expressions, including callbacks. (Generators are the one thing arrows can't express; avoid needing them.)
- **Exports go at the bottom of the file, in a single `export { … }`.** Nothing is exported inline. Types are exported there too (`type Foo`).
- **Named exports by default.** A default export is allowed only where the framework requires it (in Next.js: `page`, `layout`, `template`, `not-found`, `error`, `loading`, `default`, `sitemap`, `robots`, `opengraph-image` and config files). Never add a default export elsewhere, and never add barrel (`index.ts`) files.
- Import with the `@/` alias, not long relative paths. Use `import type` for types.

## Next.js

- Next.js changes quickly and is likely newer than your training data. **Read the relevant guide in `node_modules/next/dist/docs/` before writing Next code**, and heed deprecation notices.
- Server Components by default. Keep `"use client"` to the smallest leaf that needs state, effects or browser APIs, and pass server-rendered content to it as `children` where possible.
- With Cache Components on, `await params` / `searchParams` / `cookies()` only inside a component wrapped in `<Suspense>`, never at the top of a page.
- Every dynamic route has `generateStaticParams` where its values are known at build time, and uses `notFound()` for unknown ones.
- Code that must never reach the browser starts with `import "server-only"`.
- Reads happen in Server Components. Mutations use **Server Functions / Actions**. **Use client-side `fetch` only when nothing else works**, such as a streaming response from a Route Handler. Validate every input to a Server Function or Route Handler as if it were hostile, because it can be called directly.
- Never use the Pages Router or `getServerSideProps`-style APIs.

## Formatting

Prettier decides. Do not hand-format or fight it.

- 4 spaces, never tabs. Semicolons always.
- Tailwind classes are sorted by `prettier-plugin-tailwindcss` (it also sorts inside `cn()` and `cva()`).
- Format the whole repo with `pnpm format`; don't leave formatting churn out of a diff.

## TypeScript

- Strict. No `any`, no non-null `!` to silence a real problem, no `@ts-ignore`.
- Use types the library already provides (`PageProps<…>`, `LayoutProps<…>`, an SDK's message types) instead of redefining them.
- Parse and validate anything from outside the program (request bodies, files, env vars) and fail with a message that names the file or field.
- Keep comments for _why_, not _what_. No commented-out code.
- Secrets are read from the environment on the server only. Never log them, ship them to the client or commit them.

## Project layout

| Path                        | What belongs there                                                                                                                                                                                                            |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/`                  | Routes and framework special files only. Keep pages thin.                                                                                                                                                                     |
| `src/components/ui/`        | Generic, themed shadcn primitives. No app-specific logic.                                                                                                                                                                     |
| `src/components/<feature>/` | A feature's components, once it has more than one (see below).                                                                                                                                                                |
| `src/components/providers/` | Components that only wrap the app to supply settings or context to everything inside.                                                                                                                                         |
| `src/lib/`                  | Shared domain logic safe for server and client.                                                                                                                                                                               |
| `src/lib/types/`            | **All** types. Zod schemas at the top of each file, `z.infer` types below.                                                                                                                                                    |
| `src/lib/utils/`            | **All** small generic helper functions, one concern per file (`cn.ts`, `slug.ts`…). Helpers that only serve one area go in a subfolder named after it (`utils/<area>/`). Do not define a helper inline if it could live here. |
| `src/services/`             | Server-side integrations, one folder each. Always `server-only`.                                                                                                                                                              |
| `src/hooks/`                | Client hooks.                                                                                                                                                                                                                 |

- Files are kebab-case. Components are PascalCase, **one component per file**. A small helper component used only inside its file may stay there when a file of its own would be overkill.
- A primitive made of several parts gets a subfolder with one file per part: `ui/panel/panel.tsx`, `ui/panel/panel-header.tsx`, `ui/panel/panel-title.tsx`.
- Once a feature has more than one component, group them in a folder under `src/components/` named after the feature. A feature with a single component stays in the most fitting shared folder.
- A feature that opens in a panel or modal has two components: the frame (`<Feature>Panel`: the panel, its header and title) and what goes inside it (`<Feature>PanelContent`), like a layout and its page.
- Put new code where the table (or `PROJECT-CONTEXT.md`) says. If nothing fits, ask rather than creating a new top-level folder.

## UI and styling

- Build with the existing shadcn components. Add new ones with the shadcn CLI and style them to match; do not hand-roll a primitive that exists.
- Colours, radius and fonts come from the theme tokens in the global stylesheet. **No hard-coded colours.** Every change must look right in both light and dark mode.
- Match the project's established look (described in `PROJECT-CONTEXT.md`). Do not introduce a new visual style.
- **Animation is for navigation and transitions** (page changes, moving indicators). Do not add decorative animation. Respect `prefers-reduced-motion`.
- Accessibility is not optional: real buttons and links, labels on icon-only buttons, visible focus, sensible heading order.
- Inputs are at least 16px on phones, or iOS zooms the page in when one is focused.

## Content and copy

- Only state things that are true and that the owner has provided. **Never invent** names, dates, metrics or claims.
- Content lives in files, validated at build time, never hard-coded in components. A bad file should fail the build with a message that names it.
- Refer to people without guessing their pronouns.
