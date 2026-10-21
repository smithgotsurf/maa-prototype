# MAA Homepage Themes — Design

## Overview

The site's layout, colors, fonts and copy stay as they are. This work changes three things around the content:

1. **The homepage hero** gets a curved, gold-rimmed bottom edge and comes in three **themes** that visitors can switch between from the homepage footer.
2. **Subpages** get a short **header band** in the same curved style, carrying the page title.
3. **The page background** gets a fine paper grain in the margins. The content column stays plain tan.

It ships in `maa-frontend` first, then copies across to `maa-prototype` under the shared-file rule in the prototype's `CLAUDE.md`.

Design exploration happened in an interactive mockup. A copy is in this folder as [`mockup.html`](./mockup.html) (open it in a browser). Its A/B/C buttons are the three themes; its Page buttons show Field Rentals and FAQ. The mockup still contains options that were tried and dropped (the "Today" baseline, mowing stripes, the ball-pattern background). **Where the mockup and this document disagree, this document wins.**

## Goals

- The homepage hero represents all four sports (baseball/softball, basketball, soccer, volleyball) without needing new photography.
- Visitors can pick a homepage theme, and the site remembers it on their device.
- Every marketing page carries the same curved, black-and-gold header style.
- The page looks less flat without the content getting harder to read.
- Shared files stay byte-identical between the two repos, so the prototype sync is a copy.

## Non-goals

- Changing the nav, cards, fonts, copy or page layouts below the header.
- New photography. The Home Plate theme reuses `field-1.webp`.
- Sport-specific or seasonal themes. The theme list is built so one can be added later as one entry plus its art.
- Header bands on the prototype's Register, Cart and Admin pages.
- Dark mode, animation, tests (neither repo has any).

## Decisions

### Homepage themes

| Theme id | Label | Hero art |
|---|---|---|
| `home-plate` | Home Plate | Today's infield photo (`field-1.webp`) under today's dark overlay |
| `four-fields` | Four Fields | Four slanted panels showing each playing surface from above: soccer, basketball, baseball, volleyball |
| `gold-lines` | Gold Lines | A repeating pattern of the four balls in thin gold lines on charcoal, with a soft gold glow behind the name |

