# MAA Prototype

A registration and information web app prototype for the **Meadow Athletic Association (MAA)**.

Hosted at: [https://smithgotsurf.github.io/maa-prototype/](https://smithgotsurf.github.io/maa-prototype/)

Vibe coded with Claude

## Tech

- React 19 + TypeScript 5 (strict mode)
- Vite 6
- react-router-dom v7 (HashRouter)
- Tailwind CSS 4 + DaisyUI 5
- ESLint + Prettier

## Project Structure

```
src/
  main.tsx              # HashRouter + route definitions + AppProvider
  App.tsx               # Layout shell (navbar, mobile drawer, Outlet)
  Registration.tsx      # RegPage + CartPage
  data.ts               # Season config, programs, mock data
  utils.tsx             # Shared utilities, icons, helpers
  index.css             # Tailwind + DaisyUI theme configuration
  types/
    index.ts            # Centralized TypeScript type definitions
  hooks/
    useLocalStorage.ts  # Generic localStorage persistence hook
  context/
    AppContext.tsx       # Cart + players + seasons state
  pages/
    HomePage.tsx
    AboutPage.tsx
    FaqPage.tsx
    FieldsPage.tsx
    SponsorsPage.tsx
    AdminPage.tsx
  waivers/              # HTML waiver documents (imported via ?raw)
public/static/          # Images, logo, sponsorship PDF
```

## Dev

```bash
npm run dev          # starts on port 5174
npm run build        # TypeScript check + production build
npm run lint         # ESLint
npm run format       # Prettier (write)
npm run format:check # Prettier (check only)
```

## Deployment

Deployed to GitHub Pages. Uses HashRouter with `base: '/maa-prototype/'` in vite.config.ts.
