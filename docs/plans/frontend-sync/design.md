# MAA Prototype — Frontend Sync

## Overview

`maa-frontend` was built from this prototype on 2026-05-08 as a marketing-only site, then improved in three rounds: the v1 port (page folders, extracted content), v2 updates (homepage rework, global footer, accessibility, cleanups), and an October 2026 technical pass (page titles, 404, meta tags, WebP photos, Vite 8 / ESLint 10 / TypeScript 6). The prototype hasn't changed since 2026-03-28, so none of that is here yet.

This work brings all of it into the prototype, adapted to the parts the frontend doesn't have: registration, cart, admin, and a home page that changes when a season is open.

The reference designs are the frontend's own plans: `maa-frontend/docs/plans/v1-marketing-site/design.md` and `maa-frontend/docs/plans/v2-updates/design.md`.

## Why

The two repos have different futures, and that shapes how this port is done:

- **`maa-frontend` launches first** as the public static site. It needs no backend.
- **The prototype becomes the full app** at some point. It stops being a prototype and replaces the static site.

Until that happens, both are maintained. Marketing changes will land in the frontend first and then need to carry over to the prototype. **This port is the first of those syncs, not a one-off.** Future syncs should be "copy the folder, check the diff", not another port like this one.

## Goals

- The prototype's marketing pages, footer, and content match the frontend's.
- The home page shows the frontend's layout when no season is open, and the prototype's registration view when one is.
- Files the two repos share are **identical, file for file**, so later syncs are copies.
- Where the prototype has to differ, the difference is small and kept in as few files as possible.
- Registration and admin code follow the same page-folder layout as everything else, ready for the prototype to become the real app.
- Both repos run the same tool versions.

## Non-goals

- Changing registration, cart, or admin behavior. Their files move; their logic doesn't change.
- Visual changes to registration, cart, or admin pages.
- A backend, auth, or AWS hosting.
- Tests (neither repo has any).
- The "deferred polish" items listed in the frontend v2 design (FAQ keys, `Tier` `ReactNode` import, narrowed `PAGE_PATHS` keys).

## Anti-goals

These would make the work a failure even if everything renders:

- **Shared files that are "almost the same."** If a shared file differs between the repos for no reason (formatting, import order, a renamed variable), the next sync turns back into a manual port.
- **Registration breaking quietly.** The move into folders must not change what Register, Cart, or Admin do.
- **The home page looking like two designs.** The open-season and closed-season views must look like one design.

## Decisions

### Home page

Section order, top to bottom:

| Registration closed (no active season) | Registration open (active season) |
|---|---|
| Hero | Hero |
| Welcome card (frontend) | Season card with **Register Now** (prototype) |
| What We Offer (frontend) | Available Programs, grouped Coed / Boys / Girls (prototype) |
| Book a Field + Become a Sponsor cards (frontend) | same |
| Get Involved (frontend) | same |
| Footer | Footer |

- "Open" means `activeSeason` from `useAppContext()` is set, as today.
- The season card sits where the Welcome card does, overlapping the hero the same way (`-mt-34`), as the prototype does now.
- **Available Programs gets the frontend's restyle** so both views look like one design (my call, user agreed):
  - section heading as `<h2>` at `text-[30px]` with the gold accent bar, matching "What We Offer";
  - Coed / Boys / Girls labels as `<h3 className="text-xl font-bold text-center mb-3">`, matching the season labels;
  - program cards with `border-primary`, matching the What We Offer cards.
- Available Programs keeps its content: program name, "Ages X–Y", closed programs dimmed (`opacity-40`) with the Closed badge, and the "N programs for ages X–Y" subhead.

### Home page file layout (both repos)

To keep the home difference in one place, the home sections become their own files **in both repos** (my call, user agreed):

```
pages/home/
  index.tsx            — composes the sections (differs between repos)
  Hero.tsx             — shared
  Intro.tsx            — shared
  ProgramsOffered.tsx  — shared
  MoreOnTheSite.tsx    — shared
  GetInvolved.tsx      — shared
  copy.ts              — shared
  programs.ts          — shared
  OpenSeason.tsx       — prototype only: season card + Available Programs
```

