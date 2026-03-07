# Admin Season Management — Design

## Overview

Build a working season management screen in the Admin page's Seasons tab. Admins can create, edit, clone, and delete seasons. Only one season can be active at a time (or none). Seasons persist in localStorage.

## Data Model

```js
{
  id: "s1",                    // unique ID
  name: "2026 Spring Sports",
  description: "Registration open through Feb 28", // new field
  status: "active" | "inactive",
  programs: [
    {
      id: "pg1",
      name: "T-Ball",          // selected from fixed dropdown
      gender: "Coed",          // Coed | Male | Female
      ageAsOfDate: null,        // date string or null
      min: 3,                   // min age
      max: 4,                   // max age
      fee: 65,                  // dollar amount
      closed: false             // registration closed flag
    }
  ]
}
```

### Fixed Sport Types (dropdown options)

Spring: T-Ball, T-Shirt, 8U Baseball, 10U Baseball, 12U Baseball, 8U Softball, 10U Softball, 12U Softball

Fall: Soccer 6U, Soccer 8U Boys, Soccer 8U Girls, 8U Baseball, 10U Baseball, 12U Baseball, 8U Softball, 10U Softball, 12U Softball

Winter: Basketball 6U, Basketball 8U Boys, Basketball 10U Boys, Basketball 12U Boys, Basketball 15U Boys, Basketball 8U Girls, Basketball 10U Girls, Basketball 12U Girls, Volleyball 8U, Volleyball 10U, Volleyball 12U

Sport types are shared across seasons — the dropdown shows all known types. Each type has default gender, age range, and fee ($65 for 6U and below, $80 for others).

## Seed Data

On first load (nothing in localStorage), seed with three seasons:

1. **2026 Spring Sports** — active, programs from current `SEASON` in data.js
2. **2025 Fall Sports** — inactive, pre-populated with: Soccer 6U Coed (5-6, $65), Soccer 8U Boys (7-8, $80), Soccer 8U Girls (7-8, $80), 8U/10U/12U Baseball (boys, $80 each), 8U/10U/12U Softball (girls, $80 each)
3. **2025-2026 Winter Sports** — inactive, pre-populated with: Basketball 6U Coed (5-6, $65), Basketball 8U/10U/12U/15U Boys ($80 each), Basketball 8U/10U/12U Girls ($80 each), Volleyball 8U/10U/12U ($80 each)

## UI: Season List View (default)

### Active Season Card

Displayed at the top when an active season exists. Shows:

- Season name (large heading)
- Description
- Status badge (green "Active")
- Program count
- **Edit** and **Deactivate** buttons

If no active season, show a subtle notice: "No active season."

### All Seasons Table

Below the active card. Columns:

| Name | Description | Programs | Status | Actions |
|------|-------------|----------|--------|---------|

- **Programs**: count (e.g. "8 programs")
- **Status**: badge — green "Active" / gray "Inactive"
- **Actions**: Activate (inactive only), Edit, Clone, Delete

Sorted with active first, then by name.

"New Season" button in the page header.

## UI: Season Detail View (in-tab, not a route)

Rendered in place of the list view when editing or creating a season. Not a separate route — just a different render state within `tab === "seasons"`.

### Layout

- **Back link** at top to return to list
- **Season fields**: name (text input), description (textarea)
- **Programs section**: table with columns:
  - Sport (dropdown of fixed types — selecting auto-fills defaults)
  - Gender (editable)
  - Age Range (min/max inputs)
  - Age As Of Date (date input, optional)
  - Fee (number input)
  - Closed (checkbox)
  - Remove button
- **Add Program** button below the table
- **Save** and **Cancel** buttons

### Behavior

- Selecting a sport type from the dropdown auto-fills gender, age range, and fee with defaults. All fields remain editable.
- Save writes to localStorage and returns to list view.
- Cancel discards changes and returns to list view.

## Clone

- Creates a copy with " (Copy)" appended to the name
- Status set to inactive
- Opens directly into the detail/edit view so admin can rename

## Active Season Integration

The rest of the app (Registration page, Registration Dashboard) currently imports `SEASON` from `data.js`. This needs to change so those components read the active season from shared state (AppContext or a new context). When no season is active, registration should show a "no active season" message.

## Persistence

- Seasons array stored in localStorage under a key like `maa_seasons`
- Read on app init, write on every mutation (create/edit/clone/delete/activate/deactivate)
- Seed data written on first load only (when key doesn't exist)

## Out of Scope

- Waiver management (same waivers apply to all seasons)
- User management tab
- Server-side persistence
- Registration date enforcement (description field is freeform)