- **Default theme:** `four-fields`. First-time visitors, and anyone whose saved value is missing or not a known theme id, see this one.
- **Stored in** `localStorage` under `maa_theme` (same `maa_` prefix as the prototype's `maa_seasons`). If storage throws (private browsing, blocked storage), the site uses the default and the switch still works for that visit.
- All three themes use the same curve, hero text, padding and Welcome card overlap.

### Curved edge

- The hero's bottom edge is the bottom of an ellipse: `clip-path: ellipse(125% 100% at 50% 0)`.
- A 5px gold rim (`primary`, `#C5A04E`) shows along the curve. The hero's own background is gold, and the art layer inside it is clipped 5px shorter: `ellipse(125% calc(100% - 5px) at 50% 0)`.
- The hero (and band) sits above the content column (`z-index: 1`). The Welcome card (`z-10`) still overlaps the hero as today.

### Hero text

- Heading unchanged.
- Subhead: opacity `.85` (was `.55`) with `text-shadow: 0 1px 2px rgba(0,0,0,.75), 0 0 14px rgba(0,0,0,.6)`, on every theme. It was hard to read over the Four Fields court lines.

### Four Fields art

- Panel order left to right: **soccer, basketball, baseball, volleyball**.
- Each panel is one SVG drawing of that surface from above. They're finished files in [`assets/`](./assets): `fields-soccer.svg`, `fields-basketball.svg`, `fields-baseball.svg`, `fields-volleyball.svg` (400×500 viewBox each). The basketball half court is drawn turned 180° (hoop at the top). Volleyball has its own copy of the hardwood pattern.
- Panels lean 10°, with 3px gold seams between them, and one dark overlay over all four so the name stays readable.
- On phones (below the `md` breakpoint, 768px) the seams are 2px and dimmer, and the overlay is a little darker.

### Subpage header band

- Every marketing subpage (About, FAQ, Field Rentals, Sponsorship, 404) starts with a band in the same curved style. The page's title moves into it as the page's `h1`, with the short gold rule under it.
- **Band art is set per page, not by the visitor's theme:** Field Rentals uses the photo (`home-plate` art); every other subpage uses the line art (`gold-lines` art). Four Fields is too busy at band height and is never used for a band.
- Phones get a shorter band (smaller padding and title), not a hidden one.

### Margins and content column

- `body` gets a fine paper grain over the existing `base-200` (`#F5F4F0`) background.
- Each page's content column (`max-w-4xl`) gets a plain `base-200` background and a 1px gold edge on each side, so the grain only shows in the margins.
- **The column tucks up under the hero/band.** Its background extends 48px upward behind the curve, so where the curve lifts at the column's edges the column meets it cleanly, with no wedge of grain.
- **The column runs down to the footer.** The footer's top margin moves into the column's bottom padding, and the column grows to fill short pages. Otherwise a strip of grain shows across the full width above the footer.
- On phones the column fills the width, so the grain doesn't show.

### Footer theme switch

- The footer's bottom bar gets "Theme" plus three pill buttons (Home Plate, Four Fields, Gold Lines), each with a small swatch, to the right of the copyright line.
- **Shown only on the homepage.** Subpages don't follow the theme, so the switch would do nothing there.
- The selected pill is gold. The buttons use `aria-pressed`, sit in a `role="group"` labelled "Homepage theme", and show a visible focus ring.
- Clicking switches the hero immediately, with no reload.

## Visual spec

Exact values. The implementation plans use these verbatim.

| Element | Value |
|---|---|
| Hero padding | `64px 28px 180px` (unchanged) |
| Outer clip | `ellipse(125% 100% at 50% 0)`, background `primary` |
| Art clip | `ellipse(125% calc(100% - 5px) at 50% 0)` |
| Home Plate art | `linear-gradient(rgba(0,0,0,.65), rgba(0,0,0,.78)), url(static/field-1.webp)`; `center / cover` |
| Gold Lines art | `radial-gradient(ellipse 46% 60% at 50% 26%, rgba(197,160,78,.2), rgba(197,160,78,0) 72%), url(static/ball-pattern.svg), linear-gradient(180deg, #282521 0%, #151514 100%)`; sizes `auto, 180px 180px, auto` |
| Four Fields panel strip | `left/right: -60px`, `skewX(-10deg)`; each image overhangs its panel by `max(12%, 48px)` per side (`left: calc(-1 * max(12%, 48px))`, `width: calc(100% + 2 * max(12%, 48px))`), `skewX(10deg)`, `object-fit: cover`, `saturate(.78)`. The 48px floor covers the lean on tall phone heroes |
| Four Fields image position | soccer `50% 100%`, basketball `50% 0`, baseball `center`, volleyball `center` |
| Four Fields seams | `3px` `rgba(197,160,78,.8)`; phones `2px` `rgba(197,160,78,.4)` |
| Four Fields overlay | `url(static/grain-dark.svg), radial-gradient(ellipse 44% 56% at 50% 30%, rgba(12,11,9,.6), rgba(12,11,9,0) 78%), linear-gradient(180deg, rgba(12,11,9,.56) 0%, rgba(12,11,9,.42) 50%, rgba(12,11,9,.74) 100%)`; phones add `background-color: rgba(12,11,9,.2)` |
| Subhead | opacity `.85`; `text-shadow: 0 1px 2px rgba(0,0,0,.75), 0 0 14px rgba(0,0,0,.6)` |
| Band padding | desktop `36px 28px 52px`; phones `22px 16px 34px` |
| Band title | `h1`, Playfair bold, `34px` desktop / `24px` phones, white, `text-wrap: balance`, `text-shadow: 0 1px 2px rgba(0,0,0,.6)` |
| Band rule | 44×3px `primary`, centered, `10px` above (phones `8px`) |
| Body grain | the light grain SVG inline in `index.css` (see [frontend.md](./frontend.md) Task 2), over `base-200` |
| Column edge | `box-shadow: -1px 0 0 rgba(166,134,54,.25), 1px 0 0 rgba(166,134,54,.25)` |
| Column tuck | 48px of the column's background above its top, behind the hero/band |
| Column padding | subpages `32px` top, `80px` bottom; homepage `24px` top, `72px` bottom (the old `py-*` plus the footer's old `mt-12`) |
| Switch swatches | Home Plate: `linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.4)), url(static/field-1.webp) 50% 62% / 280% auto`; Four Fields: `linear-gradient(100deg, #3e7334 0 25%, #c4945b 25% 50%, #3d6c30 50% 75%, #2f4e79 75%)`; Gold Lines: `radial-gradient(circle, transparent 0 2.3px, rgba(197,160,78,.85) 2.6px 3.3px, transparent 3.6px) 1px 0 / 9px 9px, #1e1d1b` |

## File layout

New shared code goes in `src/components/`, which both repos already share. Page files that change are all on the shared list too, so the prototype gets them by copying.

| File | Shared? | Change |
|---|---|---|
| `src/components/theme.ts` | shared | **New.** Theme ids, theme list, default, stored-theme hook |
| `src/components/HeroArt.tsx` | shared | **New.** The art layer for `photo`, `fields` or `lines` |
| `src/components/CurvedBand.tsx` | shared | **New.** The curved, gold-rimmed container used by the hero and the bands |
| `src/components/PageBand.tsx` | shared | **New.** Subpage header band |
| `src/components/PageColumn.tsx` | shared | **New.** The tan content column |
| `src/components/ThemeSwitch.tsx` | shared | **New.** The footer's theme buttons |
| `src/components/Footer.tsx` | shared | Drop `mt-12`; bottom bar gets the switch on the homepage |
| `src/pages/home/Hero.tsx`, `copy.ts` | shared | Hero uses the theme and `CurvedBand`; `hero.backgroundImage` goes |
| `src/pages/{about,faq,fields,sponsors,not-found}/index.tsx` | shared | `PageBand` + `PageColumn` |
| `public/static/*.svg` (6 new) | shared | From [`assets/`](./assets) |
| `src/index.css` | per repo | `body` background gets the grain (same edit in both) |
| `src/App.tsx` | per repo | `main` becomes a flex column (same edit in both) |
| `src/pages/home/index.tsx` | per repo | `PageColumn` instead of the `max-w-4xl` div |
| prototype `register`, `cart` | prototype | Content wrappers become `PageColumn` |
| prototype `admin` | prototype | Root gets `bg-base-200` so no grain shows behind the dashboard |
| `CLAUDE.md` | per repo | Structure and styling notes |

## Plans

- [frontend.md](./frontend.md): maa-frontend, done first.
- [prototype.md](./prototype.md): maa-prototype, after frontend.md.

## Open questions

- **Default theme.** Assumed to be Four Fields. It's one constant (`DEFAULT_THEME` in `theme.ts`).
- **Register and Cart bands.** Left out for now; adding them later is a `PageBand` at the top of each page.
