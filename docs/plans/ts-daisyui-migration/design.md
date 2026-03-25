# MAA Prototype — TypeScript + DaisyUI Migration Design

## Motivation

Migrate the MAA prototype from untyped JavaScript with hand-rolled CSS to TypeScript with Tailwind CSS 4 + DaisyUI 5. This brings type safety, consistent component styling, and aligns with the pattern established in the Divvy prototype migration.

## Tech Decisions

| Area | Before | After |
|------|--------|-------|
| Language | JavaScript (`.jsx`/`.js`) | TypeScript (`.tsx`/`.ts`, strict mode) |
| Styling | Custom CSS (`app.css`, `registration.css`) | Tailwind CSS 4 + DaisyUI 5 |
| Linting | None | ESLint (flat config) + Prettier |
| Typography | Playfair Display + Source Sans 3 | Source Sans 3 only |
| State persistence | Inline `localStorage` calls | `useLocalStorage` hook |

## What Does NOT Change

- React 19, Vite 6, react-router-dom v7 (HashRouter)
- GitHub Pages deployment (`base: '/maa-prototype/'`)
- No backend, no auth, no tests — prototype-grade
- localStorage persistence for seasons
- All existing features, routes, and component structure
- No new features — pure migration

## Workstreams

Three sequential workstreams, each with a build-verification gate before proceeding:

### Workstream 1: TypeScript Migration

Rename all `.jsx`/`.js` files to `.tsx`/`.ts`. Add `tsconfig.json` with strict mode. Create centralized type definitions in `src/types/index.ts`.

#### Type System

Centralized in `src/types/index.ts`. All types derived from actual codebase usage.

```ts
// Domain
type Gender = "Male" | "Female"
type ProgramGender = "Coed" | "Male" | "Female"

type Player = {
  id: string
  firstName: string
  middleName: string
  lastName: string
  dob: string
  gender: Gender
}

type Program = {
  id: string
  name: string
  gender: ProgramGender
  min: number
  max: number
  fee: number
  closed?: boolean
  ageAsOfDate: string | null
}

type Season = {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  programs: Program[]
}

// SEASON config in data.ts has a different shape — no id/description/status,
// but includes waivers. Separate type to avoid forcing conformance.
type SeasonConfig = {
  name: string
  programs: Program[]
  waivers: Waiver[]
}

type Waiver = {
  id: string
  title: string
  required: boolean
  coachOnly?: boolean
  content: string
}

type SportType = {
  name: string
  gender: ProgramGender
  min: number
  max: number
  fee: number
}

// Registration / Cart
type ContactInfo = {
  firstName: string
  lastName: string
  phone: string
}

type CartItemGuardian = {
  primary: ContactInfo
  secondary: ContactInfo | null
  primaryContactPhone: string
}

type CartItem = {
  id: string
  player: Player
  program: Program
  hat: string
  jersey: string
  guardian: CartItemGuardian
  digitalPicture: boolean
  extraHat: { size: string } | null
  coaching: string
  coachShirtSize: string | null
  sponsorship: string
  sponsorName: string | null
  medical: { allergies: string | null; info: string | null } | null
  total: number
}

// Admin mock data (flat shape, different from CartItem)
type AdminRegistration = {
  id: string
  player: string
  gender: Gender
  dob: string
  program: string
  parent: string
  email: string
  primaryContact: string
  fee: number
  status: "Completed" | "Pending"
  date: string
  hat: string
  jersey: string
  digitalPic: boolean
  extraHat: string | null
  coaching: string
  sponsorship: string
  total: number
}

type AdminColumn = {
  id: string
  label: string
  default: boolean
}

// User
type CurrentUser = {
  firstName: string
  lastName: string
  phone: string
  secondaryGuardian: ContactInfo
}

// Context
type AppContextValue = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  players: Player[]
  addPlayer: (player: Player) => void
  seasons: Season[]
  activeSeason: Season | null
  addSeason: (season: Season) => void
  updateSeason: (id: string, updates: Partial<Season>) => void
  deleteSeason: (id: string) => void
  activateSeason: (id: string) => void
  deactivateSeason: (id: string) => void
}
```

#### Utility Typing

