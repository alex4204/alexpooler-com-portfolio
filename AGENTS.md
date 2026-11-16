## Read first (required)

Before **any** change in this repository, however small (code, content, config, styles or scripts), read and follow:

- [`CODING-STANDARDS.md`](./CODING-STANDARDS.md): the project-agnostic rules.
- [`PROJECT-CONTEXT.md`](./PROJECT-CONTEXT.md): what's specific to this site, which adds to them.

Run the checks the standards list (`pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm build`) before you finish. If a request would break a rule, say so instead of quietly breaking it.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
