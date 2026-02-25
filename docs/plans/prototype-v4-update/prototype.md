# Prototype V4 Updates — Implementation Plan

Updates to `maa-prototype/src/App.jsx` to refine the registration flow, waivers UX, and admin dashboard.

---

## Context

The prototype has a working 7-step registration flow and admin dashboard. These updates address feedback on the coaching/sponsorship steps, waiver UX, player context during registration, and admin dashboard usability. All changes are to the single `App.jsx` file.

---

## Tasks

| # | Task | Description |
|---|------|-------------|
| 1 | [Coaching: shirt size + waiver](#task-1-coaching-shirt-size--coaches-waiver) | Add adult shirt size when coaching, add coaches code of conduct waiver |
| 2 | [Sponsorship: business name](#task-2-sponsorship-business-name) | Ask for sponsor/business name when interested |
| 3 | [Player age on selection screen](#task-3-player-age-on-selection-screen) | Show current age alongside DOB and gender |
| 4 | [Sequential accordion waivers](#task-4-sequential-accordion-waivers) | Make waivers expand/collapse sequentially |
| 5 | [Player indicator in breadcrumbs](#task-5-player-indicator-in-breadcrumbs) | Show which child is being registered on steps 2-7 |
| 6 | [Admin: column visibility toggle](#task-6-admin-column-visibility-toggle) | Reduce default columns, add toggle for visibility |
| 7 | [Admin: redesigned stat boxes](#task-7-admin-redesigned-stat-boxes) | Grouped sport stats, revenue, equipment summary modal |

---

## Task 1: Coaching shirt size + coaches waiver

**Goal:** When a user selects "Coach" or "Assistant Coach", collect their adult shirt size and present an additional Coaches Code of Conduct waiver.

**Changes:**

1. **New constant** — `COACH_SHIRTS`:
   ```js
   const COACH_SHIRTS = ["Adult S","Adult M","Adult L","Adult XL","Adult 2XL","Adult 3XL"];
   ```

2. **New waiver in SEASON.waivers** — add a third waiver:
   ```js
   {id:"w3", title:"Coaches Code of Conduct", content:"As a volunteer coach or assistant coach for MAA, you agree to prioritize the safety, well-being, and development of all players. You will promote good sportsmanship, treat all participants with respect, follow MAA guidelines and rules, attend required training sessions, and submit to any background check requirements. Violation of this code may result in removal from coaching duties.", required:true, coachOnly:true}
   ```
   Add a `coachOnly: true` flag to distinguish it from general waivers.

3. **New state in RegPage:**
   ```js
   const [coachShirtSize, setCoachShirtSize] = useState("");
   ```

4. **Step 5 (Interest) UI:** After the coaching option cards, if `coaching === "Coach" || coaching === "Assistant Coach"`, show:
   - Section header: "Adult Shirt Size" (Required)
   - Size buttons using the `.sz` pattern with `COACH_SHIRTS` options
   - Reset `coachShirtSize` to `""` if user switches to "Not Interested"

5. **Step 5 validation update:** Current: `!coaching || !sponsorship`. New: also require `coachShirtSize` when coaching is Coach or Assistant Coach:
   ```js
   disabled={!coaching || !sponsorship || ((coaching==="Coach"||coaching==="Assistant Coach") && !coachShirtSize) || (sponsorship==="Yes" && !sponsorName)}
   ```

6. **Step 6 (Waivers):** Build an `applicableWaivers` array:
   ```js
   const applicableWaivers = SEASON.waivers.filter(w => !w.coachOnly || coaching === "Coach" || coaching === "Assistant Coach");
   ```
   Use this instead of `SEASON.waivers` when rendering waivers and checking `wvOk`.

7. **wvOk validation update:**
   ```js
   const applicableWaivers = SEASON.waivers.filter(w => !w.coachOnly || coaching === "Coach" || coaching === "Assistant Coach");
   const wvOk = applicableWaivers.filter(w => w.required).every(w => wv[w.id]);
   ```

8. **Review step (Step 7):** Add row for coach shirt size (conditional):
   ```
   Coach Shirt Size | Adult L   (only if coaching is Coach/Assistant)
   ```
   Update waivers row to show only acknowledged applicable waivers.

9. **Cart item:** Add `coachShirtSize: (coaching === "Coach" || coaching === "Assistant Coach") ? coachShirtSize : null`

10. **Reset in submit:** Add `setCoachShirtSize("")`

---

## Task 2: Sponsorship business name

**Goal:** When a user selects "Yes" for sponsorship interest, collect the sponsor/business name (required).

**Changes:**

1. **New state in RegPage:**
   ```js
   const [sponsorName, setSponsorName] = useState("");
   ```

2. **Step 5 UI:** After the sponsorship option cards, if `sponsorship === "Yes"`, show:
   - Text input: "Sponsor / Business Name" label (Required)
   - Use `.fr` form row pattern
   - Reset `sponsorName` to `""` if user switches to "No"

3. **Step 5 validation:** Already included in Task 1's validation update — require `sponsorName` when `sponsorship === "Yes"`.

4. **Review step:** Add row:
   ```
   Sponsor Name | Acme Corp   (only if sponsorship is "Yes")
   ```

5. **Cart item:** Add `sponsorName: sponsorship === "Yes" ? sponsorName : null`

6. **Reset in submit:** Add `setSponsorName("")`

---

## Task 3: Player age on selection screen

**Goal:** Show the player's current age on the player selection cards (Step 1).

**Change:** In Step 1, update the player info line from:
```
DOB: {date} · {gender}
```
to:
```
DOB: {date} · Age: {age} · {gender}
```

Use the existing `age(p.dob, null)` function (which falls back to today's date when cutoff is null).

Single line change at line 233 — update the `<p>` inside the player option.

---

## Task 4: Sequential accordion waivers

**Goal:** Make waivers display as a sequential accordion — first waiver expanded, rest collapsed. Acknowledging one auto-advances to the next.

**Changes:**

1. **New state in RegPage:**
   ```js
   const [activeWaiver, setActiveWaiver] = useState(0); // index of currently expanded waiver
   ```

2. **Step 6 UI overhaul:** Replace the current flat waiver list with an accordion:
   ```jsx
   {applicableWaivers.map((w, idx) => (
     <div className="wv" key={w.id}>
       {/* Clickable header — toggles expand/collapse */}
       <div className="wv-hd" onClick={() => setActiveWaiver(activeWaiver === idx ? -1 : idx)}>
         <h4>{w.title}{w.required && <span className="rq">Required</span>}</h4>
         <span className="wv-chev">{activeWaiver === idx ? "▾" : "▸"}</span>
         {wv[w.id] && <Ic d={icons.chk} s={12} />}  {/* small check if acknowledged */}
       </div>
       {/* Expandable body — shown when active */}
       {activeWaiver === idx && <>
         <div className="wv-b">{w.content}</div>
         <label className="wv-a" onClick={() => {
           sWv(p => ({...p, [w.id]: !p[w.id]}));
           // Auto-advance to next unanswered waiver
           if (!wv[w.id] && idx < applicableWaivers.length - 1) {
             setActiveWaiver(idx + 1);
           }
         }}>
           <div className={`wck ${wv[w.id] ? "on" : ""}`}>{wv[w.id] && <Ic d={icons.chk} s={10}/>}</div>
           I have read and agree to the {w.title}
         </label>
       </>}
     </div>
   ))}
   ```

3. **CSS additions:**
   - `.wv-hd` — flex header with space-between, cursor pointer, subtle hover
   - `.wv-chev` — chevron indicator for expand/collapse state
   - Remove `max-height: 80px` from `.wv-b` so full content is visible when expanded (the accordion itself manages visibility)
   - Acknowledged waiver headers get a subtle green/gold check indicator

4. **Reset `activeWaiver`** to 0 when navigating back to waivers step or in submit.

---

## Task 5: Player indicator in breadcrumbs

**Goal:** Show which child is being registered during steps 2-7.

**Change:** Below the step breadcrumbs (`.steps` div), when `pl` is selected and `step > 1`, render a small indicator:

```jsx
{pl && step > 1 && (
  <div className="reg-for">Registering: {fullName(pl)}</div>
)}
```

**CSS:**
```css
.reg-for {
  text-align: center;
  font-size: 11px;
  color: ${C.gray};
  margin-top: -18px;
  margin-bottom: 18px;
  font-weight: 500;
}
```

---

## Task 6: Admin column visibility toggle

**Goal:** Reduce default visible columns in the registration table. Add a column picker.

**Changes:**

1. **Define columns config:**
   ```js
   const ADMIN_COLS = [
     {id:"player", label:"Player", default:true},
     {id:"program", label:"Program", default:true},
     {id:"parent", label:"Parent", default:true},
     {id:"hat", label:"Hat", default:false},
     {id:"jersey", label:"Jersey", default:false},
     {id:"pic", label:"Pic", default:false},
     {id:"extraHat", label:"Extra Hat", default:false},
     {id:"coaching", label:"Coaching", default:false},
     {id:"status", label:"Status", default:false},
     {id:"total", label:"Total", default:true},
     {id:"date", label:"Date", default:true},
   ];
   ```

2. **New state in AdminPage:**
   ```js
   const [visCols, setVisCols] = useState(() => ADMIN_COLS.filter(c=>c.default).map(c=>c.id));
   const [showColPicker, setShowColPicker] = useState(false);
   ```

3. **Column picker UI:** A "Columns" button next to the filters that toggles a dropdown with checkboxes for each column. Clicking a checkbox toggles that column's visibility.

4. **Table rendering:** Conditionally render `<th>` and `<td>` based on `visCols.includes(colId)`.

5. **Update REGS mock data dates** to include times (e.g., `"2026-02-10 2:30 PM"`) so the Date column is more useful.

6. **CSS:** `.col-picker` — positioned dropdown with checkbox list.

---

## Task 7: Admin redesigned stat boxes

**Goal:** Replace per-program boxes with grouped, more useful summary stats.

**Changes:**

1. **Primary stat boxes (always visible):**
   - **Total** — count of all registrations, gold accent
   - **T-Ball** — count
   - **T-Shirt** — count
   - **Baseball** — total count with sub-line: `8U: x · 10U: x · 12U: x`
   - **Softball** — total count with sub-line: `8U: x · 10U: x · 12U: x`
   - **Revenue** — sum of all `r.total`, formatted as dollars

2. **Equipment detail modal:** A "Equipment Summary" button in the stat box area opens a modal with:
   - **Hat Sizes** — breakdown: `XS/SM: x · SM/M: x · L/XL: x`
   - **Jersey Sizes** — breakdown by each jersey size with count
   - Reuse the existing `.mo` / `.md` modal pattern from AddModal

3. **New state in AdminPage:**
   ```js
   const [showEquipModal, setShowEquipModal] = useState(false);
   ```

4. **Compute stats from REGS:**
   ```js
   const totalRev = REGS.reduce((s,r) => s + r.total, 0);
   const bball = REGS.filter(r => r.program.includes("Baseball"));
   const sball = REGS.filter(r => r.program.includes("Softball"));
   const hatCounts = {}; REGS.forEach(r => { hatCounts[r.hat] = (hatCounts[r.hat]||0)+1 });
   const jerseyCounts = {}; REGS.forEach(r => { jerseyCounts[r.jersey] = (jerseyCounts[r.jersey]||0)+1 });
   ```

5. **Box for Baseball/Softball** — use a slightly wider `.stt` variant or just put sub-counts on a second line in small text:
   ```
   Baseball
   5
   8U: 2 · 10U: 1 · 12U: 2
   ```

6. **Equipment Summary button** — small button after the stat boxes row that opens the modal:
   ```jsx
   <button className="b bs bsm" onClick={() => setShowEquipModal(true)}>Equipment Summary</button>
   ```

7. **Equipment Modal** — uses existing `.mo` / `.md` classes. Content has two sections (Hats, Jerseys), each listing sizes with counts in a clean grid or list.

---

## Files Modified

- `maa-prototype/src/App.jsx` — all changes in this single file

## Execution

Implement tasks 1-7 sequentially in a single editing session. Tasks 1-2 both touch Step 5, so they should be done together. Task 4 depends on Task 1 (coaches waiver).

## Verification

After implementation:
1. `cd maa-prototype && npm run dev`
2. Walk through the full registration flow:
   - Select a player → verify age shows on Step 1
   - Verify player name shows below breadcrumbs on steps 2+
   - Select a program → continue to Guardian → continue to Sizes
   - On Step 5: select "Coach" → verify shirt size selector appears
   - On Step 5: select "Yes" sponsorship → verify business name input appears
   - On Step 6: verify waivers are sequential accordion (3 waivers if coaching)
   - On Step 7: verify review shows coach shirt size, sponsor name, all waivers
   - Add to cart → verify cart item has all new fields
3. Check admin dashboard:
   - Verify grouped stat boxes (Total, T-Ball, T-Shirt, Baseball, Softball, Revenue)
   - Click "Equipment Summary" → verify modal shows hat/jersey size breakdowns
   - Verify default table columns (Player, Program, Parent, Total, Date)
   - Click "Columns" → toggle additional columns on/off