- `PAGE_PATHS` in `utils.tsx` — typed with `as const` for route string safety
- `B_URL` — typed as `string`
- `Ic` component — typed as `FC<{ d: string; s?: number }>`
- `icons` map — typed as `Record<string, string>`
- Helper functions (`age`, `fmtDate`, `recommended`, `otherPrograms`, `fullName`, `calcTotal`) — add parameter and return types

#### Data Constants Typing

Exported constants in `data.ts` need explicit type annotations:

- `SEASON: SeasonConfig`
- `SEED_SEASONS: Season[]`
- `INIT_PLAYERS: Player[]`
- `CURRENT_USER: CurrentUser`
- `REGS: AdminRegistration[]`
- `ADMIN_COLS: AdminColumn[]`
- `SPORT_TYPES: SportType[]`
- `HATS`, `JERSEYS`, `COACH_SHIRTS` — `as const` string tuple arrays

#### Vite Type Declarations

A `src/vite-env.d.ts` file is needed for:
- Vite client types (`/// <reference types="vite/client" />`)
- `?raw` HTML imports used by waiver files (`declare module '*.html?raw'`)

The `src/waivers/*.html` files themselves stay as-is — no TypeScript conversion needed.

#### useLocalStorage Hook

New file: `src/hooks/useLocalStorage.ts`

```ts
function useLocalStorage<T>(key: string, initialValue: T):
  [T, (val: T | ((prev: T) => T)) => void, () => void]
```

- Drop-in replacement for `useState` with localStorage sync
- Third return value is `reset` (restores to `initialValue`)
- Replaces inline localStorage logic in `AppContext.jsx`

### Workstream 2: ESLint + Prettier

Installed after TypeScript so linter can enforce TS rules. Run before DaisyUI migration so the large CSS change lands on a consistently formatted codebase.

- **ESLint**: flat config (`eslint.config.js`), `@typescript-eslint`, `eslint-plugin-react-hooks`
- **Prettier**: minimal config — `printWidth: 100`, `singleQuote: true`
- Format entire codebase once, single commit

### Workstream 3: Tailwind CSS 4 + DaisyUI 5

Largest workstream. Install Tailwind CSS 4 and DaisyUI 5, configure custom theme, migrate components one at a time.

#### Theme Configuration

| DaisyUI Role | MAA Color | Value |
|---|---|---|
| `primary` | Vegas Gold | `#C5A04E` <span style="background:#C5A04E;padding:0 12px;border-radius:2px">&nbsp;</span> |
| `primary-content` | Black (text on gold) | `#1A1A1A` <span style="background:#1A1A1A;padding:0 12px;border-radius:2px">&nbsp;</span> |
| `neutral` | Near-black | `#1A1A1A` <span style="background:#1A1A1A;padding:0 12px;border-radius:2px">&nbsp;</span> |
| `neutral-content` | White | `#FFFFFF` <span style="background:#FFFFFF;border:1px solid #ccc;padding:0 12px;border-radius:2px">&nbsp;</span> |
| `base-100` | Off-white | `#FAFAF8` <span style="background:#FAFAF8;border:1px solid #ccc;padding:0 12px;border-radius:2px">&nbsp;</span> |
| `base-200` | Background | `#F5F4F0` <span style="background:#F5F4F0;border:1px solid #ccc;padding:0 12px;border-radius:2px">&nbsp;</span> |
| `base-300` | Border | `#E0E0E0` <span style="background:#E0E0E0;padding:0 12px;border-radius:2px">&nbsp;</span> |
| `error` | Red | `#C23B22` <span style="background:#C23B22;padding:0 12px;border-radius:2px">&nbsp;</span> |
| `success` | Green | `#2E7D4F` <span style="background:#2E7D4F;padding:0 12px;border-radius:2px">&nbsp;</span> |

Single font: Source Sans 3 for all text. Weight range 300–700 for heading/body differentiation.

#### Component Mapping

**Layout & Navigation**

| Current CSS | DaisyUI Replacement |
|---|---|
| `.H` (header) | `navbar` with `bg-neutral text-neutral-content` |
| `.H-mob` (mobile menu) | `drawer` |
| `.pg` / `.pgn` (page containers) | `max-w-4xl mx-auto` / `max-w-2xl mx-auto` |
| `.cp` (content page) | Tailwind prose/spacing utilities |

