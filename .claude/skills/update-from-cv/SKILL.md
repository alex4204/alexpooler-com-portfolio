---
name: update-from-cv
description: Updates the portfolio site's content (content/profile.yaml, content/skills.yaml and the experience, education and project MDX pages) from a new CV, then checks the build and commits on a branch, with an optional PR. Use this whenever the user shares or uploads a CV or résumé PDF, says they've added or dropped a new CV into public/, asks to "sync", "refresh" or "update the site from my CV", mentions a new job, promotion, course or project that's on their CV, or asks why the site and CV disagree, even if they don't say "skill" or name the files.
---

# Update the site from a CV

The CV is the source of truth for facts: employers, titles, dates, places, skills and what was done. The site holds the same facts, plus writing the CV doesn't have room for. The job is to bring the site up to date with the CV without losing that extra writing and without adding anything the CV doesn't say.

Read `CODING-STANDARDS.md` (the Content section) and `src/lib/types/content.ts` (the zod schemas every file is checked against) before editing. They're short, and the build fails on anything that breaks them.

## 1. Before starting

Run `git status`. This workflow ends with a commit on a new branch, so uncommitted changes would get mixed in. If there are any, ask the user whether to commit, stash or carry on.

## 2. Find the CV

- **Uploaded in the chat:** copy it over the file named by `cv` in `content/profile.yaml` (for example `public/alexander-pooler-cv.pdf`), so the site's download link keeps working. If `cv` isn't set, save it as `public/<first>-<last>-cv.pdf` from the name on the CV and set `cv`.
- **Otherwise:** the newest `.pdf` in `public/` by modified time is the new CV. Set `cv` in `profile.yaml` to its path (`/<file>.pdf`).

Then delete the other CV PDFs in `public/`: only there, and only PDFs that are CVs. List what was deleted in the final report. If the newest PDF is already the one `cv` points at, ask whether the user has really added a new CV before going further.

## 3. Read everything

Read the CV with the Read tool. Then read `content/profile.yaml`, `content/skills.yaml`, and every `.mdx` in `content/experience/`, `content/education/` and `content/projects/`, including their bodies, since a body can mention a fact the CV has changed.

## 4. Plan, then ask once

Compare the two and sort every role, course and project into one of four groups:

- **New:** on the CV, no page yet.
- **Changed:** has a page, and the CV now says something different (title, dates, summary, skills or bullet points).
- **Unchanged:** nothing to do. Say so briefly.
- **Missing from the CV:** has a page, not on the CV. CVs get trimmed for length while the site keeps the full history, so never delete these without asking.

Show the user this plan in one message, with all your questions at the end, and wait for answers before editing. Ask whenever you're unsure rather than guessing, for example:

- whether a missing entry should be kept or deleted;
- dates the CV gives only roughly ("Summer 2024") when the schema needs a month;
- which skill group a new skill belongs in, when none clearly fits;
- whether a CV project is one the site already has under another name, including drafts (`draft: true`) and projects still being built (`inProgress: true`);
- anything that looks like a mistake on the CV, such as overlapping or reversed dates.

Small, unambiguous updates (a new bullet, a corrected end date) don't need a question. Just list them in the plan.

## 5. Edit

**What to change in an existing page.** Change only what the CV makes out of date:

- Frontmatter fields the CV states: `title`, `organisation`, `location`, `start`, `end`, `summary`, `stack`.
- The `## Highlights` list, which mirrors the CV's bullet points for that entry.
- Any other section that now contradicts the CV or reads as stale against it, such as a paragraph saying "currently building X" after X finished. Fix just the out-of-date sentence.

Leave everything else alone: sections the CV doesn't cover (such as "The hard part", deep dives, code samples or the degree page's `## Modules` tables, which come from the transcript), `order`, `hue`, `label`, `sidebarLabel` and `draft`. Change `inProgress` only when the CV shows a project is finished, and then ask first. That writing is the site's value beyond the CV, and nothing in a CV can replace it.

**New pages.** One file per entry. The filename is the page's URL, so make it a short, lowercase, hyphenated slug of the title, plus a qualifier if titles clash (see `associate-software-engineer-placement.mdx`). Copy the shape of an existing file in the same folder:

- Experience and education: `title`, `organisation`, `location`, `start: "YYYY-MM"`, `end` if it has ended, `summary` (one sentence), `stack`, then a `## Highlights` list from the CV's bullets.
- Projects have no dates. Use `period` (short free text, such as "Final-year project") and `order` (the next free number, or ask where it should go), plus `summary`, `stack` and `## Highlights`.
- A project the CV shows as ongoing gets `inProgress: true`, which lists it under "In progress" in the sidebar. Follow the Content rules in `CODING-STANDARDS.md` for these: describe what it will be and the plans for it, not its current state.

**Writing.** Keep the CV's meaning and wording. The bullets are the user's own words, so tidy them, don't embellish them. Use British spelling, and refer to the user by name or not at all, never with guessed pronouns. Never add metrics, claims or technologies the CV doesn't state; that's the one rule that can't bend.

**Profile.** Update `tagline`, `role`, `focus`, `education`, `intro` and `links` only where the CV states them. Leave `url`, `siteLinks` and `askAiSuggestions` alone; they're about the site, not the CV. Never copy a phone number or home address into the site, even if the CV has them. A town or region for `location` is fine.

**Skills.** Every item in a `stack` must exist in `content/skills.yaml`, matching exactly. Add new skills to the group they fit, and keep each group's existing order. Don't remove a skill just because the CV no longer lists it; ask.

## 6. Check

Run `pnpm format`, `pnpm lint`, `pnpm typecheck` and `pnpm build`. Content is validated during the build, and errors name the file and field, for example `content/projects/adsum.mdx: "Reakt" isn't in content/skills.yaml`. Fix them and run again until all four pass.

## 7. Commit, then offer a PR

Create a branch named `content/cv-YYYY-MM-DD` with today's date, and commit everything, including the CV PDF change, with a message like `Update content from CV (YYYY-MM-DD)`.

Then ask whether to push it and open a pull request. That needs a GitHub remote (`git remote -v`) and the GitHub CLI (`gh auth status`). If either is missing, say which, and how to set it up, rather than trying another way.

## 8. Report

Finish with a short summary:

- the CV used, and the PDFs deleted from `public/`;
- pages created, updated (with what changed) and deleted, and those left alone because the user chose to keep them;
- skills added to `skills.yaml`;
- the branch and commit, and the PR link if one was opened;
- anything still worth a human look, such as a placeholder page that's still a draft.
