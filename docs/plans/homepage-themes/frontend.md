# Homepage Themes — maa-frontend Implementation Plan

> Design: [design.md](./design.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the homepage a curved hero in three visitor-selectable themes, give subpages a matching header band, and add paper grain to the page margins.

**Architecture:** New shared components in `src/components/`: a theme store (`theme.ts`, `useSyncExternalStore` over `localStorage`), the curved container (`CurvedBand`), its art layer (`HeroArt`), the subpage band (`PageBand`), the content column (`PageColumn`) and the footer switch (`ThemeSwitch`). The homepage `Hero` and each subpage use them. Everything except `index.css`, `App.tsx` and `pages/home/index.tsx` is on the shared list, so [prototype.md](./prototype.md) copies it unchanged.

**Tech Stack:** React 19, TypeScript ~6.0 (strict), Vite 8, react-router-dom 7 (HashRouter), Tailwind 4 + DaisyUI 5.

**Spec:** [design.md](./design.md). Visual reference: [mockup.html](./mockup.html) (open in a browser; A/B/C = Home Plate/Four Fields/Gold Lines; the Page buttons show subpages).

**Verification model:** No tests (design non-goal). Every task ends with `npm run build && npm run lint && npm run format:check` (all exit 0) plus the browser checks listed in the task. Dev server: the `maa-frontend` entry in `/Users/josh/Code/maa/.claude/launch.json` (port 5180), or `npm run dev` and the URL Vite prints (`…/maa-frontend/`).

**Code Review Checkpoints:**
- **Checkpoint 1:** After Tasks 1–2 (themed curved hero, margins and content column)
- **Checkpoint 2:** After Tasks 3–4 (subpage bands, footer switch, docs)
- **Final Review:** After [prototype.md](./prototype.md) Tasks 1–2

## Global Constraints

- Repo `/Users/josh/Code/maa/maa-frontend`, branch `feature/homepage-themes` off an up-to-date `main`.
- Files under `src/components/`, `src/pages/{about,faq,fields,sponsors,not-found}/`, `src/pages/home/` (except `index.tsx`) and `public/` are copied byte-for-byte into maa-prototype later. Don't put anything frontend-specific in them.
- Styling is Tailwind utilities. Inline `style` is allowed only for art backgrounds, clip paths and image positions (the current `Hero.tsx` already does this). No new CSS files; the only `index.css` change is the `body` background.
- Brand tokens: `primary` `#C5A04E`, `secondary` `#A68636`, `neutral` `#1A1A1A`, `base-200` `#F5F4F0`.
- Theme ids `home-plate`, `four-fields`, `gold-lines`; labels Home Plate, Four Fields, Gold Lines; `localStorage` key `maa_theme`; default `four-fields`.
- Image URLs are built with `B_URL` from `src/utils.tsx` (`B_URL + 'static/<file>'`), as the existing pages do.
- Prettier: `printWidth 100`, `singleQuote`. Run `npm run format` after editing.
- Every value in the design's "Visual spec" table is exact. Copy it; don't approximate.

## Review Focus

1. **A missing, stale or unreadable saved theme** (`maa_theme` = `"garbage"`, a theme removed later, storage that throws in private browsing) renders the default theme with no console error, and the switch still works for the visit. Check: Task 1 Step 8; reviewer confirms both storage calls in `theme.ts` are in `try/catch`.
2. **Short pages** (404 at `#/does-not-exist`) show the tan column all the way down to the footer, with no strip of grain across the full width above it. Check: Task 2 Step 7.
3. **Narrow phones (320px and 375px)** have no horizontal scroll from the Four Fields strip, which extends 60px past each edge, and the long About title wraps inside its band. Check: Task 1 Step 8 and Task 3 Step 4.
4. **Stacking:** the Welcome card stays on top of the hero, and the column's 48px tuck stays hidden behind the hero and bands except where the curve lifts. Check: Task 2 Step 7.
5. **Keyboard use of the switch:** Tab reaches each theme button with a visible focus ring, Enter/Space selects it, and `aria-pressed` follows the selection. Check: Task 4 Step 5.

---

## Tasks

| # | Task | Description | Model |
|---|------|-------------|-------|
| 1 | [Themed curved hero](#task-1) | Branch, SVG assets, theme store, `CurvedBand` + `HeroArt`, homepage `Hero` | sonnet |
| 2 | [Paper grain and content column](#task-2) | `body` grain, `PageColumn`, `main` flex column, footer margin, all pages wrapped | sonnet |
| 3 | [Subpage header bands](#task-3) | `PageBand`; five subpages move their title into it | sonnet |
| 4 | [Footer theme switch and docs](#task-4) | `ThemeSwitch` in the homepage footer; `CLAUDE.md` | sonnet |

---

<a id="task-1"></a>
### Task 1: Themed curved hero

**Files:**
- Create: `public/static/fields-soccer.svg`, `fields-basketball.svg`, `fields-baseball.svg`, `fields-volleyball.svg`, `ball-pattern.svg`, `grain-dark.svg` (copies of [`assets/`](./assets))
- Create: `src/components/theme.ts`, `src/components/CurvedBand.tsx`, `src/components/HeroArt.tsx`
- Modify: `src/pages/home/Hero.tsx`, `src/pages/home/copy.ts`

**Interfaces:**
- Produces (`src/components/theme.ts`):
  - `type HeroArtId = 'photo' | 'fields' | 'lines'`
  - `type ThemeId = 'home-plate' | 'four-fields' | 'gold-lines'`
  - `type Theme = { id: ThemeId; label: string; art: HeroArtId }`
  - `const THEMES: Theme[]`, in this order: `{ id: 'home-plate', label: 'Home Plate', art: 'photo' }`, `{ id: 'four-fields', label: 'Four Fields', art: 'fields' }`, `{ id: 'gold-lines', label: 'Gold Lines', art: 'lines' }`
  - `const DEFAULT_THEME: ThemeId = 'four-fields'`
  - `function useTheme(): Theme` (the current theme's object from `THEMES`)
  - `function setTheme(id: ThemeId): void`
- Produces: `CurvedBand({ art, className, children }: { art: HeroArtId; className: string; children: ReactNode })`, default export of `src/components/CurvedBand.tsx`. `className` carries the padding.
- Produces: `HeroArt({ art }: { art: HeroArtId })`, default export of `src/components/HeroArt.tsx`.

- [ ] **Step 1: Branch and install**

```bash
cd /Users/josh/Code/maa/maa-frontend
git switch main && git pull --ff-only
git switch -c feature/homepage-themes
npm ci
```

- [ ] **Step 2: Copy the artwork**

```bash
cp /Users/josh/Code/maa/maa-prototype/docs/plans/homepage-themes/assets/*.svg public/static/
```

Expected: `ls public/static/*.svg` lists the six files.

- [ ] **Step 3: Write `src/components/theme.ts`**

Exports exactly the Interfaces above. A module-level `current: ThemeId` is read once at import from `localStorage.getItem('maa_theme')`: use the value only if it's one of the `THEMES` ids, otherwise `DEFAULT_THEME`, and fall back to `DEFAULT_THEME` if the read throws. `setTheme` sets `current`, writes `localStorage.setItem('maa_theme', id)` inside `try/catch` (ignore failures), and calls every subscriber. `useTheme` is `useSyncExternalStore(subscribe, getSnapshot)`, where the snapshot is the `THEMES` element for `current` (a stable object, so no re-render loop).

- [ ] **Step 4: Write `src/components/CurvedBand.tsx`**

Root: `<div className={`relative z-[1] overflow-hidden bg-primary text-center text-white ${className}`} style={{ clipPath: 'ellipse(125% 100% at 50% 0)' }}>`, then `<HeroArt art={art} />`, then `<div className="relative z-[2]">{children}</div>`. The gold `bg-primary` is what shows as the rim.

- [ ] **Step 5: Write `src/components/HeroArt.tsx`**

Every art renders one root `<div aria-hidden="true" className="absolute inset-0 …">` with `style.clipPath = 'ellipse(125% calc(100% - 5px) at 50% 0)'`, plus:

| `art` | Root | Children |
|---|---|---|
| `photo` | classes `bg-cover bg-center`; `backgroundImage` = `linear-gradient(rgba(0,0,0,.65),rgba(0,0,0,.78)),url('${B_URL}static/field-1.webp')` | none |
| `lines` | `backgroundImage` = `radial-gradient(ellipse 46% 60% at 50% 26%, rgba(197,160,78,.2), rgba(197,160,78,0) 72%), url('${B_URL}static/ball-pattern.svg'), linear-gradient(180deg, #282521 0%, #151514 100%)`; `backgroundSize` = `auto, 180px 180px, auto` | none |
| `fields` | class `bg-neutral` | strip, overlay, seams (below) |

`fields` children, in this order:
1. **Strip:** `<div className="absolute inset-y-0 -left-15 -right-15 flex -skew-x-10">` holding four `<div className="relative flex-1 overflow-hidden">` panels. Each panel holds `<img src={B_URL + 'static/' + file} alt="" className="absolute top-0 h-full max-w-none skew-x-10 object-cover saturate-[.78]" style={{ objectPosition, left: 'calc(-1 * max(12%, 48px))', width: 'calc(100% + 2 * max(12%, 48px))' }} />`. The 48px floor matters on phones, where the hero is tall and the panels narrow. Panels in order: `fields-soccer.svg` at `50% 100%`, `fields-basketball.svg` at `50% 0`, `fields-baseball.svg` at `center`, `fields-volleyball.svg` at `center`.
2. **Overlay:** `<div className="absolute inset-0 max-md:bg-[rgba(12,11,9,.2)]">` with `backgroundImage` = `url('${B_URL}static/grain-dark.svg'), radial-gradient(ellipse 44% 56% at 50% 30%, rgba(12,11,9,.6), rgba(12,11,9,0) 78%), linear-gradient(180deg, rgba(12,11,9,.56) 0%, rgba(12,11,9,.42) 50%, rgba(12,11,9,.74) 100%)`. Set `backgroundImage`, not the `background` shorthand, so the phone `background-color` class still applies.
3. **Seams:** a second strip with the same classes as the first, holding four empty `flex-1` divs. Divs 2–4 also get `border-l-[3px] border-primary/80 max-md:border-l-2 max-md:border-primary/40`.

- [ ] **Step 6: Use them in `src/pages/home/Hero.tsx` and trim `copy.ts`**

`Hero()` calls `useTheme()` and returns `<CurvedBand art={theme.art} className="px-7 pt-16 pb-45">` around the existing `h1` (unchanged) and `p`. On the `p`, replace `opacity-55` with `opacity-85 [text-shadow:0_1px_2px_rgba(0,0,0,.75),0_0_14px_rgba(0,0,0,.6)]`. The old outer `div`, its inline `style` and the `hero.backgroundImage` reference go. In `copy.ts`, delete `backgroundImage` from `hero`, and delete the `B_URL` import if nothing else uses it.

- [ ] **Step 7: Build, lint, format**

Run: `npm run format && npm run build && npm run lint && npm run format:check`
Expected: all exit 0.

- [ ] **Step 8: Check in the browser**

In the dev server homepage, in the DevTools console, run each line and reload after each:
- `localStorage.removeItem('maa_theme')`: Four Fields, panels in order soccer, basketball (hoop at top), baseball, volleyball; matches mockup.html preset B.
- `localStorage.setItem('maa_theme','home-plate')`: today's photo with the curved gold edge; matches preset A.
- `localStorage.setItem('maa_theme','gold-lines')`: gold ball pattern on charcoal; matches preset C.
- `localStorage.setItem('maa_theme','garbage')`: Four Fields, no console errors.

On every theme: the subhead reads clearly, the Welcome card still overlaps the hero, and the gold rim follows the curve. At 375px and 320px wide (DevTools device mode), there's no horizontal scroll and the seams are thinner.

- [ ] **Step 9: Commit**

```bash
git add public/static/*.svg src/components/theme.ts src/components/CurvedBand.tsx src/components/HeroArt.tsx src/pages/home/Hero.tsx src/pages/home/copy.ts
git commit -m "feat: curved homepage hero with three themes"
```

---

<a id="task-2"></a>
### Task 2: Paper grain and content column

**Files:**
- Create: `src/components/PageColumn.tsx`
- Modify: `src/index.css`, `src/App.tsx`, `src/components/Footer.tsx`, `src/pages/home/index.tsx`, `src/pages/{about,faq,fields,sponsors,not-found}/index.tsx`

**Interfaces:**
- Produces: `PageColumn({ className = 'pt-8 pb-20', children }: { className?: string; children: ReactNode })`, default export of `src/components/PageColumn.tsx`. `className` holds only top/bottom padding, and replaces the default.

- [ ] **Step 1: Add the grain to `body` in `src/index.css`**

Change `background: var(--color-base-200);` in the `body` rule to:

```css
  background: var(--color-base-200)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .32 0 0 0 0 .25 0 0 0 0 .12 0 0 0 .6 -.22'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
```

- [ ] **Step 2: Write `src/components/PageColumn.tsx`**

One `<div>` with these classes, then `className`:
`relative mx-auto w-full max-w-4xl flex-1 px-4 bg-base-200 [box-shadow:-1px_0_0_rgba(166,134,54,.25),1px_0_0_rgba(166,134,54,.25)] before:absolute before:inset-x-0 before:bottom-full before:h-12 before:bg-inherit before:[box-shadow:inherit]`.

`w-full` is required: in the flex-column `main` (Step 3), `mx-auto` alone would shrink the column to its content width. The `before:` layer is the 48px tuck under the hero/band.

- [ ] **Step 3: Make `main` a flex column in `src/App.tsx`**

`<main className="flex-1">` becomes `<main className="flex flex-1 flex-col">`, so `PageColumn` (`flex-1`) can reach the footer on short pages.

- [ ] **Step 4: Drop the footer's top margin**

In `src/components/Footer.tsx`, remove `mt-12` from the `<footer>` classes. That space is now in `PageColumn`'s bottom padding.

- [ ] **Step 5: Wrap every page in `PageColumn`**

- `src/pages/home/index.tsx`: return a fragment, `<><Hero /><PageColumn className="pt-6 pb-18">…the four sections…</PageColumn></>`, in place of the outer `<div>` and the `max-w-4xl mx-auto px-4 py-6` div.
- `about`, `faq`, `fields`, `sponsors`, `not-found`: replace each page's outer `<div className="max-w-4xl mx-auto px-4 py-8">` with `<PageColumn>`. Leave each page's `h1` and gold rule in place for now; Task 3 moves them.

- [ ] **Step 6: Build, lint, format**

Run: `npm run format && npm run build && npm run lint && npm run format:check`
Expected: all exit 0.

- [ ] **Step 7: Check in the browser**

- At 1280px and 1600px wide, the grain shows only in the margins. The column is plain tan with a thin gold line down each side.
- Where the hero's curve lifts above the column's edges, the column (and its gold lines) meets the curve with no wedge of grain. Compare with mockup.html at the same spot.
- The Welcome card still overlaps the hero.
- `#/does-not-exist` (a short page): the column reaches the footer, with no band of grain above the footer.
- At 375px: no grain visible, no horizontal scroll, and the spacing above the footer is unchanged from `main`.

- [ ] **Step 8: Commit**

```bash
git add src/index.css src/App.tsx src/components/PageColumn.tsx src/components/Footer.tsx src/pages
git commit -m "feat: paper grain margins and a tan content column"
```

---

<a id="task-3"></a>
### Task 3: Subpage header bands

**Files:**
- Create: `src/components/PageBand.tsx`
- Modify: `src/pages/{about,faq,fields,sponsors,not-found}/index.tsx`

**Interfaces:**
- Consumes: `CurvedBand` and `HeroArtId` (Task 1), `PageColumn` (Task 2).
- Produces: `PageBand({ title, art = 'lines' }: { title: string; art?: HeroArtId })`, default export of `src/components/PageBand.tsx`.

- [ ] **Step 1: Write `src/components/PageBand.tsx`**

`<CurvedBand art={art} className="px-4 pt-[22px] pb-[34px] md:px-7 md:pt-9 md:pb-13">` holding:
- `<h1 className="text-2xl md:text-[34px] font-bold leading-tight text-balance [text-shadow:0_1px_2px_rgba(0,0,0,.6)]">{title}</h1>`
- `<div className="w-11 h-[3px] bg-primary rounded-sm mx-auto mt-2 md:mt-2.5" />`

- [ ] **Step 2: Move each subpage's title into a band**

In each page, delete the `h1` and the gold-rule `div` under it, and return a fragment: `<><PageBand … /><PageColumn>…rest unchanged…</PageColumn></>`.

| Page | `PageBand` |
|---|---|
| `about` | `title="About the Meadow Athletic Association"` |
| `faq` | `title="Frequently Asked Questions"` |
| `fields` | `title="Field Rentals" art="photo"` |
| `sponsors` | `title="Become a Sponsor"` |
| `not-found` | `title="Page Not Found"` |

- [ ] **Step 3: Build, lint, format**

Run: `npm run format && npm run build && npm run lint && npm run format:check`
Expected: all exit 0.

- [ ] **Step 4: Check in the browser**

- Field Rentals shows the photo band; About, FAQ, Sponsorship and the 404 page show the line-art band. Compare with mockup.html's Field Rentals and FAQ pages. Bands don't change with `maa_theme`.
- Each page has exactly one `h1`, and the page tab title is unchanged.
- At 375px, the band is visibly shorter with a 24px title, and "About the Meadow Athletic Association" wraps onto balanced lines inside the band. Also check 320px.
- The column meets each band's curve cleanly.

- [ ] **Step 5: Commit**

```bash
git add src/components/PageBand.tsx src/pages
git commit -m "feat: curved header band on subpages"
```

---

<a id="task-4"></a>
### Task 4: Footer theme switch and docs

**Files:**
- Create: `src/components/ThemeSwitch.tsx`
- Modify: `src/components/Footer.tsx`, `CLAUDE.md`

**Interfaces:**
- Consumes: `THEMES`, `useTheme`, `setTheme`, `HeroArtId` (Task 1).
- Produces: `ThemeSwitch()`, default export of `src/components/ThemeSwitch.tsx`, no props.

- [ ] **Step 1: Write `src/components/ThemeSwitch.tsx`**

`<div role="group" aria-label="Homepage theme" className="flex flex-wrap items-center gap-1.5">` with a `<span>Theme</span>`, then one button per `THEMES` entry:

`<button type="button" aria-pressed={t.id === theme.id} onClick={() => setTheme(t.id)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/12 bg-white/5 py-[3px] pl-1 pr-2.5 text-xs text-neutral-content/70 hover:border-primary/50 hover:text-neutral-content aria-pressed:border-primary aria-pressed:bg-primary/12 aria-pressed:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">`

Each button holds a swatch, `<span aria-hidden="true" className="block h-3.5 w-[22px] rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,.15)]" style={{ background: SWATCH[t.art] }} />`, then `{t.label}`. `SWATCH: Record<HeroArtId, string>` is a module constant holding the three swatch backgrounds from the design's Visual spec, with `static/field-1.webp` written as `${B_URL}static/field-1.webp`.

- [ ] **Step 2: Put it in the homepage footer**

In `Footer.tsx`, the bottom-bar div `max-w-4xl mx-auto px-6 py-3 text-xs text-neutral-content/50` also gets `flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5`. The copyright text goes in a `<span>`, followed by `{isHome && <ThemeSwitch />}`, where `const isHome = useLocation().pathname === PAGE_PATHS.home` (`useLocation` from `react-router-dom`).

- [ ] **Step 3: Update `CLAUDE.md`**

- **Project structure:** list the six new `components/` files, one line each, using the descriptions in the design's File layout table.
- **Styling:**
  - `body` has a paper-grain background.
  - Every page wraps its content in `PageColumn` (homepage: `className="pt-6 pb-18"`).
  - Every subpage starts with `PageBand title=…`. Only Field Rentals uses `art="photo"`; the rest use the default line art.
- **New "Themes" section:**
  - Homepage themes live in `THEMES` in `src/components/theme.ts`; the default is `DEFAULT_THEME`.
  - The visitor's pick is stored in `localStorage` under `maa_theme`, and the footer switch shows on the homepage only.
  - Adding a theme means one `THEMES` entry, one `HeroArtId` with its art in `HeroArt.tsx`, and one swatch in `ThemeSwitch.tsx`.

- [ ] **Step 4: Build, lint, format**

Run: `npm run format && npm run build && npm run lint && npm run format:check`
Expected: all exit 0.

- [ ] **Step 5: Check in the browser**

- The homepage footer shows "Theme" and three pills to the right of the copyright; About, FAQ, Field Rentals, Sponsorship and the 404 page don't.
- Clicking a pill switches the hero at once and turns that pill gold. Reload keeps the choice.
- Keyboard: Tab reaches each pill with a visible gold focus ring, and Enter and Space both select. In DevTools' Elements panel, `aria-pressed="true"` is on the selected pill only.
- At 375px the pills wrap under the copyright without overflowing.
- Compare the switch with mockup.html's footer (any of A/B/C).

- [ ] **Step 6: Commit**

```bash
git add src/components/ThemeSwitch.tsx src/components/Footer.tsx CLAUDE.md
git commit -m "feat: homepage theme switch in the footer"
```

Push and open the PR only when asked.
