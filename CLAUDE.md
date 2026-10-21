# MAA Prototype

Meadow Athletic Association — registration and info website prototype. React SPA deployed to GitHub Pages. This is the future full app; `maa-frontend` is the marketing-only site that launches first (see "Shared with maa-frontend").

## Dev commands

- `npm run dev` — start Vite dev server (port 5174)
- `npm run build` — TypeScript check + production build
- `npm run lint` — ESLint
- `npm run format` — Prettier (write)
- `npm run format:check` — Prettier (check only)

## Tech stack

- React 19, Vite 8, react-router-dom v7 (HashRouter)
- TypeScript 6 (strict mode) — pinned to 6.0.x (`~`) because typescript-eslint doesn't support 6.1+ or 7 yet
- Tailwind CSS 4 + DaisyUI 5 (custom "maa" theme)
- ESLint 10 (flat config) + Prettier
- No tests — prototype-grade code
- Node version pinned in `.nvmrc` (CI reads it too); `engines` in package.json sets the minimum
- Deployed to GitHub Pages via `.github/workflows/deploy.yml` (lint, then build); HashRouter + `base: '/maa-prototype/'` in vite.config.ts

## Project structure

```
src/
  main.tsx          — HashRouter, route definitions, AppProvider wrapper
  App.tsx           — layout shell (navbar, mobile drawer, Outlet, Footer)
  content.ts        — shared site content/copy
  data.ts           — SEASON config, programs, mock registrations, waivers
  utils.tsx         — shared utilities (Ic icon helper, icons map, B_URL, PAGE_PATHS, usePageTitle, registration helpers)
  index.css         — Tailwind + DaisyUI theme configuration
  types/
    index.ts        — centralized TypeScript type definitions
  hooks/
    useLocalStorage.ts — generic localStorage persistence hook
  context/
    AppContext.tsx   — cart + players + seasons state (consumed via useAppContext())
  components/
    Footer.tsx
    ContactSection.tsx
    theme.ts        — homepage theme ids, theme list, default, stored-theme hook (useTheme/setTheme)
    HeroArt.tsx     — the art layer for 'photo', 'fields' or 'lines'
    CurvedBand.tsx  — the curved, gold-rimmed container used by the hero and the page bands
    PageBand.tsx    — subpage header band (page title on a CurvedBand)
    PageColumn.tsx  — the tan content column every page except Admin wraps its content in
    ThemeSwitch.tsx — the homepage footer's theme buttons
  pages/
    home/      — index.tsx (composition) + one file per section + OpenSeason.tsx + copy.ts + programs.ts
    about/     — index.tsx + copy.ts + board.ts
    faq/       — index.tsx + questions.tsx
    fields/    — index.tsx
    sponsors/  — index.tsx + tiers.tsx
    not-found/ — index.tsx (catch-all route)
    register/  — index.tsx (RegPage and its step components)
    cart/      — index.tsx
    admin/     — index.tsx
  waivers/          — HTML waiver content (imported via ?raw)
public/static/       — images (photos as WebP; field-1.jpg kept for og:image), logo, sponsorship PDF, hero art SVGs
```

Each page is a folder with `index.tsx` (default-exported component) plus sibling files for copy/data. Keep page-specific content in those siblings; only put genuinely shared content in `src/content.ts`.

