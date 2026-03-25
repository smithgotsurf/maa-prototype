# MAA TypeScript + DaisyUI Migration — Implementation Plan

> **Design:** [design.md](./design.md)
>
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate MAA prototype from untyped JavaScript/CSS to TypeScript strict mode + Tailwind CSS 4 + DaisyUI 5 + ESLint/Prettier, without changing functionality.

**Architecture:** Three sequential workstreams. TypeScript first (foundational), then ESLint/Prettier (formatting before big CSS change), then Tailwind+DaisyUI (biggest change). Each workstream ends with a build verification gate.

**Tech Stack:** TypeScript 5, Tailwind CSS 4, DaisyUI 5, ESLint (flat config), Prettier

**Code Review Checkpoints:**
- **Checkpoint 1:** After Tasks 1-3 (TypeScript migration — types, config, all file conversions, useLocalStorage)
- **Checkpoint 2:** After Tasks 4-5 (ESLint + Prettier — tooling setup and autoformat)
- **Checkpoint 3:** After Tasks 6-12 (Tailwind + DaisyUI — full styling migration)
- **Final Review:** After Tasks 13-14 (CSS cleanup + documentation updates)

---

## Tasks

| # | Task | Description | Model |
|---|------|-------------|-------|
| 1 | [TypeScript Config & Types](#task-1-typescript-config--types) | tsconfig, vite config rename, type definitions, vite-env.d.ts | sonnet |
| 2 | [Core File Conversions](#task-2-core-file-conversions) | Rename and type data.ts, utils.tsx, main.tsx, App.tsx, AppContext.tsx | sonnet |
| 3 | [Component & Page Conversions + useLocalStorage](#task-3-component--page-conversions--uselocalstorage) | Rename and type all pages, Registration, extract useLocalStorage hook | sonnet |
| 4 | [ESLint Setup](#task-4-eslint-setup) | Install and configure ESLint flat config with TypeScript rules | sonnet |
| 5 | [Prettier Setup](#task-5-prettier-setup) | Install Prettier, format codebase, add scripts | sonnet |
| 6 | [Tailwind + DaisyUI Setup](#task-6-tailwind--daisyui-setup) | Install, configure, create index.css with MAA custom theme | opus |
| 7 | [Migrate App Shell](#task-7-migrate-app-shell) | App.tsx header, nav, mobile drawer → Tailwind + DaisyUI | sonnet |
| 8 | [Migrate HomePage](#task-8-migrate-homepage) | Hero, status bar, program cards, sport overview → Tailwind | sonnet |
| 9 | [Migrate Small Pages](#task-9-migrate-small-pages) | About, FAQ, Fields, Sponsors → Tailwind + DaisyUI | sonnet |
| 10 | [Migrate Registration](#task-10-migrate-registration) | Multi-step form, option selectors, add-player modal → Tailwind | opus |
| 11 | [Migrate Cart](#task-11-migrate-cart) | Cart items, totals, confirmation → Tailwind | sonnet |
| 12 | [Migrate AdminPage](#task-12-migrate-adminpage) | Tabs, tables, filters, season management → Tailwind + DaisyUI | opus |
| 13 | [Delete Old CSS & Cleanup](#task-13-delete-old-css--cleanup) | Remove app.css + registration.css, verify no stale class references | sonnet |
| 14 | [Update CLAUDE.md](#task-14-update-claudemd) | Reflect new stack, patterns, structure | sonnet |

---

## Workstream 1: TypeScript Migration

### Task 1: TypeScript Config & Types

**Files:**
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Rename: `vite.config.js` → `vite.config.ts`
- Create: `src/types/index.ts`
- Create: `src/vite-env.d.ts`
- Modify: `package.json` (build script)
- Modify: `index.html` (script src)

- [ ] **Step 1: Install TypeScript and types**

```bash
npm install -D typescript @types/react @types/react-dom
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }]
}
```

- [ ] **Step 3: Create `tsconfig.app.json`**

Model on the retirement-planner config at `/Users/josh/Code/retirement-planner/tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Rename `vite.config.js` → `vite.config.ts`**

Content stays the same — Vite handles TS config natively.

- [ ] **Step 5: Create `src/vite-env.d.ts`**

```ts
/// <reference types="vite/client" />

declare module "*.html?raw" {
  const content: string;
  export default content;
}
```

This enables TypeScript to understand the `?raw` imports used for waiver HTML files in `data.ts`.

- [ ] **Step 6: Update `package.json` build script**

```json
"build": "tsc -b && vite build"
```

- [ ] **Step 7: Create `src/types/index.ts`**

All domain types. Export everything. These are extracted from the actual shapes in `src/data.js` and `src/Registration.jsx`:

```ts
// --- Domain types ---

export type Gender = "Male" | "Female";
export type ProgramGender = "Coed" | "Male" | "Female";

export interface Player {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: Gender;
}

export interface Program {
  id: string;
  name: string;
  gender: ProgramGender;
  min: number;
  max: number;
  fee: number;
  closed?: boolean;
  ageAsOfDate: string | null;
}

export interface Season {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  programs: Program[];
}

export interface SeasonConfig {
  name: string;
  programs: Program[];
  waivers: Waiver[];
}

export interface Waiver {
  id: string;
  title: string;
  required: boolean;
  coachOnly?: boolean;
  content: string;
}

export interface SportType {
  name: string;
  gender: ProgramGender;
  min: number;
  max: number;
  fee: number;
}

// --- Registration / Cart types ---

export interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface CartItemGuardian {
  primary: ContactInfo;
  secondary: ContactInfo | null;
  primaryContactPhone: string;
}

export interface CartItem {
  id: string;
  player: Player;
  program: Program;
  hat: string;
  jersey: string;
  guardian: CartItemGuardian;
  digitalPicture: boolean;
  extraHat: { size: string } | null;
  coaching: string;
  coachShirtSize: string | null;
  sponsorship: string;
  sponsorName: string | null;
  medical: { allergies: string | null; info: string | null } | null;
  total: number;
}

// --- Admin types ---

export interface AdminRegistration {
  id: string;
  player: string;
  gender: Gender;
  dob: string;
  program: string;
  parent: string;
  email: string;
  primaryContact: string;
  fee: number;
  status: "Completed" | "Pending";
  date: string;
  hat: string;
  jersey: string;
  digitalPic: boolean;
  extraHat: string | null;
  coaching: string;
  sponsorship: string;
  total: number;
}

export interface AdminColumn {
  id: string;
  label: string;
  default: boolean;
}

// --- User types ---

export interface CurrentUser {
  firstName: string;
  lastName: string;
  phone: string;
  secondaryGuardian: ContactInfo;
}

// --- Context types ---

export interface AppContextValue {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  players: Player[];
  addPlayer: (player: Player) => void;
  seasons: Season[];
  activeSeason: Season | null;
  addSeason: (season: Season) => void;
  updateSeason: (id: string, updates: Partial<Season>) => void;
  deleteSeason: (id: string) => void;
  activateSeason: (id: string) => void;
  deactivateSeason: (id: string) => void;
}
```

- [ ] **Step 8: Verify TypeScript config**

```bash
npx tsc -b --noEmit
```

Expected: errors about .jsx files not found (we haven't renamed yet). Config itself should be valid.

- [ ] **Step 9: Commit**

```bash
git add tsconfig.json tsconfig.app.json vite.config.ts src/types/index.ts src/vite-env.d.ts package.json
git rm vite.config.js
git commit -m "feat: add TypeScript config and domain type definitions"
```

---

### Task 2: Core File Conversions

**Files:**
- Rename: `src/data.js` → `src/data.ts`
- Rename: `src/utils.jsx` → `src/utils.tsx`
- Rename: `src/main.jsx` → `src/main.tsx`
- Rename: `src/App.jsx` → `src/App.tsx`
- Rename: `src/context/AppContext.jsx` → `src/context/AppContext.tsx`
- Modify: `index.html` (script src)

- [ ] **Step 1: Rename files**

```bash
git mv src/data.js src/data.ts
git mv src/utils.jsx src/utils.tsx
git mv src/main.jsx src/main.tsx
git mv src/App.jsx src/App.tsx
git mv src/context/AppContext.jsx src/context/AppContext.tsx
```

- [ ] **Step 2: Update `index.html`**

Change `<script type="module" src="/src/main.jsx">` to `src="/src/main.tsx"`. This must happen after the rename in Step 1.

- [ ] **Step 3: Type `data.ts`**

Add imports and type annotations:

```ts
import type {
  SeasonConfig, Player, CurrentUser, AdminRegistration,
  AdminColumn, SportType, Season
} from "./types";
```

- Type `SEASON` as `SeasonConfig` — it has `name`, `programs`, `waivers` but no `id`/`description`/`status`.
- Type `HATS`, `JERSEYS`, `COACH_SHIRTS` with `as const` suffix.
- Type `SPORT_TYPES` as `SportType[]`.
- Type `SEED_SEASONS` as `Season[]`.
- Type `INIT_PLAYERS` as `Player[]`.
- Type `CURRENT_USER` as `CurrentUser`.
- Type `REGS` as `AdminRegistration[]`.
- Type `ADMIN_COLS` as `AdminColumn[]`.
- The `?raw` waiver imports should work with the `vite-env.d.ts` declaration from Task 1.

- [ ] **Step 4: Type `utils.tsx`**

Add parameter and return types to all functions:

```ts
import type { Player, Program } from "./types";

export const B_URL: string = import.meta.env.BASE_URL;

function ld(s: string): Date { ... }
export function age(dob: string, asOf?: string | null): number { ... }
export function fmtDate(s: string): string { ... }
export function recommended(p: Player, progs: Program[]): Program[] { ... }
export function otherPrograms(p: Player, progs: Program[]): Program[] { ... }
export function fullName(p: Player): string { ... }
export function calcTotal(pr: Program, digitalPic: boolean, extraHat: boolean): number { ... }
```

Type the `Ic` component:

```tsx
interface IcProps {
  d: string;
  s?: number;
}
export const Ic = ({ d, s = 18 }: IcProps) => ( ... );
```

Type the `icons` map as `Record<string, string>`.

Type `PAGE_PATHS` with `as const`:

```ts
export const PAGE_PATHS = {
  home: "/",
  about: "/about",
  faq: "/faq",
  fields: "/field-rentals",
  sponsors: "/sponsorship",
  register: "/register",
  cart: "/cart",
  admin: "/admin",
} as const;
```

- [ ] **Step 5: Type `AppContext.tsx`**

```ts
import { createContext, useContext, useState, useEffect } from "react";
import type { CartItem, Player, Season, AppContextValue } from "../types";
import { INIT_PLAYERS, SEED_SEASONS } from "../data";
```

- Type the context: `createContext<AppContextValue | null>(null)`.
- Type state: `useState<CartItem[]>([])`, `useState<Player[]>(INIT_PLAYERS)`, `useState<Season[]>(loadSeasons)`.
- Type `loadSeasons()` return as `Season[]`.
- Type all callback parameters: `addToCart(item: CartItem)`, `removeFromCart(id: string)`, `addSeason(season: Season)`, `updateSeason(id: string, updates: Partial<Season>)`, etc.
- Type `AppProvider` props: `{ children: React.ReactNode }`.
- Type `useAppContext()` with null guard:

```ts
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
```

- [ ] **Step 6: Type `main.tsx`**

Add `!` non-null assertion on `document.getElementById("root")!` for `createRoot`.

- [ ] **Step 7: Type `App.tsx`**

- Type the `nav` array as `Array<{ to: string; ic: string; l: string; badge?: number }>`.
- The `menuOpen` state is inferred as `boolean` — no annotation needed.
- No props interface needed (no props).

- [ ] **Step 8: Build check**

```bash
npx tsc -b
```

Expected: May still have errors from un-renamed page/component files. Fix any errors in the files converted so far.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: convert core files to TypeScript (data, utils, context, main, App)"
```

---

### Task 3: Component & Page Conversions + useLocalStorage

**Files:**
- Rename: `src/Registration.jsx` → `src/Registration.tsx`
- Rename: `src/pages/HomePage.jsx` → `src/pages/HomePage.tsx`
- Rename: `src/pages/AboutPage.jsx` → `src/pages/AboutPage.tsx`
- Rename: `src/pages/FaqPage.jsx` → `src/pages/FaqPage.tsx`
- Rename: `src/pages/FieldsPage.jsx` → `src/pages/FieldsPage.tsx`
- Rename: `src/pages/SponsorsPage.jsx` → `src/pages/SponsorsPage.tsx`
- Rename: `src/pages/AdminPage.jsx` → `src/pages/AdminPage.tsx`
- Create: `src/hooks/useLocalStorage.ts`
- Modify: `src/context/AppContext.tsx` (use `useLocalStorage`)

- [ ] **Step 1: Create `src/hooks/useLocalStorage.ts`**

Modeled on the retirement-planner pattern at `/Users/josh/Code/retirement-planner/src/hooks/useLocalStorage.ts`:

```ts
import { useState, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key]
  );

  const resetValue = useCallback(() => {
    setStoredValue(initialValue);
    localStorage.setItem(key, JSON.stringify(initialValue));
  }, [key, initialValue]);

  return [storedValue, setValue, resetValue];
}
```

- [ ] **Step 2: Refactor `AppContext.tsx` to use `useLocalStorage`**

- Remove standalone `loadSeasons()` function and the `useEffect` that writes to localStorage.
- Replace `const [seasons, setSeasons] = useState(loadSeasons)` with `const [seasons, setSeasons] = useLocalStorage<Season[]>('maa_seasons', SEED_SEASONS)`.
- All season mutation callbacks (`addSeason`, `updateSeason`, `deleteSeason`, `activateSeason`, `deactivateSeason`) already call `setSeasons` — they continue to work as-is since `useLocalStorage.setValue` handles persistence automatically.

- [ ] **Step 3: Rename all page/component files**

```bash
git mv src/Registration.jsx src/Registration.tsx
for f in src/pages/*.jsx; do git mv "$f" "${f%.jsx}.tsx"; done
```

- [ ] **Step 4: Type `HomePage.tsx`**

- Type the `SPORTS` constant:
```ts
const SPORTS: Array<{ label: string; items: Array<{ name: string; ages: string[] }> }> = [ ... ];
```
- No props interface needed.

- [ ] **Step 5: Type `AboutPage.tsx`**

- Type the `board` array as `Array<{ n: string; r: string }>`.
- Type the `members` array as `string[]`.
- No props interface needed.

- [ ] **Step 6: Type `FaqPage.tsx`**

- Type the `Sh` component props: `({ l, first }: { l: string; first?: boolean })`.
- Type the FAQ items array. The `a` field can be `React.ReactNode` (some are strings, some are JSX). The `link` field is optional:
```ts
interface FaqItem {
  q: string;
  a: React.ReactNode;
  link?: { l: string; p: keyof typeof PAGE_PATHS };
}
```
- Type `open` state as `useState<number | null>(null)`.

- [ ] **Step 7: Type `FieldsPage.tsx`**

Minimal changes — no props, no state. Just ensure inline style objects are valid. Remove any `fontFamily: 'var(--font-display)'` references — will be cleaned up in Workstream 3 but note them now.

- [ ] **Step 8: Type `SponsorsPage.tsx`**

Same as FieldsPage — minimal changes. No props, no state.

- [ ] **Step 9: Type `Registration.tsx`**

This is the largest file (~248 lines). Key typing work:

- Import types: `Player`, `Program`, `CartItem`, `CartItemGuardian`, `Waiver` from types.
- Type all `useState` calls with explicit generics where inference is insufficient:
  - `useState<number>(1)` for step
  - `useState<Player | null>(null)` for selected player
  - `useState<Program | null>(null)` for selected program
  - `useState<Partial<Record<string, string>>>({})` for waiver initials (values may be `undefined` for unsigned waivers)
- Type the `AddModal` component props: `{ onAdd: (player: Player) => void; onClose: () => void }`.
- Type the `submit()` function — it constructs a `CartItem` object. Ensure all fields match the `CartItem` interface.
- Type the `ProgCard` subcomponent if it exists as a local function.
- The `CartPage` component: type `cart` from context as `CartItem[]`.

- [ ] **Step 10: Type `AdminPage.tsx`**

Second largest file (~238 lines). Key typing work:

- Import types: `Season`, `Program`, `SportType`, `AdminRegistration`, `AdminColumn` from types.
- Type `tab` state as `useState<"registrations" | "seasons" | "users">("registrations")`.
- Type `editSeason` state as `useState<Season | null>(null)`.
- Type the `SeasonDetail` component props: `{ season: Season; sportTypes: SportType[]; onSave: (updates: Partial<Season>) => void; onCancel: () => void }`.
- Type filter states: `filter` as `string`, `statusFilter` as `string`, `search` as `string`.
- Type `visibleCols` state as `useState<Set<string>>`.
- Type the `applyDefaults` function that populates program fields from `SportType`.
- Note: `ADMIN_COLS` includes an `"age"` column that has no matching field in `AdminRegistration` — age is computed from `dob`. The table rendering code that maps `col.id` to row values must handle `"age"` as a special case (compute via `age()` utility) rather than a direct property lookup. Use a render function or switch statement instead of `reg[col.id as keyof AdminRegistration]`.

- [ ] **Step 11: Full build check**

```bash
npx tsc -b && npm run build
```

Expected: PASS. Fix any remaining type errors. Common issues: implicit `any` on event handlers, missing null checks.

- [ ] **Step 12: Run dev server and verify**

```bash
npm run dev
```

Open http://localhost:5174/maa-prototype/ — verify all pages load, registration form works, cart works, admin page works.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: convert all components and pages to TypeScript, extract useLocalStorage hook"
```

---

## Workstream 2: ESLint + Prettier

### Task 4: ESLint Setup

**Files:**
- Create: `eslint.config.js`
- Modify: `package.json`

- [ ] **Step 1: Install ESLint dependencies**

```bash
npm install -D eslint @eslint/js globals typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-config-prettier
```

- [ ] **Step 2: Create `eslint.config.js`**

Model on retirement-planner at `/Users/josh/Code/retirement-planner/eslint.config.js`. Note: MAA has `"type": "module"` in package.json so `.js` extension works (no need for `.mjs`).

```js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  prettierConfig,
]);
```

Note: `eslint-config-prettier` disables ESLint formatting rules that would conflict with Prettier. It must be last in the config array to override other configs.

- [ ] **Step 3: Add lint script to `package.json`**

```json
"lint": "eslint ."
```

- [ ] **Step 4: Run lint and fix issues**

```bash
npm run lint
```

Fix any errors. Common issues: unused variables needing `_` prefix, `any` usage in event handlers.

- [ ] **Step 5: Commit**

```bash
git add eslint.config.js package.json package-lock.json
git add -A
git commit -m "feat: add ESLint with TypeScript rules"
```

---

### Task 5: Prettier Setup

**Files:**
- Create: `.prettierrc`
- Modify: `package.json`

- [ ] **Step 1: Install Prettier**

```bash
npm install -D prettier
```

- [ ] **Step 2: Create `.prettierrc`**

```json
{
  "printWidth": 100,
  "singleQuote": true
}
```

- [ ] **Step 3: Add format scripts to `package.json`**

```json
"format": "prettier --write src/",
"format:check": "prettier --check src/"
```

- [ ] **Step 4: Format the entire codebase**

```bash
npm run format
```

- [ ] **Step 5: Verify lint still passes**

```bash
npm run lint
```

- [ ] **Step 6: Build check**

```bash
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Prettier, format codebase"
```

---

## Workstream 3: Tailwind CSS 4 + DaisyUI 5

### Task 6: Tailwind + DaisyUI Setup

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/index.css`
- Modify: `src/main.tsx` (CSS import)

This is the trickiest task — getting the tooling configured correctly with the MAA custom theme.

- [ ] **Step 1: Install Tailwind and DaisyUI**

```bash
npm install -D @tailwindcss/vite
npm install daisyui
```

Note: DaisyUI 5 is a runtime dependency (provides CSS at build time via the `@plugin` directive).

- [ ] **Step 2: Update `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/maa-prototype/",
  server: {
    port: 5174,
  },
});
```

- [ ] **Step 3: Create `src/index.css`**

DaisyUI 5 uses CSS-based config via `@plugin "daisyui/theme"` directive. Define the MAA custom theme with the brand colors from the design spec:

```css
@import "tailwindcss";
@plugin "daisyui";

@plugin "daisyui/theme" {
  name: "maa";
  default: true;
  color-scheme: light;

  --color-primary: #C5A04E;
  --color-primary-content: #1A1A1A;
  --color-secondary: #A68636;
  --color-secondary-content: #FFFFFF;
  --color-neutral: #1A1A1A;
  --color-neutral-content: #FFFFFF;
  --color-base-100: #FAFAF8;
  --color-base-200: #F5F4F0;
  --color-base-300: #E0E0E0;
  --color-base-content: #1A1A1A;
  --color-error: #C23B22;
  --color-error-content: #FFFFFF;
  --color-success: #2E7D4F;
  --color-success-content: #FFFFFF;

  --radius-selector: 0.375rem;
  --radius-field: 0.375rem;
  --radius-box: 0.5rem;
  --border: 1px;
}

@theme {
  --font-sans: "Source Sans 3", -apple-system, BlinkMacSystemFont, sans-serif;
}
```

Note: DaisyUI 5 theme syntax may need adjustment during implementation. Check https://daisyui.com/docs/themes/ for the latest CSS-based customization API. The colors above are from the design spec's theme configuration table.

- [ ] **Step 4: Update `src/main.tsx` CSS import**

Add `import "./index.css"` to `src/main.tsx` (before the component imports). Do NOT touch the `import './app.css'` in `App.tsx` — it remains there until Task 13. Both CSS files coexist during migration.

- [ ] **Step 5: Verify Tailwind is working**

```bash
npm run dev
```

Add a test class like `className="bg-primary text-white p-4"` to any element temporarily. Verify it applies Tailwind styles. Remove the test class.

- [ ] **Step 6: Verify DaisyUI is working**

Add a test DaisyUI button like `<button className="btn btn-primary">Test</button>` temporarily. Verify it renders as a styled DaisyUI button with the Vegas Gold color. Remove the test.

- [ ] **Step 7: Commit**

```bash
git add vite.config.ts src/index.css src/main.tsx package.json package-lock.json
git commit -m "feat: add Tailwind CSS 4 + DaisyUI 5 with MAA custom theme"
```

---

### Task 7: Migrate App Shell

**Files:**
- Modify: `src/App.tsx`

Reference the current CSS in `app.css` (header, nav, mobile menu styles) and replace with Tailwind utilities + DaisyUI classes.

- [ ] **Step 1: Migrate header**

Current classes: `.H`, `.H-logo`, `.H-nav`, `.H-ham`, `.H-full`, `.H-mob`, `.H-mob-overlay`, `.hbadge`, `.g`

Replace with DaisyUI `navbar` + Tailwind utilities. Key mappings:
- `.H` → `navbar bg-neutral text-neutral-content sticky top-0 z-50`
- `.H-logo` → `btn btn-ghost gap-2` with logo image
- `.H-nav` links → `btn btn-ghost btn-sm` with conditional active styling
- `.hbadge` → `badge badge-sm badge-primary`
- `.g` (gold letter) → `text-primary`
- User button → `btn btn-ghost btn-sm`

- [ ] **Step 2: Migrate mobile menu**

Current: `.H-ham`, `.H-mob-overlay`, `.H-mob`

Replace with DaisyUI `drawer` component, or use Tailwind-styled mobile overlay:
- `.H-ham` → `btn btn-ghost lg:hidden`
- `.H-mob-overlay` → `fixed inset-0 bg-black/50 z-40 lg:hidden`
- `.H-mob` → `fixed top-0 right-0 h-full w-64 bg-base-100 z-50 shadow-xl` with slide-in transition

- [ ] **Step 3: Remove old class references**

Remove all old CSS class names from `App.tsx`. Any remaining inline styles should be converted to Tailwind utilities.

- [ ] **Step 4: Build and verify**

```bash
npm run build && npm run dev
```

Verify: header renders correctly, nav links work, mobile menu toggles, cart badge shows.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: migrate App shell to Tailwind + DaisyUI navbar"
```

---

### Task 8: Migrate HomePage

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Migrate hero section**

Current: `.hero` with inline `backgroundImage` style, `.g` for gold letters.

Replace with Tailwind:
- Hero container: `relative bg-cover bg-center py-20 px-6 text-white text-center` (keep inline `backgroundImage` for the dynamic URL)
- Dark overlay: use `before:` pseudo or a wrapper div with `bg-black/70`
- Gold letters: `text-primary`

- [ ] **Step 2: Migrate status bar and program grid**

Current: `.sb`, `.sh`, `.pgrid`, `.pcol`, `.pcol-h`, `.pcard`, `.pcard-m`, `.pcard-a`, `.pcard-cl`, `.pcard-ages`

Replace with:
- `.sb` → `card bg-base-100 shadow-md` with flex layout for content + CTA button
- `.hcta` → `btn btn-primary`
- `.pgrid` → `grid grid-cols-1 md:grid-cols-3 gap-4`
- `.pcol-h` → `font-bold text-sm uppercase tracking-wide text-center` with appropriate color
- `.pcard` → `card bg-base-100 border border-base-300 p-3`
- `.pcard-cl` (closed) → `badge badge-error badge-sm`
- Program cards with `closed` class → `opacity-40`

- [ ] **Step 3: Migrate fallback (no active season) view**

Same components but with the `SPORTS` overview grid. Same DaisyUI class mappings apply.

- [ ] **Step 4: Replace `.pg` container**

Current: `.pg` (max-width 900px centered). Replace with `max-w-4xl mx-auto px-4`.

- [ ] **Step 5: Build and verify**

```bash
npm run build && npm run dev
```

Verify: hero displays correctly, status bar with CTA works, program grid shows Coed/Boys/Girls columns, closed programs are dimmed.

- [ ] **Step 6: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "refactor: migrate HomePage to Tailwind + DaisyUI"
```

---

### Task 9: Migrate Small Pages

**Files:**
- Modify: `src/pages/AboutPage.tsx`
- Modify: `src/pages/FaqPage.tsx`
- Modify: `src/pages/FieldsPage.tsx`
- Modify: `src/pages/SponsorsPage.tsx`

- [ ] **Step 1: Migrate `AboutPage.tsx`**

Current classes: `.pg`, `.cp`, `.gl`, `.bgrd`, `.bcrd`, `.bcrd-av`, `.mem-list`, `.mem`, `.ic-grid`, `.ic`

Replace with:
- `.pg.cp` → `max-w-4xl mx-auto px-4 py-8`
- `.gl` (gold line divider) → `border-t-2 border-primary w-16 mb-6`
- `.bgrd` (board grid) → `grid grid-cols-2 md:grid-cols-4 gap-4`
- `.bcrd` (board card) → `card bg-base-100 border border-base-300 p-4 text-center`
- `.bcrd-av` (avatar circle) → `w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-2`
- `.mem-list` → `flex flex-wrap gap-2`
- `.mem` → `badge badge-ghost`
- `.ic-grid` → `grid grid-cols-1 md:grid-cols-2 gap-4`
- `.ic` → `card bg-base-100 border border-base-300 p-4`
- Convert all inline styles to Tailwind utilities

- [ ] **Step 2: Migrate `FaqPage.tsx`**

Current: `.pg`, `.cp`, `.wv`, `.wv-hd`, `.wv-b`, `.wv-chev`, `.faq-a`

Replace with:
- FAQ accordion items: DaisyUI `collapse collapse-arrow` or custom Tailwind accordion:
  - `.wv` → `border border-base-300 rounded-lg mb-2`
  - `.wv-hd` → `flex items-center justify-between p-4 cursor-pointer hover:bg-base-200`
  - `.wv-b` → `p-4 pt-0`
  - `.wv-chev` → Tailwind `transition-transform` on chevron
- `Sh` component (season header): replace `var(--gold-dk)` with `text-primary font-bold uppercase tracking-wider text-sm`
- Convert all inline styles (`paddingLeft`, `lineHeight`, `fontSize`, etc.) to Tailwind utilities
- Ghost button: `btn btn-ghost btn-sm`

- [ ] **Step 3: Migrate `FieldsPage.tsx`**

Current: heavy inline styles for field image overlay, rate cards

Replace with:
- Image container: `rounded-xl overflow-hidden border border-base-300 relative my-4`
- Field labels (positioned overlays): keep `absolute` + Tailwind positioning (`left-[38%] top-[49%] -translate-x-1/2 -translate-y-1/2`), style with `bg-black/70 text-white px-3 py-1 rounded-md text-xs font-bold tracking-wider border border-primary pointer-events-none`
- Rate cards: `card bg-base-100 border border-base-300 p-4 text-center`
- Price display: replace `var(--font-display)` with `text-2xl font-bold text-primary`
- `.ic-grid` / `.ic` → same pattern as AboutPage

- [ ] **Step 4: Migrate `SponsorsPage.tsx`**

Current: `.spt`, `.spc`, `.pr`, heavy inline styles

Replace with:
- `.spt` → `grid grid-cols-1 md:grid-cols-3 gap-6`
- `.spc` → `card bg-base-100 border-2 border-primary p-6`
- `.pr` (price) → `text-3xl font-bold text-primary`
- Icon styling: `text-primary mx-auto mb-2 block`
- Download/contact links: `inline-flex items-center gap-1 text-primary font-semibold text-sm no-underline`
- Convert all inline styles to Tailwind utilities

- [ ] **Step 5: Build and verify all four pages**

```bash
npm run build && npm run dev
```

Visit each page: /about, /faq, /field-rentals, /sponsorship. Verify layout, spacing, colors, links.

- [ ] **Step 6: Commit**

```bash
git add src/pages/AboutPage.tsx src/pages/FaqPage.tsx src/pages/FieldsPage.tsx src/pages/SponsorsPage.tsx
git commit -m "refactor: migrate About, FAQ, Fields, Sponsors pages to Tailwind + DaisyUI"
```

---

### Task 10: Migrate Registration

**Files:**
- Modify: `src/Registration.tsx`

This is the most complex component — 8-step form with option selectors, size pickers, waiver accordion, and add-player modal.

- [ ] **Step 1: Migrate step indicator**

Current: `.reg-wrap`, `.stv`, `.stn`

Replace with:
- `.reg-wrap` → `grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 max-w-4xl mx-auto px-4`
- Step indicator: DaisyUI `steps steps-vertical`
  - Each step: `step` with `step-primary` for completed/active steps
  - Step number: handled by DaisyUI `data-content` attribute or custom styling

- [ ] **Step 2: Migrate option selectors (player/program)**

Current: `.opt`, `.opt-i`, `.opt-c`, `.opt-r`, `.opt.sl`

Replace with:
- `.opt` → `card border-2 border-base-300 p-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors`
- `.opt.sl` (selected) → add `border-primary bg-primary/10`
- Radio circle: use DaisyUI `radio radio-primary` or custom styled indicator

- [ ] **Step 3: Migrate form fields**

Current: `.fr`, `.fc`, form input styling

Replace with:
- `.fr` → `mb-4` (form row)
- `.fc` → `grid grid-cols-2 gap-4` (form columns)
- Inputs: `input input-bordered w-full`
- Selects: `select select-bordered w-full`
- Labels: `label` with `label-text`
- Textarea: `textarea textarea-bordered w-full`

- [ ] **Step 4: Migrate size selectors**

Current: `.szg`, `.szp`, `.sz`, `.sz.sl`

Replace with:
- Size button group: `flex flex-wrap gap-2`
- Each size: `btn btn-sm btn-outline` with `btn-primary` when selected

- [ ] **Step 5: Migrate waiver section**

Current: `.wv`, `.wv-hd`, `.wv-b`, `.wck`

Replace with:
- Waiver accordion: same pattern as FAQ page
- Waiver checkbox: DaisyUI `checkbox checkbox-sm`
- Initials input: `input input-bordered input-sm w-24`

- [ ] **Step 6: Migrate add-player modal**

Current: `.mo`, `.md`

Replace with DaisyUI `modal`:
```tsx
<div className="modal modal-open">
  <div className="modal-box">
    <h3 className="text-lg font-bold">Add New Player</h3>
    {/* form fields */}
    <div className="modal-action">
      <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      <button className="btn btn-primary" onClick={onAdd}>Add</button>
    </div>
  </div>
  <div className="modal-backdrop" onClick={onClose} />
</div>
```

- [ ] **Step 7: Migrate buttons and navigation**

- Back/Next buttons: `btn btn-outline` / `btn btn-primary`
- "Add to Cart" button: `btn btn-primary`
- Convert all remaining inline styles to Tailwind utilities

- [ ] **Step 8: Build and verify**

```bash
npm run build && npm run dev
```

Test the full registration flow: select player, select program, fill guardian info, pick sizes, check waivers, review, submit to cart.

- [ ] **Step 9: Commit**

```bash
git add src/Registration.tsx
git commit -m "refactor: migrate Registration to Tailwind + DaisyUI"
```

---

### Task 11: Migrate Cart

**Files:**
- Modify: `src/Registration.tsx` (CartPage component is in the same file)

- [ ] **Step 1: Migrate cart items**

Current: `.ci`

Replace with:
- Cart item: `card bg-base-100 border border-base-300 p-4 mb-3`
- Item details: Tailwind flex/grid utilities
- Remove button: `btn btn-error btn-ghost btn-sm`

- [ ] **Step 2: Migrate cart total and actions**

Current: `.ct`, `.cfm`

Replace with:
- Cart total: `text-xl font-bold text-right`
- Action buttons: `btn btn-primary` for complete, `btn btn-outline` for register another
- Confirmation card: `card bg-success/10 border border-success p-6 text-center`

- [ ] **Step 3: Build and verify**

```bash
npm run build && npm run dev
```

Test: add items to cart, verify cart displays correctly, remove items, complete registration, see confirmation.

- [ ] **Step 4: Commit**

```bash
git add src/Registration.tsx
git commit -m "refactor: migrate CartPage to Tailwind + DaisyUI"
```

---

### Task 12: Migrate AdminPage

**Files:**
- Modify: `src/pages/AdminPage.tsx`

Second largest file. Three tabs: Registrations (dashboard), Seasons (management), Users (placeholder).

- [ ] **Step 1: Migrate tab navigation**

Current: admin tabs with inline styling

Replace with DaisyUI:
```tsx
<div role="tablist" className="tabs tabs-bordered mb-4">
  <button role="tab" className={`tab ${tab === "registrations" ? "tab-active" : ""}`}>Registrations</button>
  {/* ... */}
</div>
```

- [ ] **Step 2: Migrate stat tiles**

Current: `.sts`, `.stt`

Replace with DaisyUI `stats`:
```tsx
<div className="stats shadow">
  <div className="stat">
    <div className="stat-title">Total Registrations</div>
    <div className="stat-value">{count}</div>
  </div>
  {/* ... */}
</div>
```

Or use a responsive grid of individual `stat` cards: `grid grid-cols-2 md:grid-cols-4 gap-4`.

- [ ] **Step 3: Migrate filter bar**

Current: `.flt`, `.fsl`, `.fin`

Replace with:
- Filter row: `flex flex-wrap items-center gap-2 mb-4`
- Select filters: `select select-bordered select-sm`
- Search input: `input input-bordered input-sm`
- Column picker: DaisyUI `dropdown`:
```tsx
<div className="dropdown">
  <label tabIndex={0} className="btn btn-ghost btn-sm">Columns</label>
  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow p-2 w-52">
    {/* checkbox items */}
  </ul>
</div>
```

- [ ] **Step 4: Migrate data table**

Current: `.dt`

Replace with DaisyUI `table`:
```tsx
<div className="overflow-x-auto">
  <table className="table table-sm">
    <thead>
      <tr>{/* column headers */}</tr>
    </thead>
    <tbody>
      {/* rows */}
    </tbody>
  </table>
</div>
```

- Badges: `badge badge-success` for Completed, `badge badge-warning` for Pending.

- [ ] **Step 5: Migrate equipment summary modal**

Replace with DaisyUI `modal` pattern (same as Registration add-player modal).

- [ ] **Step 6: Migrate seasons tab**

Current: `.sn-active`, `.sn-none`, season cards, SeasonDetail form

Replace with:
- Season list: `card` items with conditional `border-primary` for active season
- Active badge: `badge badge-primary`
- Inactive badge: `badge badge-ghost`
- Season action buttons: `btn btn-sm btn-outline`, `btn btn-sm btn-error btn-ghost`
- SeasonDetail form: standard DaisyUI form inputs (`input input-bordered`, `select select-bordered`)
- Program list in edit: `table table-sm` or card list

- [ ] **Step 7: Migrate admin layout**

Current: `.adm`, `.asd`, `.am`

Replace with:
- Admin wrapper: `max-w-6xl mx-auto px-4`
- Sidebar (if applicable on desktop): `grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6`

- [ ] **Step 8: Convert all remaining inline styles**

Convert any remaining `style={{}}` attributes to Tailwind utility classes. For truly dynamic values (conditional colors, computed opacity), keep inline.

- [ ] **Step 9: Build and verify**

```bash
npm run build && npm run dev
```

Test all three admin tabs: registrations (filters, table, column picker, equipment modal), seasons (list, create, edit, clone, delete, activate), users (placeholder).

- [ ] **Step 10: Commit**

```bash
git add src/pages/AdminPage.tsx
git commit -m "refactor: migrate AdminPage to Tailwind + DaisyUI"
```

---

### Task 13: Delete Old CSS & Cleanup

**Files:**
- Delete: `src/app.css`
- Delete: `src/registration.css`
- Modify: `src/App.tsx` (remove CSS import)

- [ ] **Step 1: Remove CSS import from `App.tsx`**

Delete the line `import './app.css'`.

- [ ] **Step 2: Search for any remaining old CSS class references**

```bash
grep -rn "className.*\"\(H \|H-\|pg\b\|pgn\b\|cp\b\|hero\b\|sb\b\|hcta\b\|pgrid\b\|pcol\b\|pcard\b\|cd\b\|opt\b\|sz\b\|szg\b\|wv\b\|wck\b\|fr\b\|fc\b\|mo\b\|md\b\|dt\b\|bdg\b\|stv\b\|stn\b\|ci\b\|ct\b\|cfm\b\|rt\b\|adm\b\|asd\b\|am\b\|flt\b\|fsl\b\|fin\b\|sts\b\|stt\b\|sn-\|col-\|reg-\|bcrd\b\|bgrd\b\|mem\b\|spt\b\|spc\b\)" src/
```

Fix any remaining references found.

- [ ] **Step 3: Search for old CSS variable references in inline styles**

```bash
grep -rn "var(--" src/
```

Replace any remaining `var(--gold)`, `var(--font-display)`, `var(--gray)`, etc. with Tailwind classes or DaisyUI theme tokens.

- [ ] **Step 4: Delete old CSS files**

```bash
git rm src/app.css src/registration.css
```

- [ ] **Step 5: Also remove `registration.css` import if it exists**

Check `Registration.tsx` for `import './registration.css'` — remove it.

- [ ] **Step 6: Full build and visual verification**

```bash
npm run build && npm run dev
```

Visit every page and verify no broken styles. Check both desktop and mobile viewport widths.

- [ ] **Step 7: Run lint**

```bash
npm run lint
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: delete old CSS files, clean up stale class references"
```

---

### Task 14: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update Tech Stack section**

Add TypeScript, Tailwind CSS 4, DaisyUI 5, ESLint, Prettier to the tech stack list. Remove references to hand-rolled CSS files.

- [ ] **Step 2: Update Project Structure**

Add:
- `src/types/index.ts` — centralized type definitions
- `src/hooks/useLocalStorage.ts` — localStorage persistence hook
- `src/index.css` — Tailwind + DaisyUI theme configuration
- `eslint.config.js`, `.prettierrc`

Remove:
- `src/app.css`, `src/registration.css`

- [ ] **Step 3: Update Styling section**

Replace CSS variables and Google Fonts references with DaisyUI theme configuration and Tailwind utility class conventions.

- [ ] **Step 4: Update Coding Conventions**

Add notes about TypeScript strict mode, type imports, DaisyUI component patterns.

- [ ] **Step 5: Update Dev Commands**

Add `npm run lint`, `npm run format`, `npm run format:check`.

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md to reflect TypeScript + DaisyUI stack"
```
