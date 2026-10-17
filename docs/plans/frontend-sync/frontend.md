# Frontend Sync — maa-frontend Home Split Implementation Plan

> Design: [design.md](./design.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the frontend home page's inline section components into their own files, so the prototype can copy them unchanged.

**Architecture:** A pure refactor in `/Users/josh/Code/maa/maa-frontend`. Five inline components in `src/pages/home/index.tsx` move to sibling files; `index.tsx` keeps only the composition. No visual or behavior change. This must land (on its branch at least) before [prototype.md Task 5](./prototype.md#task-5).

**Tech Stack:** React 19, TypeScript 6 (strict), Vite 8, Tailwind 4 + DaisyUI 5.

**Spec:** [design.md](./design.md), section "Home page file layout (both repos)".

**Verification model:** Neither repo has tests (design non-goal). Each task verifies with `npm run build`, `npm run lint`, `npm run format:check`, and a visual check in the dev server.

**Code Review Checkpoints:** This file is one task; it's reviewed with prototype Checkpoint 1 (see [prototype.md](./prototype.md)).

## Global Constraints

- Repo: `/Users/josh/Code/maa/maa-frontend`, new branch `refactor/home-sections` off an up-to-date `main`.
- No visual or behavior change to the frontend.
- Prettier config: `printWidth: 100`, `singleQuote: true`; `npm run format:check` must pass.
- The local `node_modules` is stale (TypeScript 5.9.3). Run `npm ci` before any verification.
- Dev server port: both repos default to 5174. If the prototype's dev server is already running, Vite picks the next free port; use the URL Vite prints.

## Review Focus

- **Home page renders identically** before and after: same section order (Hero, Welcome card, What We Offer, Book a Field + Become a Sponsor, Get Involved), spacing, and images. Checked in Task 1 Step 6.

---

## Tasks

| # | Task | Description | Model |
|---|------|-------------|-------|
| 1 | [Split home sections into files](#task-1) | Move Hero, Intro, ProgramsOffered, MoreOnTheSite, GetInvolved to sibling files; rename `Season` → `SeasonOffering`; document sync | sonnet |

---

<a id="task-1"></a>
### Task 1: Split home sections into files

**Files:**
- Create: `src/pages/home/Hero.tsx`, `src/pages/home/Intro.tsx`, `src/pages/home/ProgramsOffered.tsx`, `src/pages/home/MoreOnTheSite.tsx`, `src/pages/home/GetInvolved.tsx`
- Modify: `src/pages/home/index.tsx`, `src/pages/home/programs.ts`, `CLAUDE.md`

**Interfaces:**
- Produces (copied verbatim by prototype Task 5): each new file has one default-exported, prop-less component named after the file: `Hero()`, `Intro()`, `ProgramsOffered()`, `MoreOnTheSite()`, `GetInvolved()`. `programs.ts` exports `type ProgramItem`, `type SeasonOffering = { label: string; items: ProgramItem[] }`, and `const programs: SeasonOffering[]`.

- [ ] **Step 1: Branch and install**

```bash
cd /Users/josh/Code/maa/maa-frontend
git switch main && git pull --ff-only
git switch -c refactor/home-sections
npm ci
```

Expected: `node_modules/.bin/tsc -v` prints `Version 6.0.3`.

- [ ] **Step 2: Move each section component to its own file**

For each of `Hero`, `Intro`, `ProgramsOffered`, `MoreOnTheSite` and `GetInvolved` in `src/pages/home/index.tsx`, move the function body unchanged into `src/pages/home/<Name>.tsx` as `export default function <Name>()`. Each file imports only what its own body uses:

| File | Imports |
|---|---|
| `Hero.tsx` | `hero` from `./copy` |
| `Intro.tsx` | `intro` from `./copy` |
| `ProgramsOffered.tsx` | `programsSection` from `./copy`; `programs` from `./programs` |
| `MoreOnTheSite.tsx` | `Link` from `react-router-dom`; `B_URL`, `PAGE_PATHS` from `../../utils`; `teasers` from `./copy` |
| `GetInvolved.tsx` | `ContactSection` from `../../components/ContactSection`; `getInvolved` from `./copy` |

- [ ] **Step 3: Reduce `index.tsx` to the composition**

`index.tsx` imports `usePageTitle` from `../../utils` and the five section components, and its `HomePage` body is unchanged: `usePageTitle()`, then `<Hero />`, and inside the `max-w-4xl mx-auto px-4 py-6` container `<Intro />`, `<ProgramsOffered />`, `<MoreOnTheSite />`, `<GetInvolved />`.

- [ ] **Step 4: Rename the `Season` type in `programs.ts`**

Rename `export type Season` to `export type SeasonOffering` and update `programs: SeasonOffering[]`. Nothing else references it (`grep -rn 'Season\b' src` should then return nothing).

- [ ] **Step 5: Add a sync section to `CLAUDE.md`**

In the Project structure block, change the home line to `home/      — index.tsx (composition) + one file per section + copy.ts + programs.ts`. Then add this section after "Coding conventions":

```markdown
## Shared with maa-prototype

`maa-prototype` (the future full app) keeps these paths byte-identical to this repo. Change them here first, then copy them across:

- `src/content.ts`, `src/components/`
- `src/pages/about/`, `faq/`, `fields/`, `sponsors/`, `not-found/`
- `src/pages/home/` except `index.tsx` (the prototype adds `OpenSeason.tsx` and its own `index.tsx`)
- `.github/workflows/deploy.yml`, `.nvmrc`, `.prettierrc`, `tsconfig*.json`, `eslint.config.js`
- `public/favicon.png`, `public/static/field-1.webp`, `public/static/fields-aerial.webp`, `public/static/sports-balls.jpg`

The prototype's `CLAUDE.md` has the command that checks them.
```

- [ ] **Step 6: Verify**

Run: `npm run build && npm run lint && npm run format:check`
Expected: all three exit 0; format check prints "All matched files use Prettier code style!"

Then `npm run dev`, open the printed URL (`…/maa-frontend/`), and compare the home page against https://smithgotsurf.github.io/maa-frontend/ (the deployed `main`): same sections in the same order, same spacing, both teaser images load, browser tab title "Meadow Athletic Association".

- [ ] **Step 7: Commit**

```bash
git add src/pages/home CLAUDE.md
git commit -m "Split home page sections into their own files

Prepares the home page to be shared with maa-prototype: each section is
its own file so the prototype can copy them unchanged. Renames the
programs.ts Season type to SeasonOffering to avoid a clash with the
prototype's Season type. No visual change.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Pushing and merging `refactor/home-sections` is the user's call. Prototype Task 5 can copy from this branch's working tree if it hasn't merged yet.
