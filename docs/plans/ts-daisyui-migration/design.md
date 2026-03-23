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

```ts
// Domain
type Player = {
  id: string
  firstName: string
  middleName: string
  lastName: string
  dob: string
  gender: "M" | "F"
}

type Program = {
  id: string
  name: string
  gender: "Coed" | "Boys" | "Girls"
  minAge: number
  maxAge: number
  fee: number
  closed?: boolean
  ageAsOfDate?: string
}

type Season = {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  programs: Program[]
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
  gender: string
  min: number
  max: number
  fee: number
}

// Registration / Cart
type Guardian = {
  firstName: string
  lastName: string
  phone: string
}

type MedicalInfo = {
  allergies: string
  conditions: string
  medications: string
}

type CartItem = {
  id: string
  player: Player
  program: Program
  guardian: Guardian
  secondaryGuardian?: Guardian
  hatSize: string
  jerseySize: string
  digitalPic: boolean
  extraHat: boolean
  coachInterest: boolean
  sponsorInterest: boolean
  medical: MedicalInfo
  waiverInitials: Record<string, string>
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

Types will be refined during implementation to match actual component usage.

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
| `primary` | Vegas Gold | `#C5A04E` |
| `primary-content` | Black (text on gold) | `#1A1A1A` |
| `neutral` | Near-black | `#1A1A1A` |
| `neutral-content` | White | `#FFFFFF` |
| `base-100` | Off-white | `#FAFAF8` |
| `base-200` | Background | `#F5F4F0` |
| `base-300` | Border | `#E0E0E0` |
| `error` | Red | `#C23B22` |
| `success` | Green | `#2E7D4F` |

Single font: Source Sans 3 for all text. Weight range 300–700 for heading/body differentiation.

#### Component Mapping

| Current CSS | DaisyUI Replacement |
|---|---|
| `.H` (header) | `navbar` |
| `.H-mob` (mobile menu) | `drawer` |
| `.b.bp` (primary button) | `btn btn-neutral` |
| `.b.bg` (gold CTA button) | `btn btn-primary` |
| `.b.bs` (secondary button) | `btn btn-outline` |
| `.b.bd` (delete button) | `btn btn-error btn-ghost` |
| `.b.bgh` (ghost button) | `btn btn-ghost` |
| `.b.bsm` (small modifier) | `btn-sm` |
| `.cd` (card) | `card` |
| `.mo` / `.md` (modal) | `modal` |
| `.dt` (data table) | `table` |
| `.opt` (radio selector) | `card` with border + active state |
| `.fr input` / `.fr select` | `input` / `select` with DaisyUI classes |
| `.bdg` (badge) | `badge` |
| `.stv` (step indicator) | `steps` |
| `.sb` (status bar) | `alert` |
| Admin tabs | `tabs tabs-bordered` |

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