The home page shows `OpenSeason` (season card + that season's programs) when `activeSeason` is set, otherwise `Intro` + `ProgramsOffered`; `MoreOnTheSite` and `GetInvolved` follow either way.

## Routing

Routes defined in `main.tsx` inside a HashRouter. `App.tsx` renders the layout with `<Outlet />` for page content. All routes are children of the App layout route.

| Route | Component |
|-------|-----------|
| `/` | HomePage |
| `/about` | AboutPage |
| `/faq` | FaqPage |
| `/field-rentals` | FieldsPage |
| `/sponsorship` | SponsorsPage |
| `/register` | RegPage |
| `/cart` | CartPage |
| `/admin` | AdminPage |
| `*` | NotFoundPage |

Nav uses `NavLink` with `isActive` for highlighting. Logo links to `/`; no "Home" nav item. Path constants are in `utils.tsx` as `PAGE_PATHS`. Each page calls `usePageTitle()` to set the browser tab title; `App.tsx` scrolls to top on route change.

## Shared state

`AppContext` provides cart, players, and seasons state. Wrap with `<AppProvider>` (done in main.tsx). Consume via `useAppContext()`:

```ts
const { cart, addToCart, removeFromCart, clearCart, players, addPlayer, seasons, activeSeason } = useAppContext();
```

Seasons are persisted to localStorage (`maa_seasons`) via the `useLocalStorage` hook. After changing `SEED_SEASONS` in `data.ts`, run `localStorage.removeItem('maa_seasons')` in the browser console and reload to see the new seed.

## Type system

All types centralized in `src/types/index.ts`. Key types: `Player`, `Program`, `Season`, `SeasonConfig`, `CartItem`, `AppContextValue`, `AdminRegistration`.

## Coding conventions

- TypeScript strict mode — all components and functions typed
- DaisyUI component classes for UI elements (btn, card, modal, table, badge, etc.)
- Tailwind utility classes for layout and spacing
- Shared icons/helpers live in `utils.tsx`; shared layout in `components/`
- Page components are default exports from `pages/<name>/index.tsx`

## Shared with maa-frontend

`../maa-frontend` is the marketing-only site. These paths are byte-identical in both repos. Change them in `maa-frontend` first, then copy them here:

- `src/content.ts`, `src/components/`
- `src/pages/about/`, `faq/`, `fields/`, `sponsors/`, `not-found/`
- `src/pages/home/` except `index.tsx` and `OpenSeason.tsx` (prototype only)
- `.github/workflows/deploy.yml`, `.nvmrc`, `.prettierrc`, `tsconfig.json`, `tsconfig.app.json`, `eslint.config.js`
- `public/` (everything)

Files that differ on purpose: `App.tsx` and `main.tsx` (registration nav and routes), `utils.tsx` and `index.css` (the frontend's file plus prototype-only blocks), `index.html` (prototype URLs), `package.json` and `package-lock.json` (name), `vite.config.ts` (base). For `App.tsx`, `main.tsx`, `utils.tsx` and `index.css`, `diff ../maa-frontend/<file> <file>` should show only prototype additions.

Check the shared paths from the repo root, with `../maa-frontend` on an up-to-date `main` (prints nothing when they match):

```bash
for p in src/content.ts src/components src/pages/about src/pages/faq src/pages/fields src/pages/sponsors src/pages/not-found public .github/workflows/deploy.yml .nvmrc .prettierrc tsconfig.json tsconfig.app.json eslint.config.js; do diff -rq -x .DS_Store "../maa-frontend/$p" "$p" >/dev/null 2>&1 || printf 'DIFFERS: %s\n' "$p"; done; diff -rq -x .DS_Store -x index.tsx -x OpenSeason.tsx ../maa-frontend/src/pages/home src/pages/home >/dev/null 2>&1 || printf 'DIFFERS: src/pages/home\n'
```

## Themes

- The homepage hero has visitor-selectable themes: `THEMES` in `src/components/theme.ts` (Home Plate, Four Fields, Gold Lines). The default is `DEFAULT_THEME` (`four-fields`)
- The visitor's pick is stored in `localStorage` under `maa_theme`; an unknown or unreadable value falls back to the default. The footer switch shows on the homepage only
- Subpage bands don't follow the theme; each page picks its band art
- Adding a theme: one `THEMES` entry (its id becomes a `ThemeId` automatically). If it needs new art, add the art id to `HeroArtId`; TypeScript then flags the two places that need it, a `case` in `HeroArt.tsx` and a swatch in `ThemeSwitch.tsx`
- Design and plans: `docs/plans/homepage-themes/`

## Styling

- DaisyUI custom theme "maa" defined in `src/index.css`
- Brand colors: primary (Vegas Gold `#C5A04E`), secondary (dark gold `#A68636`), neutral (black `#1A1A1A`)
- `text-primary` for brand gold; `text-secondary` for darker gold (prices, links)
- Fonts: Playfair Display (headings via `font-serif`) + Source Sans 3 (body via `font-sans`). Both loaded from Google Fonts in `index.html` — ensure needed weights are included when using new weights
- Body background overridden to `base-200` (`#F5F4F0`) with a fine paper grain in `index.css`; use `bg-white` for cards/containers that need to stand out from the page
- Every page except Admin wraps its content in `PageColumn` (plain tan over the grain, a thin gold edge, runs down to the footer); the homepage and the Register step flow pass `className="pt-6 pb-18"`
- Every marketing subpage starts with `<PageBand title="…" />`, which renders the page's `h1`. Only Field Rentals uses `art="photo"`; the rest use the default line art. Register and Cart have no band
- Admin keeps its full-width sidebar layout instead of `PageColumn`: its root has `bg-base-200` so the grain doesn't show behind it, and its content cell has `pb-18` for the space above the footer
- Antialiased font smoothing set on body in `index.css`
- No custom CSS files — all styling via Tailwind utilities + DaisyUI components (the only custom rules are the theme and the admin `.table` styles in `index.css`)
- DaisyUI `btn` class overrides font-size/weight/color — when matching specific designs, set these explicitly on btn elements
- Reference design (pre-migration): https://smithgotsurf.github.io/maa-prototype/
