# Admin Season Management — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

> Design: [design.md](./design.md)

**Goal:** Build a working season management screen in the Admin Seasons tab with CRUD operations, clone, activate/deactivate, and localStorage persistence.

**Architecture:** Seasons state lives in AppContext with localStorage read/write. AdminPage renders list or detail view based on local state (no new routes). Registration and Dashboard read the active season from context instead of importing SEASON directly.

**Tech Stack:** React 19, existing CSS class conventions, localStorage for persistence.

**Code Review Checkpoints:**
- **Checkpoint 1:** After Tasks 1-2 (Data layer + context — seasons persist in localStorage, active season available via context)
- **Checkpoint 2:** After Tasks 3-4 (Season list view + detail/edit view — full CRUD UI working)
- **Checkpoint 3:** After Tasks 5-6 (Integration — Registration and Dashboard use active season from context)
- **Final Review:** After all tasks complete

---

## Tasks

| # | Task | Description | Model |
|---|------|-------------|-------|
| 1 | [Sport Types & Seed Data](#task-1-sport-types--seed-data) | Add SPORT_TYPES constant and SEED_SEASONS to data.js | sonnet |
| 2 | [Seasons in AppContext + localStorage](#task-2-seasons-in-appcontext--localstorage) | Add seasons state with localStorage persistence and active season accessor | sonnet |
| 3 | [Season List View](#task-3-season-list-view) | Active season card + all-seasons table with action buttons | sonnet |
| 4 | [Season Detail/Edit View](#task-4-season-detailedit-view) | In-tab form for creating/editing seasons with programs table | opus |
| 5 | [Clone, Delete, Activate/Deactivate](#task-5-clone-delete-activatedeactivate) | Wire up all action buttons with confirmation for destructive actions | sonnet |
| 6 | [Integration — Registration & Dashboard](#task-6-integration--registration--dashboard) | Switch Registration.jsx and AdminPage dashboard tab to use active season from context | sonnet |

---

### Task 1: Sport Types & Seed Data

**Files:**
- Modify: `src/data.js`

**Step 1: Add SPORT_TYPES constant**

Add a `SPORT_TYPES` array after the existing `COACH_SHIRTS` export. Each entry defines the defaults for a sport when selected from the dropdown:

```js
export const SPORT_TYPES = [
  // Spring
  { name: "T-Ball", gender: "Coed", min: 3, max: 4, fee: 65 },
  { name: "T-Shirt", gender: "Coed", min: 5, max: 6, fee: 65 },
  { name: "8U Baseball", gender: "Male", min: 7, max: 8, fee: 80 },
  { name: "10U Baseball", gender: "Male", min: 9, max: 10, fee: 80 },
  { name: "12U Baseball", gender: "Male", min: 11, max: 12, fee: 80 },
  { name: "8U Softball", gender: "Female", min: 7, max: 8, fee: 80 },
  { name: "10U Softball", gender: "Female", min: 9, max: 10, fee: 80 },
  { name: "12U Softball", gender: "Female", min: 11, max: 12, fee: 80 },
  // Fall
  { name: "Soccer 6U", gender: "Coed", min: 5, max: 6, fee: 65 },
  { name: "Soccer 8U Boys", gender: "Male", min: 7, max: 8, fee: 80 },
  { name: "Soccer 8U Girls", gender: "Female", min: 7, max: 8, fee: 80 },
  // Winter
  { name: "Basketball 6U", gender: "Coed", min: 5, max: 6, fee: 65 },
  { name: "Basketball 8U Boys", gender: "Male", min: 7, max: 8, fee: 80 },
  { name: "Basketball 10U Boys", gender: "Male", min: 9, max: 10, fee: 80 },
  { name: "Basketball 12U Boys", gender: "Male", min: 11, max: 12, fee: 80 },
  { name: "Basketball 15U Boys", gender: "Male", min: 13, max: 15, fee: 80 },
  { name: "Basketball 8U Girls", gender: "Female", min: 7, max: 8, fee: 80 },
  { name: "Basketball 10U Girls", gender: "Female", min: 9, max: 10, fee: 80 },
  { name: "Basketball 12U Girls", gender: "Female", min: 11, max: 12, fee: 80 },
  { name: "Volleyball 8U", gender: "Coed", min: 7, max: 8, fee: 80 },
  { name: "Volleyball 10U", gender: "Coed", min: 9, max: 10, fee: 80 },
  { name: "Volleyball 12U", gender: "Coed", min: 11, max: 12, fee: 80 },
];
```

**Step 2: Add SEED_SEASONS**

Add a `SEED_SEASONS` array after `SPORT_TYPES`. This is what gets written to localStorage on first load. The spring season reuses the existing `SEASON.programs` shape. Note: `ageAsOfDate` is included per-program where applicable; the seed data sets it to `null` for the past seasons since exact dates aren't critical for historical data.

```js
export const SEED_SEASONS = [
  {
    id: "s1", name: "2026 Spring Sports",
    description: "Registration open Jan 20 through Feb 28, 2026",
    status: "active",
    programs: SEASON.programs
  },
  {
    id: "s2", name: "2025 Fall Sports",
    description: "Registration closed",
    status: "inactive",
    programs: [
      { id: "pg-f1", name: "Soccer 6U", gender: "Coed", ageAsOfDate: null, min: 5, max: 6, fee: 65, closed: false },
      { id: "pg-f2", name: "Soccer 8U Boys", gender: "Male", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-f3", name: "Soccer 8U Girls", gender: "Female", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-f4", name: "8U Baseball", gender: "Male", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-f5", name: "10U Baseball", gender: "Male", ageAsOfDate: null, min: 9, max: 10, fee: 80, closed: false },
      { id: "pg-f6", name: "12U Baseball", gender: "Male", ageAsOfDate: null, min: 11, max: 12, fee: 80, closed: false },
      { id: "pg-f7", name: "8U Softball", gender: "Female", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-f8", name: "10U Softball", gender: "Female", ageAsOfDate: null, min: 9, max: 10, fee: 80, closed: false },
      { id: "pg-f9", name: "12U Softball", gender: "Female", ageAsOfDate: null, min: 11, max: 12, fee: 80, closed: false },
    ]
  },
  {
    id: "s3", name: "2025-2026 Winter Sports",
    description: "Registration closed",
    status: "inactive",
    programs: [
      { id: "pg-w1", name: "Basketball 6U", gender: "Coed", ageAsOfDate: null, min: 5, max: 6, fee: 65, closed: false },
      { id: "pg-w2", name: "Basketball 8U Boys", gender: "Male", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-w3", name: "Basketball 10U Boys", gender: "Male", ageAsOfDate: null, min: 9, max: 10, fee: 80, closed: false },
      { id: "pg-w4", name: "Basketball 12U Boys", gender: "Male", ageAsOfDate: null, min: 11, max: 12, fee: 80, closed: false },
      { id: "pg-w5", name: "Basketball 15U Boys", gender: "Male", ageAsOfDate: null, min: 13, max: 15, fee: 80, closed: false },
      { id: "pg-w6", name: "Basketball 8U Girls", gender: "Female", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-w7", name: "Basketball 10U Girls", gender: "Female", ageAsOfDate: null, min: 9, max: 10, fee: 80, closed: false },
      { id: "pg-w8", name: "Basketball 12U Girls", gender: "Female", ageAsOfDate: null, min: 11, max: 12, fee: 80, closed: false },
      { id: "pg-w9", name: "Volleyball 8U", gender: "Coed", ageAsOfDate: null, min: 7, max: 8, fee: 80, closed: false },
      { id: "pg-w10", name: "Volleyball 10U", gender: "Coed", ageAsOfDate: null, min: 9, max: 10, fee: 80, closed: false },
      { id: "pg-w11", name: "Volleyball 12U", gender: "Coed", ageAsOfDate: null, min: 11, max: 12, fee: 80, closed: false },
    ]
  }
];
```

**Step 3: Commit**

```bash
git add src/data.js
git commit -m "feat: add sport types and seed seasons data"
```

---

### Task 2: Seasons in AppContext + localStorage

**Files:**
- Modify: `src/context/AppContext.jsx`

**Step 1: Add localStorage helpers and seasons state**

Import `SEED_SEASONS` from data.js. Add a `LS_KEY` constant. Initialize seasons state from localStorage, falling back to `SEED_SEASONS`. Add a `useEffect` to persist on change.

```js
import { createContext, useContext, useState, useEffect } from 'react';
import { INIT_PLAYERS, SEED_SEASONS } from '../data';

const AppContext = createContext();
const LS_KEY = 'maa_seasons';

function loadSeasons() {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return SEED_SEASONS;
}
```

**Step 2: Add seasons state and mutation functions to the provider**

Inside `AppProvider`, add:

```js
const [seasons, setSeasons] = useState(loadSeasons);

useEffect(() => {
  localStorage.setItem(LS_KEY, JSON.stringify(seasons));
}, [seasons]);

const activeSeason = seasons.find(s => s.status === 'active') || null;

const addSeason = (season) => setSeasons(prev => [...prev, season]);
const updateSeason = (id, updates) => setSeasons(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
const deleteSeason = (id) => setSeasons(prev => prev.filter(s => s.id !== id));
const activateSeason = (id) => setSeasons(prev => prev.map(s => ({ ...s, status: s.id === id ? 'active' : 'inactive' })));
const deactivateSeason = (id) => setSeasons(prev => prev.map(s => s.id === id ? { ...s, status: 'inactive' } : s));
```

**Step 3: Expose in the provider value**

Add to the `value` prop: `seasons, activeSeason, addSeason, updateSeason, deleteSeason, activateSeason, deactivateSeason`

**Step 4: Verify dev server loads without errors**

Run: `npm run dev`
Open browser, check console for errors. Verify localStorage key `maa_seasons` is populated with 3 seasons.

**Step 5: Commit**

```bash
git add src/context/AppContext.jsx
git commit -m "feat: add seasons state with localStorage persistence"
```

---

### Task 3: Season List View

**Files:**
- Modify: `src/pages/AdminPage.jsx`
- Modify: `src/app.css` (add new admin season styles)

**Step 1: Update AdminPage imports and state**

Add `useAppContext` import. Add local state for the detail view:

```js
import { useAppContext } from '../context/AppContext';

// Inside AdminPage, add:
const { seasons, activeSeason, deleteSeason, activateSeason, deactivateSeason } = useAppContext();
const [seasonView, setSeasonView] = useState("list"); // "list" | "edit" | "new"
const [editSeasonId, setEditSeasonId] = useState(null);
```

**Step 2: Replace the seasons tab content**

Replace the `{tab==="seasons"&&...}` block (currently line 45-46) with the list view:

```jsx
{tab==="seasons"&&<>{seasonView==="list"?<>
  <div className="amh"><h1>Season Management</h1>
    <button className="b bp bsm" onClick={()=>{setEditSeasonId(null);setSeasonView("new")}}>
      <Ic d={icons.plus} s={13}/> New Season
    </button>
  </div>

  {/* Active season card */}
  {activeSeason ? (
    <div className="sn-active">
      <div className="sn-active-hd">
        <div>
          <h2 style={{marginBottom:0}}>{activeSeason.name}</h2>
          {activeSeason.description && <p style={{fontSize:12,color:'var(--gray)',marginTop:2}}>{activeSeason.description}</p>}
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span className="bdg bdg-ok">Active</span>
          <button className="b bs bsm" onClick={()=>{setEditSeasonId(activeSeason.id);setSeasonView("edit")}}>Edit</button>
          <button className="b bs bsm" onClick={()=>deactivateSeason(activeSeason.id)}>Deactivate</button>
        </div>
      </div>
      <p style={{fontSize:13,marginTop:10}}>
        <strong>{activeSeason.programs.length}</strong> programs
      </p>
    </div>
  ) : (
    <div className="sn-none">No active season. Activate a season from the table below.</div>
  )}

  {/* All seasons table */}
  <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px",marginTop:20,marginBottom:8}}>All Seasons</div>
  <table className="dt">
    <thead><tr>
      <th>Name</th><th>Description</th><th>Programs</th><th>Status</th><th>Actions</th>
    </tr></thead>
    <tbody>{seasons.map(s=>(
      <tr key={s.id}>
        <td style={{fontWeight:600}}>{s.name}</td>
        <td style={{fontSize:11,color:'var(--gray)',maxWidth:200}}>{s.description||"—"}</td>
        <td>{s.programs.length} programs</td>
        <td><span className={`bdg ${s.status==="active"?"bdg-ok":"bdg-in"}`}>{s.status==="active"?"Active":"Inactive"}</span></td>
        <td>
          <div style={{display:"flex",gap:4}}>
            {s.status!=="active"&&<button className="b bs bsm" onClick={()=>activateSeason(s.id)}>Activate</button>}
            <button className="b bs bsm" onClick={()=>{setEditSeasonId(s.id);setSeasonView("edit")}}>Edit</button>
            <button className="b bs bsm" onClick={()=>{
              const clone={...s,id:`s-${Date.now()}`,name:`${s.name} (Copy)`,status:"inactive",
                programs:s.programs.map(p=>({...p,id:`pg-${Date.now()}-${Math.random().toString(36).slice(2,6)}`}))};
              // addSeason will be wired up in Task 5, for now just inline
              // This gets replaced in Task 5
            }}>Clone</button>
            <button className="b bd bsm" onClick={()=>{if(confirm(`Delete "${s.name}"?`))deleteSeason(s.id)}}>Delete</button>
          </div>
        </td>
      </tr>
    ))}</tbody>
  </table>
</>:null /* detail view rendered in Task 4 */}
</>}
```

**Step 3: Add CSS for the active season card and inactive badge**

Append to `src/app.css` in the Admin section:

```css
/* -- Season Management -- */
.sn-active { background: #fff; border: 1px solid var(--bdr-lt); border-radius: 10px; padding: 18px 20px; border-left: 3px solid var(--grn) }
.sn-active-hd { display: flex; justify-content: space-between; align-items: center }
.sn-active h2 { font-family: var(--font-display); font-size: 20px }
.sn-none { background: var(--off); border: 1px dashed var(--bdr); border-radius: 10px; padding: 18px 20px; color: var(--gray); font-size: 13px; text-align: center }
.bdg-in { background: var(--off); color: var(--gray) }
```

**Step 4: Verify the list view renders**

Run dev server, navigate to Admin > Seasons tab. Confirm:
- Active season card shows "2026 Spring Sports" with Edit + Deactivate buttons
- Table shows all 3 seasons with correct statuses
- Activate/Deactivate buttons toggle correctly
- Delete button removes a season (with confirm dialog)

**Step 5: Commit**

```bash
git add src/pages/AdminPage.jsx src/app.css
git commit -m "feat: season list view with active card and table"
```

---

### Task 4: Season Detail/Edit View

**Files:**
- Modify: `src/pages/AdminPage.jsx`

This is the most complex task. The detail view replaces the list view in-tab when `seasonView` is `"edit"` or `"new"`.

**Step 1: Add the detail view component**

Add a `SeasonDetail` component inside `AdminPage.jsx` (or right above it). This component manages its own form state, receives the season to edit (or null for new), and calls back on save/cancel.

```jsx
function SeasonDetail({ season, onSave, onCancel }) {
  const [name, setName] = useState(season?.name || "");
  const [desc, setDesc] = useState(season?.description || "");
  const [programs, setPrograms] = useState(season?.programs || []);

  const addProgram = () => {
    setPrograms(prev => [...prev, {
      id: `pg-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      name: "", gender: "Coed", ageAsOfDate: null, min: 3, max: 4, fee: 65, closed: false
    }]);
  };

  const updateProgram = (id, field, value) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeProgram = (id) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  const applyDefaults = (id, sportName) => {
    const type = SPORT_TYPES.find(t => t.name === sportName);
    if (type) {
      setPrograms(prev => prev.map(p => p.id === id
        ? { ...p, name: sportName, gender: type.gender, min: type.min, max: type.max, fee: type.fee }
        : p
      ));
    } else {
      updateProgram(id, "name", sportName);
    }
  };

  const handleSave = () => {
    onSave({ name, description: desc, programs });
  };

  return (
    <>
      <button className="b bgh" onClick={onCancel} style={{marginBottom:14}}>
        ← Back to Seasons
      </button>
      <div className="amh">
        <h1>{season ? "Edit Season" : "New Season"}</h1>
      </div>
      <div className="cd" style={{marginBottom:16}}>
        <div className="fr"><label>Season Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. 2026 Fall Sports"/>
        </div>
        <div className="fr"><label>Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2}
            placeholder="e.g. Registration open through Aug 15, 2026"/>
        </div>
      </div>
      <div className="cd">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:600,color:'var(--char)',textTransform:"uppercase",letterSpacing:".7px"}}>
            Programs ({programs.length})
          </div>
          <button className="b bs bsm" onClick={addProgram}><Ic d={icons.plus} s={11}/> Add Program</button>
        </div>
        {programs.length === 0 && (
          <p style={{color:'var(--gray)',fontSize:13,textAlign:"center",padding:16}}>
            No programs yet. Click "Add Program" to get started.
          </p>
        )}
        {programs.length > 0 && (
          <table className="dt">
            <thead><tr>
              <th>Sport</th><th>Gender</th><th>Ages</th><th>Age As Of</th><th>Fee</th><th>Closed</th><th></th>
            </tr></thead>
            <tbody>{programs.map(p => (
              <tr key={p.id}>
                <td>
                  <select className="fsl" value={p.name} onChange={e => applyDefaults(p.id, e.target.value)}>
                    <option value="">Select sport...</option>
                    {SPORT_TYPES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
                </td>
                <td>
                  <select className="fsl" value={p.gender} onChange={e => updateProgram(p.id, "gender", e.target.value)}>
                    <option>Coed</option><option>Male</option><option>Female</option>
                  </select>
                </td>
                <td style={{display:"flex",gap:4,alignItems:"center"}}>
                  <input type="number" className="fin" style={{width:50}} value={p.min} onChange={e => updateProgram(p.id, "min", +e.target.value)}/>
                  <span>–</span>
                  <input type="number" className="fin" style={{width:50}} value={p.max} onChange={e => updateProgram(p.id, "max", +e.target.value)}/>
                </td>
                <td>
                  <input type="date" className="fin" style={{width:130}} value={p.ageAsOfDate || ""} onChange={e => updateProgram(p.id, "ageAsOfDate", e.target.value || null)}/>
                </td>
                <td>
                  <input type="number" className="fin" style={{width:60}} value={p.fee} onChange={e => updateProgram(p.id, "fee", +e.target.value)} prefix="$"/>
                </td>
                <td style={{textAlign:"center"}}>
                  <input type="checkbox" checked={!!p.closed} onChange={e => updateProgram(p.id, "closed", e.target.checked)} style={{accentColor:'var(--gold)'}}/>
                </td>
                <td>
                  <button className="b bd bsm" onClick={() => removeProgram(p.id)}><Ic d={icons.trash} s={13}/></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
      <div className="br" style={{marginTop:16}}>
        <button className="b bgh" onClick={onCancel}>Cancel</button>
        <button className="b bg" disabled={!name.trim()} onClick={handleSave}>Save Season</button>
      </div>
    </>
  );
}
```

**Step 2: Wire up the detail view in the seasons tab**

In the `tab==="seasons"` block, after the list view's closing, render the detail view when `seasonView` is `"edit"` or `"new"`:

```jsx
{(seasonView==="edit"||seasonView==="new")&&
  <SeasonDetail
    season={seasonView==="edit" ? seasons.find(s=>s.id===editSeasonId) : null}
    onSave={(data) => {
      if (seasonView==="edit") {
        updateSeason(editSeasonId, data);
      } else {
        addSeason({ ...data, id: `s-${Date.now()}`, status: "inactive" });
      }
      setSeasonView("list");
    }}
    onCancel={() => setSeasonView("list")}
  />
}
```

Make sure `addSeason` and `updateSeason` are destructured from `useAppContext()`.

Also import `SPORT_TYPES` from `../data` at the top of AdminPage.jsx.

**Step 3: Add the `.cd` style if not already suitable**

The `.cd` class is already used in the existing seasons stub. Verify it provides a white card background. If not, add:

```css
.cd { background: #fff; border: 1px solid var(--bdr-lt); border-radius: 10px; padding: 18px 20px }
```

Check `app.css` — if `.cd` isn't defined, add it. (It may already exist from registration styles.)

**Step 4: Verify**

- Click "New Season" → form renders with empty fields, programs table empty
- Add programs via dropdown → defaults fill in
- Save → new season appears in table as inactive
- Click "Edit" on existing season → form pre-filled
- Modify and save → changes persist (refresh page to confirm localStorage)

**Step 5: Commit**

```bash
git add src/pages/AdminPage.jsx src/app.css
git commit -m "feat: season detail/edit view with programs table"
```

---

### Task 5: Clone, Delete, Activate/Deactivate

**Files:**
- Modify: `src/pages/AdminPage.jsx`

**Step 1: Wire up the Clone button**

In the seasons table actions column, replace the placeholder clone handler with:

```jsx
<button className="b bs bsm" onClick={() => {
  const clone = {
    ...s,
    id: `s-${Date.now()}`,
    name: `${s.name} (Copy)`,
    status: "inactive",
    programs: s.programs.map(p => ({
      ...p,
      id: `pg-${Date.now()}-${Math.random().toString(36).slice(2,6)}`
    }))
  };
  addSeason(clone);
  setEditSeasonId(clone.id);
  setSeasonView("edit");
}}>Clone</button>
```

This creates the clone, adds it to state, and immediately opens it in the detail view for editing.

**Step 2: Verify all actions work end-to-end**

Test each action:
- **Activate**: Click "Activate" on an inactive season → it becomes active, previously active one becomes inactive. Active card at top updates.
- **Deactivate**: Click "Deactivate" on active card → no active season, notice shown.
- **Clone**: Click "Clone" on any season → opens detail view with "(Copy)" name, all programs copied. Save → appears in table.
- **Delete**: Click "Delete" → confirm dialog → season removed from table and localStorage.
- Refresh page after each action to confirm localStorage persistence.

**Step 3: Commit**

```bash
git add src/pages/AdminPage.jsx
git commit -m "feat: wire up clone, delete, activate/deactivate actions"
```

---

### Task 6: Integration — Registration & Dashboard

**Files:**
- Modify: `src/Registration.jsx`
- Modify: `src/pages/AdminPage.jsx` (dashboard tab)

**Step 1: Update Registration.jsx to use active season**

In `Registration.jsx`, replace the `SEASON` import with context:

```js
// Remove from import: SEASON
// Change line 3 from:
import { SEASON, HATS, JERSEYS, COACH_SHIRTS, CURRENT_USER } from './data';
// To:
import { HATS, JERSEYS, COACH_SHIRTS, CURRENT_USER } from './data';
```

In `RegPage`, get the active season from context:

```js
const { players, addPlayer, addToCart } = useAppContext();
// Change to:
const { players, addPlayer, addToCart, activeSeason } = useAppContext();
```

Replace all references to `SEASON` with `activeSeason`:
- `SEASON.name` → `activeSeason?.name`
- `SEASON.programs` → `activeSeason?.programs || []`
- `SEASON.waivers` → keep importing waivers separately (they're shared across seasons)

At the top of `RegPage`'s return, before the existing JSX, add a guard:

```jsx
if (!activeSeason) return (
  <div className="pg"><div className="cd" style={{textAlign:"center",padding:32}}>
    <h2>Registration Not Open</h2>
    <p style={{color:'var(--gray)'}}>There is no active season at this time. Check back soon!</p>
  </div></div>
);
```

**Important:** Waivers are NOT stored in seasons. Keep importing them from data.js. Update the waiver reference:

```js
// Add to imports from data.js:
import { HATS, JERSEYS, COACH_SHIRTS, CURRENT_USER, SEASON } from './data';
// Actually keep SEASON import ONLY for waivers:
```

Simplest approach: keep `SEASON` imported but only use `SEASON.waivers`. Use `activeSeason` from context for everything else (name, programs).

**Step 2: Update AdminPage dashboard tab**

In `AdminPage.jsx`, the dashboard tab currently imports `SEASON` and `REGS`. The `REGS` mock data is tied to the spring season and won't change — that's fine for the prototype. But switch the program references:

Replace `SEASON.programs.forEach(...)` and `SEASON.programs.map(...)` in the dashboard tab with `activeSeason?.programs || []`:

```js
const { seasons, activeSeason, ... } = useAppContext();

// In the dashboard tab:
// Change: SEASON.programs.forEach(p => ...)
// To: (activeSeason?.programs || []).forEach(p => ...)
// Change: SEASON.programs.map(p => ...)
// To: (activeSeason?.programs || []).map(p => ...)
```

Also update the SEASON import at the top of AdminPage.jsx — it may no longer be needed for seasons (only for REGS which come from data.js separately).

**Step 3: Verify integration**

- With active season: Registration page shows programs from active season
- Deactivate all seasons in admin → Registration shows "Registration Not Open" message
- Admin dashboard shows stats based on active season's programs
- Cart page still works correctly

**Step 4: Commit**

```bash
git add src/Registration.jsx src/pages/AdminPage.jsx
git commit -m "feat: integrate active season from context into registration and dashboard"
```

---

## Notes for Implementer

- **No tests** — this is a prototype-grade codebase (see CLAUDE.md)
- **CSS class naming** — use short names consistent with existing patterns (`.sn-active`, `.bdg-in`, etc.)
- **Keep `SEASON` in data.js** — it's still used as the source for seed data and waivers. Don't delete it.
- **Keep `REGS` as-is** — mock registration data stays hardcoded. Only season/program data becomes dynamic.
- The dev server runs on port 5174: `npm run dev`
