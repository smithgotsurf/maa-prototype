# MAA Prototype

Meadow Athletic Association — registration and info website prototype. React SPA deployed to GitHub Pages.

## Dev commands

- `npm run dev` — start Vite dev server (port 5174)
- `npm run build` — production build

## Tech stack

- React 19, Vite 6, react-router-dom v7 (HashRouter)
- No TypeScript, no tests — prototype-grade code
- Deployed to GitHub Pages; HashRouter + `base: '/maa-prototype/'` in vite.config.js

## Project structure

```
src/
  main.jsx          — HashRouter, route definitions, AppProvider wrapper
  App.jsx           — layout shell (header, nav, footer, Outlet)
  Registration.jsx  — RegPage + CartPage components
  data.js           — SEASON config, programs, mock registrations, waivers
  utils.jsx         — shared utilities (Ic icon helper, icons map, B_URL, PAGE_PATHS)
  app.css            — global styles
  registration.css   — registration/cart styles
  context/
    AppContext.jsx   — cart + players state (consumed via useAppContext())
  pages/
    HomePage.jsx, AboutPage.jsx, FaqPage.jsx,
    FieldsPage.jsx, SponsorsPage.jsx, AdminPage.jsx
public/static/       — images, logo, sponsorship PDF
```

## Routing

Routes defined in `main.jsx` inside a HashRouter. `App.jsx` renders the layout with `<Outlet />` for page content. All routes are children of the App layout route.

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

`AppContext` provides cart and players state. Wrap with `<AppProvider>` (done in main.jsx). Consume via `useAppContext()`:

```js
const { cart, addToCart, removeFromCart, clearCart, players, addPlayer } = useAppContext();
```

## Coding conventions

- Short CSS class names (e.g. `.hdr`, `.nav`, `.cta`)
- Inline styles for one-off styling
- Compact JSX — keep components concise
- Shared icons/helpers live in `utils.jsx`
- Page components are default exports; Registration exports named `RegPage` and `CartPage`

## Styling

- CSS variables for theme colors: Vegas Gold `#C5A04E`, black, white
- Google Fonts: Playfair Display (serif headings), Source Sans 3 (body)
- Styles split across `app.css` (global/layout) and `registration.css` (reg/cart pages)