- This is a small refactor in `maa-frontend` too, with no visual or behavior change there. Do it first, so the prototype copies the split files.
- `programs.ts` exports a type called `Season`, which clashes in name with the prototype's main `Season` type in `src/types/index.ts`. Rename it to `SeasonOffering` in both repos as part of the frontend refactor (my call).
- In the prototype, `index.tsx` reads `activeSeason` and renders either `<OpenSeason />` or `<Intro />` + `<ProgramsOffered />`, then `<MoreOnTheSite />` and `<GetInvolved />`.
- The old `src/pages/HomePage.tsx` is deleted.

### Shared files (identical to the frontend)

Copy these from `maa-frontend` unchanged, taken after the step 1 refactor (from its branch if it hasn't merged yet):

- `src/pages/about/` (index, `board.ts`, `copy.ts`)
- `src/pages/faq/` (index, `questions.tsx`): includes the accessibility fix (button with `aria-expanded`) and the new content (volleyball in fall, rewritten game-schedule answers, practices folded into season start)
- `src/pages/fields/`
- `src/pages/sponsors/` (index, `tiers.tsx`): includes `aria-hidden` on the checkmarks
- `src/pages/not-found/`
- `src/pages/home/` shared files listed above
- `src/components/Footer.tsx`, `src/components/ContactSection.tsx`
- `src/content.ts`
- `.github/workflows/deploy.yml`, `.nvmrc`
- `public/favicon.png`, `public/static/field-1.webp`, `public/static/fields-aerial.webp`, `public/static/sports-balls.jpg`

The footer is identical, with no Register link. Register is already in the navbar and on the home season card (my call, user agreed). The "Get Involved" copy is also identical.

Delete `src/pages/AboutPage.tsx`, `FaqPage.tsx`, `FieldsPage.tsx` and `SponsorsPage.tsx` once their folders are in.

### Where the prototype differs (and only here)

| File | Prototype difference |
|---|---|
| `src/App.tsx` | Keeps Register / Cart / Admin nav items, the cart badge, and the "Josh S." user button. Gains the frontend's scroll-to-top on route change, `inert` + `aria-hidden` on the closed mobile drawer, the `min-h-screen flex flex-col` wrapper, `<main className="flex-1">` around the `Outlet`, and `<Footer />`. |
| `src/main.tsx` | Keeps `AppProvider` and the `/register`, `/cart`, `/admin` routes. Imports pages from folders and adds the `*` → `NotFoundPage` route. |
| `src/utils.tsx` | The frontend's file plus the prototype's extras: registration icons, `PAGE_PATHS` entries for register/cart/admin, and helpers (`age`, `fmtDate`, `recommended`, `otherPrograms`, `fullName`, `calcTotal`). Gains `usePageTitle`. |
| `src/index.css` | The frontend's file plus the `.table` styles, which the Admin page uses. |
| `index.html` | Same as the frontend (favicon, title "Meadow Athletic Association", description, Open Graph tags), but the URLs point at `https://smithgotsurf.github.io/maa-prototype/`. |
| `package.json` | Same versions and `engines` as the frontend; name stays `maa-prototype`. |
| `vite.config.ts` | `base: '/maa-prototype/'`, as today. |
| `src/pages/home/index.tsx`, `OpenSeason.tsx` | See Home page above. |

Builder's call: where a file is "the frontend's plus extras", order things so a diff against the frontend shows only the extras as one block where practical.

### Registration and admin move into page folders

Since the prototype becomes the real app, these follow the same convention as the marketing pages now (my call, user agreed):

```
src/pages/register/index.tsx   — RegPage (default export)
src/pages/cart/index.tsx       — CartPage (default export)
src/pages/admin/index.tsx      — AdminPage (default export)
```

- `src/Registration.tsx` and `src/pages/AdminPage.tsx` are removed after the move.
- Logic and markup don't change.
- Each page calls `usePageTitle`: "Register", "Cart", "Admin".
- `src/data.ts`, `src/types/`, `src/context/`, `src/hooks/` and `src/waivers/` stay where they are.
- Builder's call: where `RegPage`'s helper components (`AddModal`, `ProgCard`, `SectionLabel`, `RequiredLabel`, `OptCard`, `SizeBtn`) live. Keep them inside `pages/register/` (inline or sibling files); move anything both Register and Cart use somewhere both can import.

### Sample data: volleyball moves to fall

Volleyball is a fall sport, 10U and 12U only, matching the home page and FAQ. In `src/data.ts`:

- `SPORT_TYPES`: move Volleyball 10U and 12U into the Fall group and drop Volleyball 8U.
- `SEED_SEASONS` 2025 Fall (`s2`): add Volleyball 10U and 12U (new ids continuing `pg-f…`, same shape and fee as today).
- `SEED_SEASONS` 2025-2026 Winter (`s3`): remove the three volleyball programs (`pg-w9`–`pg-w11`).
- The active 2026 Spring season is unaffected.

Seasons persist in localStorage under `maa_seasons`. Browsers that have opened the prototype before will keep showing the old seed data until that key is cleared.

### Images

- Use the WebP hero (`field-1.webp`) and aerial photo (`fields-aerial.webp`), as the frontend does.
- Keep `field-1.jpg`; the Open Graph image uses it.
- Delete `fields-aerial.jpg` (replaced by WebP), plus `dirty-base.jpg` and `home-top-background.jpg` (nothing uses them).

### Tooling

Match the frontend: Vite 8, `@vitejs/plugin-react` 6, ESLint 10 and `@eslint/js` 10, TypeScript `~6.0` (pinned because typescript-eslint doesn't support 6.1+ yet), `engines.node >=22.13`, `.nvmrc` (24), and the frontend's deploy workflow (lint before build, Node version read from `.nvmrc`).

## Constraints and risks

- **The new toolchain was checked against the prototype's current code on 2026-10-17.** A scratch copy with the frontend's `package.json` and lockfile (TypeScript 6.0.3, ESLint 10.13.0, Vite 8) passed `tsc -b`, `eslint .` and `vite build` with no code changes. In March 2026 the prototype downgraded to TypeScript 5 and ESLint 9 over package version conflicts (`9a7ca47`); the frontend's `~6.0` pin avoids that. Still do the upgrade as its own step, so anything that does come up is isolated.
- **The frontend's local `node_modules` is stale**: it still has TypeScript 5.9.3. Run `npm ci` in `maa-frontend` before verifying the frontend refactor.
- **Formatting must match.** Run Prettier (same `.prettierrc` in both repos) on everything copied or changed, so shared files stay byte-identical.

## Order

1. **Frontend refactor** (in `maa-frontend`, own branch): split the home sections into files and rename `Season` → `SeasonOffering`. No visual change. Build and lint pass.
2. **Prototype tooling upgrade** alone. Build and lint pass.
3. **Shared files, content, sample data, and images** copied in; old page files removed; `utils.tsx` and `index.css` merged.
4. **Home page, App shell, footer, 404 route, and meta tags.**
5. **Registration and admin into page folders**, with page titles.
6. **Docs**: update the prototype's `CLAUDE.md` and `README.md` to the new structure and versions.

## Verification

There are no tests. For each step:

- `npm run build`, `npm run lint`, and `npm run format:check` pass.
- Shared files match the frontend: diff the shared paths listed above between the repos; any difference must be on the "prototype differs" list.
- In the dev server:
  - the home page with a season open and with none (activate or deactivate from Admin → Seasons);
  - every marketing page, the 404 page, the footer on every page, page titles, and the mobile drawer (closed links aren't reachable with Tab);
  - Register, Cart, and Admin behave as before, including the full registration flow through to the cart.
- The Admin season editor shows volleyball under fall (after clearing `maa_seasons`).

## Left to the builder

- Commit granularity within each step.
- The exact component name and internal layout of `OpenSeason.tsx`, within the decisions above.
- Where Register's helper components live inside `pages/register/`.
- Ordering inside the "frontend plus extras" files.
- Updating the prototype's `ROADMAP.md`, if anything there is now out of date.
