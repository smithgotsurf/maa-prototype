# HomePage: Use Active Season from Context

> Design: [design.md](./design.md)

## Context
After building the admin season management feature, the HomePage still imports `SEASON` directly from `data.js` instead of reading `activeSeason` from AppContext. This means toggling seasons in admin has no effect on the home page. Additionally, hardcoded strings ("Registration open Jan 20 – Feb 28, 2026", "ages 3–12") need to be replaced with dynamic data.

## Changes

### File: `src/pages/HomePage.jsx`

**1. Switch from SEASON import to activeSeason from context**
- Remove `SEASON` import from `../data`
- Import `useAppContext` from `../context/AppContext`
- Destructure `activeSeason` from `useAppContext()`

**2. When active season exists — dynamic content:**
- Season banner card: show `activeSeason.name` and `activeSeason.description` (replaces hardcoded dates)
- "Register Now" CTA button
- Program grid: use `activeSeason.programs` (same Coed/Boys/Girls column layout)
- Age range text: compute from `Math.min(...programs.map(p=>p.min))` and `Math.max(...programs.map(p=>p.max))`

**3. When NO active season — fallback content:**
- Hero section stays the same (MAA branding)
- Season banner card shows: "Check back soon for upcoming registration information" (no Register Now button)
- Below the hero, show a static "What We Offer" section with the three seasonal sport categories:
  - **Spring**: T-Ball, T-Shirt, Baseball, Softball
  - **Fall**: Soccer, Baseball, Softball
  - **Winter**: Basketball, Volleyball
- Use the existing `.pgrid` / `.pcard` styling but with simple name-only cards (no fee/age since there's no active season to pull from)
- This gives visitors a sense of what MAA offers even when registration isn't open

## Verification
1. Run `npm run dev` and open `http://localhost:5174`
2. With active season: home page shows season name, description, programs with fees
3. Go to Admin > Seasons > Deactivate → home page shows "check back soon" + static sport overview
4. Activate a different season → home page updates to reflect that season's programs
5. `npx vite build` passes clean
