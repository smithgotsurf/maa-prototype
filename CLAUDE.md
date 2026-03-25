# MAA Prototype

Meadow Athletic Association — registration and info website prototype. React SPA deployed to GitHub Pages.

## Dev commands

- `npm run dev` — start Vite dev server (port 5174)
- `npm run build` — TypeScript check + production build
- `npm run lint` — ESLint
- `npm run format` — Prettier (write)
- `npm run format:check` — Prettier (check only)

## Tech stack

- React 19, Vite 6, react-router-dom v7 (HashRouter)
- TypeScript 5 (strict mode)
- Tailwind CSS 4 + DaisyUI 5 (custom "maa" theme)
- ESLint (flat config) + Prettier
- No tests — prototype-grade code
- Deployed to GitHub Pages; HashRouter + `base: '/maa-prototype/'` in vite.config.ts

## Project structure

```
src/
  main.tsx          — HashRouter, route definitions, AppProvider wrapper
  App.tsx           — layout shell (navbar, mobile drawer, Outlet)
  Registration.tsx  — RegPage + CartPage components
  data.ts           — SEASON config, programs, mock registrations, waivers
  utils.tsx         — shared utilities (Ic icon helper, icons map, B_URL, PAGE_PATHS)
  index.css         — Tailwind + DaisyUI theme configuration
  types/
    index.ts        — centralized TypeScript type definitions
  hooks/
    useLocalStorage.ts — generic localStorage persistence hook
  context/
    AppContext.tsx   — cart + players + seasons state (consumed via useAppContext())
  pages/
    HomePage.tsx, AboutPage.tsx, FaqPage.tsx,
    FieldsPage.tsx, SponsorsPage.tsx, AdminPage.tsx
  waivers/          — HTML waiver content (imported via ?raw)
public/static/       — images, logo, sponsorship PDF
```

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

Nav uses `NavLink` with `isActive` for highlighting. Logo links to `/`; no "Home" nav item.

## Shared state

`AppContext` provides cart, players, and seasons state. Wrap with `<AppProvider>` (done in main.tsx). Consume via `useAppContext()`:

```ts
const { cart, addToCart, removeFromCart, clearCart, players, addPlayer, seasons, activeSeason } = useAppContext();
```

Seasons are persisted to localStorage via the `useLocalStorage` hook.

## Type system

All types centralized in `src/types/index.ts`. Key types: `Player`, `Program`, `Season`, `SeasonConfig`, `CartItem`, `AppContextValue`, `AdminRegistration`.

## Coding conventions

- TypeScript strict mode — all components and functions typed
- DaisyUI component classes for UI elements (btn, card, modal, table, badge, etc.)
- Tailwind utility classes for layout and spacing
- Shared icons/helpers live in `utils.tsx`
- Page components are default exports; Registration exports named `RegPage` and `CartPage`

## Styling

- DaisyUI custom theme "maa" defined in `src/index.css`
- Brand colors: primary (Vegas Gold `#C5A04E`), secondary (dark gold `#A68636`), neutral (black `#1A1A1A`)
- `text-primary` for brand gold; `text-secondary` for darker gold (prices, links)
- Fonts: Playfair Display (headings via `font-serif`) + Source Sans 3 (body via `font-sans`). Both loaded from Google Fonts in `index.html` — ensure needed weights are included when using new weights
- Body background overridden to `base-200` (`#F5F4F0`) in `index.css`; use `bg-white` for cards/containers that need to stand out from the page
- Antialiased font smoothing set on body in `index.css`
- No custom CSS files — all styling via Tailwind utilities + DaisyUI components
- DaisyUI `btn` class overrides font-size/weight/color — when matching specific designs, set these explicitly on btn elements
- Reference design (pre-migration): https://smithgotsurf.github.io/maa-prototype/
