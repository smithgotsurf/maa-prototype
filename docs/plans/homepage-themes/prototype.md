# Homepage Themes — maa-prototype Implementation Plan

> Design: [design.md](./design.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the homepage themes, subpage bands and paper-grain margins from maa-frontend into the prototype, with shared files byte-identical.

**Architecture:** Copy the shared paths from `/Users/josh/Code/maa/maa-frontend` (its `feature/homepage-themes` branch, finished per [frontend.md](./frontend.md)) unchanged. Then make the same small edits the frontend made to its per-repo files (`index.css`, `App.tsx`, `pages/home/index.tsx`), and adapt the prototype-only pages (Register, Cart, Admin) to the new column and background.

**Tech Stack:** React 19, TypeScript ~6.0 (strict), Vite 8, react-router-dom 7 (HashRouter), Tailwind 4 + DaisyUI 5.

**Spec:** [design.md](./design.md). Visual reference: [mockup.html](./mockup.html).

**Verification model:** No tests. Every task ends with `npm run build && npm run lint && npm run format:check` (all exit 0) plus the browser checks listed. Dev server: the `maa-prototype` entry in `/Users/josh/Code/maa/.claude/launch.json` (port 5181), or `npm run dev` and the URL Vite prints (`…/maa-prototype/`).

**Prerequisite:** [frontend.md](./frontend.md) Tasks 1–4 are committed on maa-frontend's `feature/homepage-themes`, and that branch is checked out in `../maa-frontend`.

**Code Review Checkpoints:**
- **Final Review:** After Tasks 1–2, together with frontend Checkpoint 2's follow-ups, if any.

## Global Constraints

- Repo `/Users/josh/Code/maa/maa-prototype`, branch `feature/homepage-themes` off an up-to-date `main`.
- **Shared paths are copied, never retyped:** `src/components/`, `src/pages/{about,faq,fields,sponsors,not-found}/`, `src/pages/home/` except `index.tsx` and `OpenSeason.tsx`, and `public/`. The parity check in this repo's `CLAUDE.md` must print nothing at the end.
- For `index.css`, `App.tsx` and `pages/home/index.tsx`, make the same edit maa-frontend made. `diff ../maa-frontend/<file> <file>` must show only the prototype's existing additions.
- Register, Cart and Admin: no logic or markup changes beyond the wrappers named in Task 1. No header bands on them (design non-goal).
- Prettier: `printWidth 100`, `singleQuote`. Run `npm run format` after editing.

## Review Focus

1. **The homepage with a season open** (`OpenSeason`) and **with none open** (`Intro` + `ProgramsOffered`) both sit in the tan column under the curved hero, and the season card overlaps the hero the same way the Welcome card does. Check: Task 1 Step 8.
2. **Admin** shows no paper grain behind the dashboard, and its sidebar layout is unchanged. Check: Task 1 Step 8.
3. **Register and Cart** in every state (registration closed, the step flow, the empty cart, the checkout-done screen) sit in the tan column with the footer directly below, with no grain strip. Check: Task 1 Step 8.
4. **The theme switch** shows only in the homepage footer, including when Register and Cart are in the nav. Check: Task 1 Step 8.
5. **Shared paths match maa-frontend exactly** (the parity check prints nothing). Check: Task 2 Step 2.

---

## Tasks

| # | Task | Description | Model |
|---|------|-------------|-------|
| 1 | [Copy shared files and adapt the prototype](#task-1) | Copy components, pages and assets; same per-repo edits as frontend; Register/Cart/Admin wrappers | sonnet |
| 2 | [Docs and parity](#task-2) | Prototype `CLAUDE.md`; parity check; commit the plan docs | sonnet |

---

<a id="task-1"></a>
### Task 1: Copy shared files and adapt the prototype

**Files:**
- Copy from maa-frontend: `src/components/`, `src/pages/{about,faq,fields,sponsors,not-found}/`, `src/pages/home/Hero.tsx`, `src/pages/home/copy.ts`, `public/static/*.svg`
- Modify: `src/index.css`, `src/App.tsx`, `src/pages/home/index.tsx`, `src/pages/register/index.tsx`, `src/pages/cart/index.tsx`, `src/pages/admin/index.tsx`

**Interfaces:**
- Consumes (from the copied `src/components/`): `PageColumn({ className = 'pt-8 pb-20', children })`, where `className` holds only top/bottom padding; `Hero` from `src/pages/home/Hero.tsx`.

- [ ] **Step 1: Branch and install**

```bash
cd /Users/josh/Code/maa/maa-prototype
git switch main && git pull --ff-only
git switch -c feature/homepage-themes
npm ci
```

The plan folder `docs/plans/homepage-themes/` is untracked and comes along to the new branch. It's committed in Task 2.

- [ ] **Step 2: Copy the shared paths**

```bash
F=/Users/josh/Code/maa/maa-frontend
for p in src/components src/pages/about src/pages/faq src/pages/fields src/pages/sponsors src/pages/not-found; do rsync -a --delete --exclude .DS_Store "$F/$p/" "$p/"; done
cp "$F/src/pages/home/Hero.tsx" "$F/src/pages/home/copy.ts" src/pages/home/
cp "$F"/public/static/*.svg public/static/
```

Expected: `git status --short` shows the six new components, the five page folders, `Hero.tsx`, `copy.ts` and the six SVGs, and nothing in `register/`, `cart/`, `admin/` or `OpenSeason.tsx`.

- [ ] **Step 3: Same `body` grain as the frontend**

Copy the `body { … }` rule from `../maa-frontend/src/index.css` over this repo's `body` rule.
Run: `diff ../maa-frontend/src/index.css src/index.css`
Expected: only the prototype's `.table` block shows.

- [ ] **Step 4: Same flex `main` as the frontend**

In `src/App.tsx`, `<main className="flex-1">` becomes `<main className="flex flex-1 flex-col">`.
Run: `diff ../maa-frontend/src/App.tsx src/App.tsx`
Expected: only the prototype's existing additions (cart/season context, Register/Cart/Admin nav items, badges, the "Josh S." user button).

- [ ] **Step 5: Homepage column**

In `src/pages/home/index.tsx`, return `<><Hero /><PageColumn className="pt-6 pb-18">…</PageColumn></>`, keeping the `activeSeason` conditional and the `MoreOnTheSite` / `GetInvolved` sections inside unchanged. Import `PageColumn` from `../../components/PageColumn`.

- [ ] **Step 6: Register, Cart and Admin**

Import `PageColumn` from `../../components/PageColumn` where it's used.

| File | Today | Becomes |
|---|---|---|
| `register/index.tsx` | registration-closed wrapper `<div className="max-w-4xl mx-auto px-4 py-8">` | `<PageColumn>` |
| `register/index.tsx` | step-flow wrapper `<div className="max-w-4xl mx-auto px-4 py-6">` | `<PageColumn className="pt-6 pb-18">` |
| `cart/index.tsx` | both `<div className="max-w-4xl mx-auto px-4 py-8">` wrappers (checkout done, and the cart) | `<PageColumn>` |
| `admin/index.tsx` | root `grid grid-cols-1 md:grid-cols-[190px_1fr] min-h-[calc(100vh-56px)]` | the same classes plus `bg-base-200` |

- [ ] **Step 7: Build, lint, format**

Run: `npm run format && npm run build && npm run lint && npm run format:check`
Expected: all exit 0.

- [ ] **Step 8: Check in the browser**

- **Homepage, no season open:** in Admin → Seasons, deactivate the active season. The curved hero, Welcome card and What We Offer look like maa-frontend's homepage.
- **Homepage, season open:** activate a season. The season card overlaps the hero like the Welcome card does, with Available Programs below, all in the tan column.
- **Theme:** `localStorage.setItem('maa_theme','gold-lines')` and reload switches the hero. The footer switch shows on the homepage only, not on Register, Cart or Admin.
- **Subpages:** About, FAQ, Field Rentals (photo band), Sponsorship and `#/does-not-exist` match maa-frontend.
- **Register:** closed (no active season) and the step flow both show the tan column, with the footer right below it and no grain strip.
- **Cart:** with an item in it, and the checkout-done screen. Same checks as Register.
- **Admin:** no grain anywhere behind the dashboard, and the sidebar unchanged.
- At 375px: no horizontal scroll on any of the above.

- [ ] **Step 9: Commit**

```bash
git add src public
git commit -m "feat: homepage themes, subpage bands and paper grain (from maa-frontend)"
```

---

<a id="task-2"></a>
### Task 2: Docs and parity

**Files:**
- Modify: `CLAUDE.md`
- Add: `docs/plans/homepage-themes/` (this plan)

- [ ] **Step 1: Update `CLAUDE.md`**

Make the same additions maa-frontend's `CLAUDE.md` got in its Task 4 Step 3:
- the six new `components/` files in Project structure
- the grain, `PageColumn` and `PageBand` notes in Styling
- the Themes section

Copy the frontend wording where the content is the same. Add one Styling line: Register and Cart wrap their content in `PageColumn`; Admin's root has `bg-base-200` so the grain doesn't show behind it.

- [ ] **Step 2: Run the parity check**

From the repo root, run the shared-paths check in `CLAUDE.md` (the `for p in …` loop).
Expected: no output.

- [ ] **Step 3: Build, lint, format**

Run: `npm run build && npm run lint && npm run format:check`
Expected: all exit 0.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md docs/plans/homepage-themes
git commit -m "docs: homepage themes design, plans and notes"
```

Push and open the PRs (both repos) only when asked. The prototype's parity check expects maa-frontend's `main`, so merge maa-frontend first.
