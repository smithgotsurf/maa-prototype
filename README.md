# MAA Prototype

A registration and information web app prototype for the **Meadow Athletic Association (MAA)**.

Hosted at: [https://smithgotsurf.github.io/maa-prototype/](https://smithgotsurf.github.io/maa-prototype/)

Vibe coded with Claude

## Tech

- React 19 + TypeScript 6 (strict mode)
- Vite 8
- react-router-dom v7 (HashRouter)
- Tailwind CSS 4 + DaisyUI 5
- ESLint 10 + Prettier

## Project Structure

```
src/
  main.tsx              # HashRouter + route definitions + AppProvider
  App.tsx               # Layout shell (navbar, mobile drawer, Outlet, Footer)
  content.ts            # Shared site content/copy
  data.ts               # Season config, programs, mock data
  utils.tsx             # Shared utilities, icons, PAGE_PATHS, usePageTitle, helpers
  index.css             # Tailwind + DaisyUI theme configuration
  types/
    index.ts            # Centralized TypeScript type definitions
  hooks/
    useLocalStorage.ts  # Generic localStorage persistence hook
  context/
    AppContext.tsx      # Cart + players + seasons state
  components/
    Footer.tsx
    ContactSection.tsx
  pages/
    home/      # index.tsx + one file per section + OpenSeason.tsx + copy.ts + programs.ts
    about/     # index.tsx + copy.ts + board.ts
    faq/       # index.tsx + questions.tsx
    fields/    # index.tsx
    sponsors/  # index.tsx + tiers.tsx
    not-found/ # index.tsx (catch-all route)
    register/  # index.tsx
    cart/      # index.tsx
    admin/     # index.tsx
  waivers/              # HTML waiver documents (imported via ?raw)
public/static/          # Images (WebP photos), logo, sponsorship PDF
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

Deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. Uses HashRouter with `base: '/maa-prototype/'` in vite.config.ts.