**Buttons**

| Current CSS | DaisyUI Replacement |
|---|---|
| `.b.bp` (primary button) | `btn btn-neutral` |
| `.b.bg` (gold CTA button) | `btn btn-primary` |
| `.b.bs` (secondary button) | `btn btn-outline` |
| `.b.bd` (delete button) | `btn btn-error btn-ghost` |
| `.b.bgh` (ghost button) | `btn btn-ghost` |
| `.b.bsm` (small modifier) | `btn-sm` |

**Cards & Containers**

| Current CSS | DaisyUI Replacement |
|---|---|
| `.cd` (card) | `card` |
| `.pcard` / `.pcol` (program cards) | `card` with grid layout |
| `.spc` (sponsor tier card) | `card` |
| `.opt` (radio selector) | `card` with `border-primary` active state |
| `.stt` (stat tiles) | `stat` |

**Data Display**

| Current CSS | DaisyUI Replacement |
|---|---|
| `.dt` (data table) | `table` |
| `.bdg` (badge) | `badge` |
| `.bdg-in` (inactive badge) | `badge badge-ghost` |
| Admin tabs | `tabs tabs-bordered` |

**Forms & Inputs**

| Current CSS | DaisyUI Replacement |
|---|---|
| `.fr input` / `.fr select` | `input input-bordered` / `select select-bordered` |
| `.szg` / `.sz` (size selectors) | `btn-group` or `join` with `btn` toggles |
| `.wv` (waiver accordion) | `collapse` or custom with Tailwind |
| `.wck` (waiver checkbox) | `checkbox` |
| `.flt` / `.fsl` / `.fin` (filter bar) | `join` with `input` / `select` |

**Overlays & Feedback**

| Current CSS | DaisyUI Replacement |
|---|---|
| `.mo` / `.md` (modal) | `modal` |
| `.sb` (status bar / floating card) | `card` with absolute positioning (not `alert` — it overlaps the hero) |
| `.stv` (step indicator) | `steps` |
| `.col-picker` (column dropdown) | `dropdown` with `menu` |

**Registration & Cart**

| Current CSS | DaisyUI Replacement |
|---|---|
| `.reg-wrap` (2-col reg layout) | Tailwind `grid grid-cols-[180px_1fr]` |
| `.ci` (cart item) | `card` |
| `.ct` (cart total) | Tailwind utilities |
| `.cfm` (confirmation) | `card` with `text-center` |
| `.rt` (review table) | `table table-sm` |

**Admin-Specific**

| Current CSS | DaisyUI Replacement |
|---|---|
| `.adm` / `.asd` / `.am` (admin layout) | Tailwind grid/flex |
| `.sts` (stat tiles grid) | `stats` or grid of `stat` |
| `.sn-active` / `.sn-none` (season cards) | `card` with conditional `border-primary` |

#### Inline Styles Strategy

The codebase uses extensive inline `style={{}}` attributes for dynamic and one-off styling. During migration:
- **Dynamic values** (opacity, conditional colors) → Tailwind conditional classes where possible, or keep inline for truly dynamic values
- **One-off positioning/sizing** → Tailwind utility classes
- **`var(--font-display)` references** → remove (single font now)
- **`var(--gold)` etc.** → replaced by DaisyUI theme tokens or Tailwind classes

#### Migration Order

Components migrated one at a time, visually verified after each:

1. Layout shell (`App.tsx` — navbar, drawer, footer)
2. HomePage (hero, program cards, stat tiles)
3. Small pages (About, FAQ, Fields, Sponsors)
4. Registration (multi-step form, option selectors, modals)
5. Cart
6. AdminPage (tabs, tables, season management)
7. Delete `app.css` and `registration.css`

Both CSS files remain until step 7 — no premature deletion.

## Deferred Decisions

- **Immer** — not needed now; addable later if state complexity grows
- **Backend API** — types are structured to represent future API response shapes
- **New features** — none; this is a pure migration
- **Test setup** — still prototype-grade
- **Component library extraction** — no shared wrappers beyond what DaisyUI provides naturally
