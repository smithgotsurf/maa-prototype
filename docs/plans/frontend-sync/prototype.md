# Frontend Sync — maa-prototype Implementation Plan

> Design: [design.md](./design.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the frontend's v1/v2/tech-cleanup/tooling updates into the prototype, with shared files byte-identical to `maa-frontend`, a home page that switches on the active season, and registration/admin in page folders.

**Architecture:** Copy the shared files from `/Users/josh/Code/maa/maa-frontend` unchanged. Hand-merge only the files the design lists under "Where the prototype differs" (`App.tsx`, `main.tsx`, `utils.tsx`, `index.html`, `package.json`, home `index.tsx` + `OpenSeason.tsx`). Registration and admin move into folders with no logic change.

**Tech Stack:** React 19, TypeScript ~6.0 (strict), Vite 8, react-router-dom 7 (HashRouter), Tailwind 4 + DaisyUI 5, ESLint 10, Prettier.

**Spec:** [design.md](./design.md)

**Verification model:** No tests (design non-goal). Every task ends with `npm run build && npm run lint && npm run format:check` (all exit 0) plus the dev-server checks listed in the task. Dev server: `npm run dev`, then open the URL Vite prints (`…/maa-prototype/`). Both repos default to port 5174, so the second one started gets the next free port.

**Prerequisite:** Do [frontend.md](./frontend.md) Task 1 first. Task 5 here copies its split home files, and its `npm ci` refreshes the frontend's `node_modules`, which Task 1 here compares Prettier versions against.

**Code Review Checkpoints:**
- **Checkpoint 1:** After frontend.md Task 1 and Tasks 1–3 here (frontend home split, tooling, shared marketing pages, sample data)
- **Checkpoint 2:** After Tasks 4–5 (App shell, footer, meta tags, home page)
- **Final Review:** After Tasks 6–7 (registration/admin move, docs, parity check)

## Global Constraints

- Branch: `feature/frontend-sync` (already created from up-to-date `main`).
- **Shared paths must be byte-identical to `maa-frontend`:** `src/content.ts`, `src/components/`, `src/pages/{about,faq,fields,sponsors,not-found}/`, `src/pages/home/` except `index.tsx` and `OpenSeason.tsx`, `.github/workflows/deploy.yml`, `.nvmrc`, `.prettierrc`, `tsconfig.json`, `tsconfig.app.json`, `eslint.config.js`, `public/favicon.png`, `public/static/{field-1.webp,fields-aerial.webp,sports-balls.jpg}`. Copy them; never retype them.
- Tool versions come from the frontend's `package.json`: `@eslint/js ^10.0.1`, `@vitejs/plugin-react ^6.1.2`, `eslint ^10.13.0`, `typescript ~6.0.3`, `vite ^8.3.4`, `engines.node ">=22.13"`. The package name stays `maa-prototype`.
- Register, Cart, and Admin: files move, logic and markup don't change.
- Page titles: `usePageTitle('X')` gives `X | Meadow Athletic Association`; the home page calls `usePageTitle()` for just the site name.
- Prototype public URL: `https://smithgotsurf.github.io/maa-prototype/`. `vite.config.ts` keeps `base: '/maa-prototype/'`.
- Prettier: `printWidth 100`, `singleQuote`. Run `npm run format` on anything you hand-edit.
- Seasons persist in localStorage under `maa_seasons`. To see seed-data changes, run `localStorage.removeItem('maa_seasons')` in the browser console and reload.

## Review Focus

1. **An active season with no programs** must not render "Infinity" in the Available Programs subhead. Check: Task 5 Step 6.
2. **Activating or deactivating a season in Admin** switches the home view without a reload. Check: Task 5 Step 6.
3. **The Cart nav item and its count badge** still appear in both the desktop navbar and the mobile drawer after the App merge. Check: Task 4 Step 4.
4. **The mobile drawer:** with it closed, Tab never lands on drawer links; with it open, Tab reaches them; Register shows only while a season is active. Check: Task 4 Step 4.
5. **Unknown routes** (`#/does-not-exist`) render the 404 page inside the layout (navbar and footer), titled "Page Not Found | Meadow Athletic Association". Check: Task 2 Step 7 (page) and Task 4 Step 4 (footer).

---

## Tasks

| # | Task | Description | Model |
|---|------|-------------|-------|
| 1 | [Tooling upgrade](#task-1) | Prettier baseline; Vite 8 / ESLint 10 / TS 6; `.nvmrc`; deploy workflow | sonnet |
| 2 | [Shared marketing pages](#task-2) | Copy content, components, page folders and images; merge `utils.tsx`; update routes | sonnet |
| 3 | [Volleyball sample data](#task-3) | Move volleyball to fall (10U/12U) in `SPORT_TYPES` and the seed seasons | sonnet |
| 4 | [App shell, footer, meta tags](#task-4) | Merge frontend `App.tsx` changes; render Footer; frontend `index.html` with prototype URLs | sonnet |
| 5 | [Home page](#task-5) | Copy split home files; add `OpenSeason.tsx`; compose by active season | sonnet |
| 6 | [Registration and admin folders](#task-6) | Move Register, Cart, Admin into `pages/` folders; add page titles | sonnet |
| 7 | [Docs and parity check](#task-7) | Update `CLAUDE.md` / `README.md`; add sync section; diff shared paths | sonnet |

---

<a id="task-1"></a>
### Task 1: Tooling upgrade

**Files:**
- Create: `.nvmrc` (copy)
- Modify: `package.json`, `package-lock.json`, `.github/workflows/deploy.yml` (copy), and Prettier-only changes to `src/App.tsx`, `src/index.css`, `src/pages/AdminPage.tsx`, `src/pages/FaqPage.tsx`, `src/pages/SponsorsPage.tsx`, `src/Registration.tsx`

**Interfaces:**
- Produces: a prototype that builds on the new toolchain and passes `format:check`. After this task, `src/index.css` is exactly the frontend's file plus the `.table` block, so later tasks don't touch it.

- [ ] **Step 1: Commit the design and plans**

```bash
cd /Users/josh/Code/maa/maa-prototype
git add docs/plans/frontend-sync
git commit -m "docs: add frontend sync design and implementation plans

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 2: Upgrade packages**

Set the five devDependency versions and `engines` from Global Constraints in `package.json` (place `engines` where the frontend's `package.json` has it). Copy `.nvmrc` and `.github/workflows/deploy.yml` from the frontend. Then run `npm install` followed by `npm update`, so in-range packages (Prettier especially) resolve the same way as in the frontend.

Expected: `node_modules/.bin/tsc -v` prints `Version 6.0.3`, and `node_modules/.bin/prettier -v` prints the same version as `../maa-frontend/node_modules/.bin/prettier -v` (3.9.10 at the time of writing, after `npm ci` in the frontend). If they differ, the frontend's lockfile wins: `npm install -D prettier@<frontend version>`.

- [ ] **Step 3: Verify and commit the upgrade**

Run: `npm run build && npm run lint`
Expected: both exit 0. (This combination was already checked against the current code in a scratch copy; if something does fail, fix it without changing behavior.) `format:check` still fails on six files at this point; Step 4 fixes that.

Dev server: the home page renders, and Register can get a player as far as program selection.

```bash
git add package.json package-lock.json .nvmrc .github/workflows/deploy.yml
git commit -m "chore: upgrade to Vite 8, ESLint 10, TypeScript 6; pin Node

- vite 6 -> 8, @vitejs/plugin-react 4 -> 6, eslint and @eslint/js 9 -> 10
- typescript 5 -> ~6.0 (typescript-eslint doesn't support 6.1+ yet)
- .nvmrc (24) and engines.node >=22.13
- Deploy workflow from maa-frontend: lint before build, Node from .nvmrc

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 4: Prettier baseline**

Run `npm run format`. Expected: it rewrites the six files listed above (whitespace, quotes and hex case only), and `diff ../maa-frontend/src/index.css src/index.css` then shows only the added `.table` block.

Run: `npm run build && npm run lint && npm run format:check`
Expected: all exit 0.

```bash
git add src
git commit -m "style: apply Prettier to unformatted files

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

<a id="task-2"></a>
### Task 2: Shared marketing pages

**Files:**
- Create (copy from frontend): `src/content.ts`, `src/components/Footer.tsx`, `src/components/ContactSection.tsx`, `src/pages/about/`, `src/pages/faq/`, `src/pages/fields/`, `src/pages/sponsors/`, `src/pages/not-found/`, `public/favicon.png`, `public/static/field-1.webp`, `public/static/fields-aerial.webp`, `public/static/sports-balls.jpg`
- Delete: `src/pages/AboutPage.tsx`, `src/pages/FaqPage.tsx`, `src/pages/FieldsPage.tsx`, `src/pages/SponsorsPage.tsx`, `public/static/fields-aerial.jpg`, `public/static/dirty-base.jpg`, `public/static/home-top-background.jpg`
- Modify: `src/utils.tsx`, `src/main.tsx`

**Interfaces:**
- Produces: `usePageTitle(title?: string): void` and `PAGE_PATHS` with keys `home, about, faq, fields, sponsors, register, cart, admin`, both from `src/utils.tsx`. Default-exported page components from `./pages/about`, `./pages/faq`, `./pages/fields`, `./pages/sponsors`, `./pages/not-found`.

- [ ] **Step 1: Copy the shared files and images**

```bash
cd /Users/josh/Code/maa
F=maa-frontend; P=maa-prototype
mkdir -p "$P/src/components"
cp "$F/src/content.ts" "$P/src/"
cp "$F/src/components/Footer.tsx" "$F/src/components/ContactSection.tsx" "$P/src/components/"
cp -R "$F/src/pages/about" "$F/src/pages/faq" "$F/src/pages/fields" "$F/src/pages/sponsors" "$F/src/pages/not-found" "$P/src/pages/"
cp "$F/public/favicon.png" "$P/public/"
cp "$F/public/static/field-1.webp" "$F/public/static/fields-aerial.webp" "$F/public/static/sports-balls.jpg" "$P/public/static/"
```

- [ ] **Step 2: Delete the replaced pages and unused images**

`git rm` the seven files listed under Delete. (`field-1.jpg` stays; the old `HomePage.tsx` still uses it until Task 5, and the Open Graph image uses it after that.)

- [ ] **Step 3: Merge `src/utils.tsx`**

Start from the frontend's `utils.tsx` and add the prototype's extras as separate blocks, so a diff against the frontend shows only additions:
1. After `import { useEffect } from 'react';`, add `import type { Player, Program } from './types';`.
2. `icons`: the frontend's nine entries in the frontend's order, then the prototype-only entries (`ball, home, clip, cart, gear, users, chk, chev, trash, plus, award, cal, phone`) with their current SVG strings.
3. `PAGE_PATHS`: the frontend's five keys, then `register: '/register'`, `cart: '/cart'`, `admin: '/admin'`.
4. After `usePageTitle`, a `// Registration helpers` block with the current `ld`, `age`, `fmtDate`, `recommended`, `otherPrograms`, `fullName`, `calcTotal`, unchanged.

- [ ] **Step 4: Update `src/main.tsx`**

Match the frontend's style: `StrictMode` / `createRoot` named imports, and `import './index.css'` as the last import. Keep `<AppProvider>` wrapping `<HashRouter>`. Import About, FAQ, Fields, Sponsors and NotFound from their folders; keep `HomePage` from `./pages/HomePage`, `AdminPage` from `./pages/AdminPage`, and `{ RegPage, CartPage }` from `./Registration` for now. Routes in this order: index, `about`, `faq`, `field-rentals`, `sponsorship`, `register`, `cart`, `admin`, `*` → `<NotFoundPage />`.

- [ ] **Step 5: Format**

Run `npm run format`, then confirm the copied files are still identical: `diff -rq ../maa-frontend/src/pages/faq src/pages/faq` (and the same for each copied path) prints nothing.

- [ ] **Step 6: Build checks**

Run: `npm run build && npm run lint && npm run format:check`
Expected: all exit 0.

- [ ] **Step 7: Dev server checks**

- `#/about`: board cards, members, and the contact cards; title "About | Meadow Athletic Association".
- `#/faq`: Tab to a question and press Enter to open and close it; Fall lists Volleyball (10U, 12U); there's no "When do practices start?" question.
- `#/field-rentals`: the aerial photo loads (WebP).
- `#/sponsorship`: three tiers; the Download Sponsorship Form link opens the PDF.
- `#/does-not-exist`: the 404 page with a "Back to home" button; title "Page Not Found | Meadow Athletic Association".

- [ ] **Step 8: Commit**

```bash
git add -A src public
git commit -m "feat: port marketing pages, content and images from maa-frontend

Page folders with extracted content, shared content.ts, ContactSection
and Footer components, FAQ and sponsorship accessibility fixes, updated
FAQ copy, per-page titles, 404 route, and WebP photos. Shared files are
identical to maa-frontend.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

<a id="task-3"></a>
### Task 3: Volleyball sample data

**Files:**
- Modify: `src/data.ts` (`SPORT_TYPES`, `SEED_SEASONS` entries `s2` and `s3`)

**Interfaces:**
- Consumes: nothing new. Produces: no new names.

- [ ] **Step 1: `SPORT_TYPES`**

Delete the three Volleyball lines from the `// Winter` group. Append these to the end of the `// Fall` group, after `Soccer 8U Girls`:

```ts
  { name: 'Volleyball 10U', gender: 'Coed', min: 9, max: 10, fee: 80 },
  { name: 'Volleyball 12U', gender: 'Coed', min: 11, max: 12, fee: 80 },
```

- [ ] **Step 2: Seed seasons**

- In `s2` (2025 Fall Sports), append two programs after `pg-f9`, in the same shape as the existing entries: `id: 'pg-f10'`, `name: 'Volleyball 10U'`, `gender: 'Coed'`, `ageAsOfDate: null`, `min: 9`, `max: 10`, `fee: 80`, `closed: false`; and `id: 'pg-f11'`, `name: 'Volleyball 12U'`, `min: 11`, `max: 12`, otherwise the same.
- In `s3` (2025-2026 Winter Sports), delete `pg-w9`, `pg-w10` and `pg-w11`.

- [ ] **Step 3: Verify**

Run: `npm run build && npm run lint && npm run format:check` (all exit 0) and `grep -n Volleyball src/data.ts` (expect exactly four lines: two in `SPORT_TYPES`, two in `s2`).

Dev server: clear `maa_seasons` and reload. In Admin → Seasons, 2025 Fall Sports lists Volleyball 10U and 12U, 2025-2026 Winter Sports has no volleyball, and the season editor's sport list has no Volleyball 8U.

- [ ] **Step 4: Commit**

```bash
git add src/data.ts
git commit -m "fix: move volleyball to fall (10U and 12U) in sample data

Matches the home page and FAQ: volleyball is a fall sport for 10U and
12U only.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

<a id="task-4"></a>
### Task 4: App shell, footer, meta tags

**Files:**
- Modify: `src/App.tsx`, `index.html`

**Interfaces:**
- Consumes: `Footer` (default export, `src/components/Footer.tsx`, from Task 2).

- [ ] **Step 1: Merge the frontend's `App.tsx` changes**

Keep everything the prototype has (the `useAppContext` nav with Register / Cart badge / Admin, and both "Josh S." buttons). Add exactly what the frontend added:
- imports `useEffect`, `useLocation`, and `Footer from './components/Footer'`;
- `const { pathname } = useLocation();` plus a `useEffect` that calls `window.scrollTo(0, 0)` on `[pathname]`;
- the outer `<div>` becomes `<div className="min-h-screen flex flex-col">`;
- `inert={!menuOpen}` and `aria-hidden={!menuOpen}` on the off-canvas `<nav>`;
- `<Outlet />` becomes `<main className="flex-1"><Outlet /></main>`, followed by `<Footer />`.

Copy those lines from the frontend's `App.tsx` rather than retyping them. Then `diff ../maa-frontend/src/App.tsx src/App.tsx` should show only the prototype's nav extras.

- [ ] **Step 2: `index.html`**

Copy the frontend's `index.html` over the prototype's, then change both `https://smithgotsurf.github.io/maa-frontend/` occurrences (`og:url`, `og:image`) to `https://smithgotsurf.github.io/maa-prototype/`. Expected: `grep -c maa-frontend index.html` prints `0`, and `grep -c maa-prototype index.html` prints `2`.

- [ ] **Step 3: Build checks**

Run: `npm run build && npm run lint && npm run format:check`
Expected: all exit 0.

- [ ] **Step 4: Dev server checks** (Review Focus 3, 4, 5)

- The footer shows on every page, including Register, Cart, Admin and `#/does-not-exist`, and sits at the bottom of short pages.
- Scroll down on FAQ, then click a footer link: the new page opens at the top.
- Add a registration to the cart: Cart appears with a count badge in the desktop navbar and in the mobile drawer.
- At a width under 1024px, with the drawer closed, Tab through the page: focus never lands on the hidden drawer links. Open the drawer: Tab reaches its links.
- With the seeded Spring season active, Register is in the nav. Deactivate it in Admin → Seasons: Register disappears. Reactivate it.
- The browser tab shows the favicon; the tab title on the home page is "Meadow Athletic Association".

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx index.html
git commit -m "feat: add global footer, scroll reset, drawer a11y fix and meta tags

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

<a id="task-5"></a>
### Task 5: Home page

**Files:**
- Create (copy from frontend after frontend.md Task 1): `src/pages/home/Hero.tsx`, `Intro.tsx`, `ProgramsOffered.tsx`, `MoreOnTheSite.tsx`, `GetInvolved.tsx`, `copy.ts`, `programs.ts`
- Create: `src/pages/home/OpenSeason.tsx`, `src/pages/home/index.tsx`
- Delete: `src/pages/HomePage.tsx`
- Modify: `src/main.tsx` (HomePage import)

**Interfaces:**
- Consumes: from frontend.md Task 1, five prop-less default-exported section components. From the prototype: `useAppContext().activeSeason: Season | null` and `type Season` (`src/types/index.ts`; `programs: Program[]`, each with `id, name, gender: 'Coed' | 'Male' | 'Female', min, max, closed`).
- Produces: `export default function OpenSeason({ season }: { season: Season })` in `OpenSeason.tsx`; `export default function HomePage()` in `index.tsx`.

- [ ] **Step 1: Copy the shared home files**

Confirm `/Users/josh/Code/maa/maa-frontend` is on `refactor/home-sections` (or `main` after it merged) and that `src/pages/home/Hero.tsx` exists there. Then:

```bash
cd /Users/josh/Code/maa
mkdir -p maa-prototype/src/pages/home
for f in Hero.tsx Intro.tsx ProgramsOffered.tsx MoreOnTheSite.tsx GetInvolved.tsx copy.ts programs.ts; do
  cp "maa-frontend/src/pages/home/$f" maa-prototype/src/pages/home/
done
```

- [ ] **Step 2: Create `OpenSeason.tsx`**

Renders a fragment with two parts:
1. **The season card:** move the current `activeSeason` card unchanged from `src/pages/HomePage.tsx`. That's the `div` with `sm:flex-row … -mt-34 … mb-10`, the season name and description, and the Register Now button that navigates to `/register` with the `icons.chev` icon.
2. **A `<section>` for Available Programs**, restyled to match What We Offer:
   - `<h2 className="text-[30px] font-bold mb-1.5">Available Programs</h2>`, then `<div className="w-11 h-[3px] bg-primary rounded-sm mb-3" />`
   - If `season.programs.length > 0`: `<p className="text-[17px] text-base-content/70 leading-relaxed mb-5">` with "{n} programs for ages {min}–{max}" (min of `p.min`, max of `p.max`), then the grid.
   - If it's empty: the same `<p>` reading "Programs will be listed here soon.", and no grid. (This is my call, made to avoid "Infinity"; see Review Focus 1.)
   - Grid `grid grid-cols-1 md:grid-cols-3 gap-4`; columns `[['Coed', 'Coed'], ['Boys', 'Male'], ['Girls', 'Female']]` as now. Each column heading is `<h3 className="text-xl font-bold text-center mb-3">`. Each program card is `card bg-white border border-primary rounded-[10px] p-4.5 mb-2`, plus ` opacity-40` when `p.closed`. The card's inside is unchanged: name in `h4.font-serif.font-semibold.text-base`, the `badge badge-error badge-sm` "Closed" badge, and "Ages {min}–{max}" in `text-xs text-base-content/50`.

- [ ] **Step 3: Create `index.tsx`**

```tsx
export default function HomePage() {
  usePageTitle();
  const { activeSeason } = useAppContext();
  return (
    <div>
      <Hero />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeSeason ? (
          <OpenSeason season={activeSeason} />
        ) : (
          <>
            <Intro />
            <ProgramsOffered />
          </>
        )}
        <MoreOnTheSite />
        <GetInvolved />
      </div>
    </div>
  );
}
```

Imports: `usePageTitle` from `../../utils`, `useAppContext` from `../../context/AppContext`, and the six section components.

- [ ] **Step 4: Wire it up**

`git rm src/pages/HomePage.tsx`; in `main.tsx`, import `HomePage` from `./pages/home`.

- [ ] **Step 5: Build checks**

Run: `npm run build && npm run lint && npm run format:check` (all exit 0), then `diff -rq ../maa-frontend/src/pages/home src/pages/home`. The expected output is exactly two lines: `index.tsx` differs, and `OpenSeason.tsx` is only in the prototype.

- [ ] **Step 6: Dev server checks** (Review Focus 1, 2)

- **Season active (the seeded Spring season):** the season card overlaps the hero, the Register Now button goes to Register, Available Programs uses the gold-bar heading, Coed / Boys / Girls labels and gold-bordered cards, and closed programs are dimmed with a badge. Book a Field, Become a Sponsor and Get Involved follow.
- **No season active:** in Admin → Seasons, deactivate Spring, then click the logo (no reload). The home page now matches the frontend's: Welcome card, What We Offer, then the same lower sections. Reactivate Spring and go Home: the season view is back.
- **Empty season:** if Admin lets you create and activate a season with no programs, do it. Home shows "Programs will be listed here soon." and no "Infinity". Afterwards, clear `maa_seasons` to restore the seed.

- [ ] **Step 7: Commit**

```bash
git add -A src/pages src/main.tsx
git commit -m "feat: rework home page with frontend sections and open-season view

Uses the frontend's home sections (copied unchanged). When a season is
active, OpenSeason shows the season card and its programs, restyled to
match What We Offer; otherwise the frontend's Welcome card and program
grid show. Book a Field, Become a Sponsor and Get Involved always follow.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

<a id="task-6"></a>
### Task 6: Registration and admin folders

**Files:**
- Move: `src/Registration.tsx` → `src/pages/register/index.tsx`; `src/pages/AdminPage.tsx` → `src/pages/admin/index.tsx`
- Create: `src/pages/cart/index.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `usePageTitle` (Task 2).
- Produces: default exports `RegPage` (`./pages/register`), `CartPage` (`./pages/cart`), `AdminPage` (`./pages/admin`).

- [ ] **Step 1: Move with history**

```bash
cd /Users/josh/Code/maa/maa-prototype
mkdir -p src/pages/register src/pages/cart src/pages/admin
git mv src/Registration.tsx src/pages/register/index.tsx
git mv src/pages/AdminPage.tsx src/pages/admin/index.tsx
```

- [ ] **Step 2: Split out Cart**

Cut everything from `export function CartPage()` to the end of `src/pages/register/index.tsx` into `src/pages/cart/index.tsx` as `export default function CartPage()`. CartPage uses none of Register's helper components (`AddModal`, `ProgCard`, `SectionLabel`, `RequiredLabel`, `OptCard`, `SizeBtn`), so those stay inline in `register/index.tsx`. Give `cart/index.tsx` the imports its body uses (`useState`, `useNavigate`, `useAppContext`, `Ic`, `icons`, `fullName`, `age`). Remove imports that `register/index.tsx` no longer uses; `noUnusedLocals` will list them.

- [ ] **Step 3: Fix paths, exports and titles**

- In `register/index.tsx`: `export function RegPage` → `export default function RegPage`; `./data`, `./utils`, `./context/AppContext`, `./types` become `../../…`.
- In `admin/index.tsx`: `../utils`, `../data`, `../context/AppContext`, `../types` become `../../…`.
- Make `usePageTitle('Register')`, `usePageTitle('Cart')` and `usePageTitle('Admin')` the first statement of each component, before any early return.
- In `main.tsx`, import the three pages from their folders.

- [ ] **Step 4: Verify**

Run: `npm run build && npm run lint && npm run format:check` (all exit 0) and `git diff -M HEAD --stat -- src/pages/AdminPage.tsx src/pages/admin/index.tsx` (Admin shows as a rename, `src/pages/{AdminPage.tsx => admin/index.tsx}`, with only the import-path and title lines changed).

Dev server, full regression:
- Register: add a player, pick a recommended program, go through every step (waivers included), and add to the cart. The tab title reads "Register | …".
- Cart: the item shows with the right total, remove works, checkout's done state renders. The tab title reads "Cart | …".
- Admin: every tab renders, including the registrations table with its styling. Create, edit, clone, activate, deactivate and delete a season all work. The tab title reads "Admin | …".

- [ ] **Step 5: Commit**

```bash
git add -A src
git commit -m "refactor: move register, cart and admin into page folders

Same layout as the marketing pages. No logic or markup changes; adds
per-page titles.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

<a id="task-7"></a>
### Task 7: Docs and parity check

**Files:**
- Modify: `CLAUDE.md`, `README.md`

- [ ] **Step 1: `CLAUDE.md`**

- **Tech stack:** Vite 8; TypeScript 6 pinned `~6.0.x` (typescript-eslint doesn't support 6.1+ or 7 yet); ESLint 10; the Node version line (pinned in `.nvmrc`, CI reads it, `engines` sets the minimum); the deploy line (lint then build via `.github/workflows/deploy.yml`).
- **Project structure:** `components/` (Footer, ContactSection), `content.ts`, and `pages/` as folders: `home/` (index + one file per section + `OpenSeason.tsx` + `copy.ts` + `programs.ts`), `about/`, `faq/`, `fields/`, `sponsors/`, `not-found/`, `register/`, `cart/`, `admin/`. Remove `Registration.tsx`. Add the `public/static/` note that photos are WebP and `field-1.jpg` is kept for `og:image`.
- **Routing:** the table gains `*` → NotFoundPage. Add "Each page calls `usePageTitle()`; `App.tsx` scrolls to top on route change." Add "Path constants are in `utils.tsx` as `PAGE_PATHS`."
- **Coding conventions:** replace the Registration named-exports line with "Page components are default exports from `pages/<name>/index.tsx`". Add the frontend's rule: page-specific content lives in sibling files; only genuinely shared content goes in `src/content.ts`.
- **Home page:** add one line: it shows `OpenSeason` when `activeSeason` is set, otherwise `Intro` + `ProgramsOffered`, then `MoreOnTheSite` and `GetInvolved` either way.
- **New section "Shared with maa-frontend":** the shared-path list from Global Constraints, the rule "change them in maa-frontend first, then copy them here", and this check, run from the repo root (it should print nothing):

```bash
for p in src/content.ts src/components src/pages/about src/pages/faq src/pages/fields src/pages/sponsors src/pages/not-found src/pages/home/Hero.tsx src/pages/home/Intro.tsx src/pages/home/ProgramsOffered.tsx src/pages/home/MoreOnTheSite.tsx src/pages/home/GetInvolved.tsx src/pages/home/copy.ts src/pages/home/programs.ts .github/workflows/deploy.yml .nvmrc .prettierrc tsconfig.json tsconfig.app.json eslint.config.js public/favicon.png public/static/field-1.webp public/static/fields-aerial.webp public/static/sports-balls.jpg; do diff -rq "../maa-frontend/$p" "$p" >/dev/null 2>&1 || printf 'DIFFERS: %s\n' "$p"; done
```

- [ ] **Step 2: `README.md`**

Update the stack versions (TypeScript 6, Vite 8, ESLint 10) and the structure block to match `CLAUDE.md`. Mention the deploy workflow runs on push to `main`.

- [ ] **Step 3: Parity check and final verification**

Run the check from Step 1 in `/Users/josh/Code/maa/maa-prototype`. Expected: no output. Any `DIFFERS:` line means a shared file drifted; recopy it from the frontend.

Run: `npm run build && npm run lint && npm run format:check` (all exit 0).

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md README.md
git commit -m "docs: update CLAUDE.md and README for frontend sync

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Pushing `feature/frontend-sync` and opening a PR is the user's call.
