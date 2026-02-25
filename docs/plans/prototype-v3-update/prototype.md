> Spec: [maa-sports-registration-spec.md](../../../maa-sports-registration-spec.md)

# Prototype V3 Update — Implementation Plan

Update `maa-prototype-v2.jsx` to match all recent spec changes, and scaffold a Vite+React dev environment so the prototype can be previewed in a browser.

**Code Review Checkpoints:**
- **Checkpoint 1:** After Tasks 1-2 (Dev environment setup + data/logic updates — verify the app renders and programs display correctly)
- **Checkpoint 2:** After Tasks 3-5 (New registration steps — walk through the full registration flow)
- **Final Review:** After Tasks 6-7 (Cart/admin updates — verify end-to-end flow including totals and mock data)

---

## Tasks

| # | Task | Description | Model |
|---|------|-------------|-------|
| 1 | [Vite+React scaffolding](#task-1-vitereact-scaffolding) | Create minimal Vite project that wraps the existing JSX prototype | sonnet |
| 2 | [Mock data, fees, and age logic](#task-2-mock-data-fees-and-age-logic) | Update SEASON data, hat sizes, age calculation, program tiers | sonnet |
| 3 | [Add Child modal + player middle name](#task-3-add-child-modal--player-middle-name) | Add optional middle name field to modal and player display | sonnet |
| 4 | [Guardian info + contact step](#task-4-guardian-info--contact-step) | Add Step 4: parent/guardian fields with radio toggle for primary contact | sonnet |
| 5 | [Add-ons + coaching/sponsorship steps](#task-5-add-ons--coachingsponsorship-steps) | Add Step 5 add-ons (digital picture, extra hat) and Step 6 (coaching/sponsorship interest) | sonnet |
| 6 | [Review step + cart updates](#task-6-review-step--cart-updates) | Update review summary with all new fields; update cart to show add-on breakdown and correct totals | sonnet |
| 7 | [Admin dashboard mock data](#task-7-admin-dashboard-mock-data) | Update REGS mock data to reflect new fees/fields; add new columns to admin table | sonnet |

---

## Task 1: Vite+React scaffolding

**Goal:** Create a minimal Vite+React project so the prototype can be previewed with `npm run dev`.

**Steps:**
1. Create `maa-prototype/` directory inside `/Users/josh/Code/maa/`
2. Create `package.json` with dependencies:
   - `react`, `react-dom` (^19)
   - `@vitejs/plugin-react`, `vite` as devDependencies
3. Create `vite.config.js` — basic React plugin config
4. Create `index.html` — root HTML with `<div id="root">` and script tag pointing to `src/main.jsx`
5. Create `src/main.jsx` — imports React, ReactDOM, renders `<App />` from `./App`
6. Copy `maa-prototype-v2.jsx` content into `src/App.jsx` (this becomes the working file for all subsequent tasks)

**No changes to the JSX content in this task** — just get it rendering.

**Verify:** `cd maa-prototype && npm install && npm run dev` opens the prototype in a browser.

---

## Task 2: Mock data, fees, and age logic

**Goal:** Update all mock data constants and the age calculation/recommendation logic to match the spec.

**Changes to `src/App.jsx`:**

1. **SEASON programs — update fees and cutoff dates:**
   ```
   T-Ball:      fee 65, cutoff null (remove "2026-05-01")
   T-Shirt:     fee 65, cutoff null (remove "2026-05-01")
   8U Baseball:  fee 80 (was 85)
   10U Baseball: fee 80 (was 95)
   12U Baseball: fee 80 (was 95)
   8U Softball:  fee 80 (was 85)
   10U Softball: fee 80 (was 95)
   12U Softball: fee 80 (was 95)
   ```

2. **HATS constant:** Change from `["S/M","L/XL"]` to `["XS/SM","SM/M","L/XL"]`

3. **`age()` function — update to handle optional cutoff:**
   ```js
   function age(dob, cutoff) {
     const d = new Date(dob);
     const c = cutoff ? new Date(cutoff) : new Date(); // fallback to today
     let a = c.getFullYear() - d.getFullYear();
     if (d.getMonth() > c.getMonth() || (d.getMonth() === c.getMonth() && d.getDate() > c.getDate())) a--;
     return a;
   }
   ```

4. **`suggested()` function — rename to `recommended()`:**
   - Same logic: age in range AND gender matches (Coed or same gender)
   - Uses `age(p.dob, pr.cutoff)` which now handles null cutoff

5. **`eligible()` function — rename to `otherPrograms()`:**
   - Returns ALL programs NOT in the recommended list (no age filtering — all are selectable)
   - This replaces the old "other eligible" concept (which was age-gated)

6. **Step 2 (Program Selection) UI labels:**
   - Change "Suggested for {name}" → "Recommended for {name}"
   - Change `opt-sg` badge text from "Suggested" → "Recommended"
   - Change "Other eligible programs" → "Other Programs"
   - Remove "is {age} at cutoff" text. Replace with:
     - If cutoff exists: "{name} is {age} as of {cutoff date formatted}"
     - If no cutoff: "{name} is {age} years old"
   - Show cutoff date info on cards that have one: small note "Age as of May 1, 2026"

7. **Step 5 (Review) — update "Age at Cutoff" label:**
   - Change to "Age" (since cutoff is optional/informational)

---

## Task 3: Add Child modal + player middle name

**Goal:** Add optional middle name to the Add Child modal and player display throughout.

**Changes to `src/App.jsx`:**

1. **`INIT_PLAYERS` mock data** — add `middleName` field:
   ```
   Ethan: middleName: "James"
   Lily: middleName: ""  (empty — demonstrates optional)
   Owen: middleName: "Michael"
   ```

2. **`AddModal` component:**
   - Add `mn` (middle name) to form state, initialized to `""`
   - Add a "Middle Name" input field between First Name and Last Name
   - Change the grid layout: First Name and Middle Name on row 1, Last Name and Date of Birth on row 2, Gender full width (or keep 2-col with gender)
   - Actually simpler: keep the 2-col grid. Row 1: First Name, Middle Name. Row 2: Last Name, Gender. Row 3: Date of Birth (full width or half). Middle name is NOT required — do not add it to the `ok` validation check.
   - Pass `middleName: f.mn` in the `onAdd` call

3. **Player display — show middle name where names appear:**
   - Step 1 player list: `{p.firstName} {p.middleName ? p.middleName + ' ' : ''}{p.lastName}`
   - Step 5 (Review) Player row: same format
   - Cart items: same format
   - Create a small helper: `function fullName(p) { return [p.firstName, p.middleName, p.lastName].filter(Boolean).join(' '); }`

---

## Task 4: Guardian info + contact step

**Goal:** Add Step 4 (Parent/Guardian & Contact) to the registration flow. This is a new step between Program Selection and Sizes.

**Changes to `src/App.jsx`:**

1. **Mock guardian data on a "current user" object** (add near other constants):
   ```js
   const CURRENT_USER = {
     firstName: "Sarah", lastName: "Carter", phone: "(555) 867-5309",
     secondaryGuardian: { firstName: "John", lastName: "Carter", phone: "(555) 555-1234" }
   };
   ```

2. **RegPage state — add new state variables:**
   ```js
   const [guardian, setGuardian] = useState({
     primary: { firstName: "", lastName: "", phone: "" },
     secondary: { firstName: "", lastName: "", phone: "" },
     hasSecondary: false,
     primaryContact: "" // "primary" or "secondary"
   });
   ```
   - On mount (or when step transitions to 4), pre-fill from `CURRENT_USER`

3. **Step labels array** — update from:
   ```
   ["Player","Program","Sizes","Waivers","Review"]
   ```
   to:
   ```
   ["Player","Program","Program","Guardian","Sizes","Interest","Waivers","Review"]
   ```
   Wait — the spec steps are:
   1. Player Selection
   2. Select Program
   3. *(no step 3 in old prototype — was sizes)*
   4. Parent/Guardian & Contact
   5. Hat & Jersey Size + Add-ons
   6. Coaching & Sponsorship Interest
   7. Waiver Acknowledgment
   8. Review & Add to Cart

   So the step labels should be:
   ```
   ["Player", "Program", "Guardian", "Sizes & Add-ons", "Interest", "Waivers", "Review"]
   ```
   That's 7 steps (combined sizes+add-ons into one label to keep the stepper manageable).

4. **Renumber all `step` checks** — shift existing steps 3, 4, 5 to accommodate new steps. New mapping:
   - Step 1: Player Selection (unchanged)
   - Step 2: Program Selection (unchanged)
   - Step 3: Guardian & Contact (NEW)
   - Step 4: Sizes & Add-ons (was step 3, will be expanded in Task 5)
   - Step 5: Coaching & Sponsorship (NEW — Task 5)
   - Step 6: Waivers (was step 4)
   - Step 7: Review (was step 5)

5. **New Step 3 UI — Guardian & Contact:**
   ```
   Card title: "Parent/Guardian & Contact"
   Subtitle: "Confirm contact information for this registration."

   Section: "Primary Guardian"
   - First Name, Last Name, Phone (pre-filled from CURRENT_USER, editable)
   - Use the existing .fr (form row) and .fc (form columns) CSS classes

   Section: "Secondary Guardian (Optional)"
   - Toggle/checkbox: "Add secondary guardian"
   - If toggled on: First Name, Last Name, Phone fields (pre-filled if CURRENT_USER has one)

   Section: "Primary Contact"
   - Radio toggle (use styled radio buttons similar to the .opt pattern):
     - "Primary Guardian — {phone}"
     - "Secondary Guardian — {phone}" (only if secondary exists)
   - Required — Continue button disabled until selected

   Back/Continue buttons
   ```

6. **Validation:** Continue button enabled when:
   - Primary guardian first name, last name, phone are all filled
   - Primary contact radio is selected

7. **Store guardian data** so it can be passed to the cart item in the submit function (Task 6 will wire this up).

---

## Task 5: Add-ons + coaching/sponsorship steps

**Goal:** Expand the sizes step to include add-ons, and add a new coaching/sponsorship step.

**Changes to `src/App.jsx`:**

1. **Step 4 (Sizes & Add-ons) — expand existing sizes step:**

   Keep existing hat/jersey size selectors. Add below them:

   ```
   Divider line or section header: "Optional Add-ons"

   Digital Picture — $10
   - Description: "Team and individual picture delivered via email"
   - Yes/No toggle (two styled buttons, similar to hat size buttons)
   - Default: No (not selected)

   Extra Hat — $30
   - Description: "Purchase one additional hat"
   - Yes/No toggle
   - If Yes: show hat size selector (XS/SM, SM/M, L/XL) — reuse same .sz button style
   - Default: No
   ```

2. **RegPage state — add new state variables:**
   ```js
   const [digitalPic, setDigitalPic] = useState(false);
   const [extraHat, setExtraHat] = useState(false);
   const [extraHatSize, setExtraHatSize] = useState("");
   const [coaching, setCoaching] = useState(""); // "Coach", "Assistant Coach", "Not Interested"
   const [sponsorship, setSponsorship] = useState(""); // "Yes", "No"
   ```

3. **Step 4 validation update:**
   - Still requires hat + jersey
   - If extraHat is true, extraHatSize must be selected
   - digitalPic doesn't need validation (it's a boolean)

4. **New Step 5 — Coaching & Sponsorship Interest:**
   ```
   Card title: "Coaching & Sponsorship"
   Subtitle: "Let us know if you're interested in helping out."

   Section: "Coaching Interest" (required)
   - Three options using the .opt (option card) pattern:
     - "Coach" — subtitle: "Lead a team as head coach"
     - "Assistant Coach" — subtitle: "Help out as an assistant"
     - "Not Interested" — subtitle: "Not at this time"
   - No default selected

   Section: "Sponsorship Interest" (required)
   - Two options using the .opt pattern:
     - "Yes, I'm interested" — subtitle: "We'll send you sponsorship information"
     - "No thanks"
   - No default selected

   Back/Continue buttons
   ```

5. **Step 5 validation:** Both coaching and sponsorship must be selected.

6. **Reset new state** in the `submit` function alongside existing resets.

---

## Task 6: Review step + cart updates

**Goal:** Update the review summary and cart to show all new fields with correct totals.

**Changes to `src/App.jsx`:**

1. **Fee calculation helper:**
   ```js
   function calcTotal(program, digitalPic, extraHat) {
     let total = program.fee;
     if (digitalPic) total += 10;
     if (extraHat) total += 30;
     return total;
   }
   ```

2. **Review step (Step 7) — update the summary table:**
   Add rows for all new fields:
   ```
   Player          | {fullName(pl)}
   Date of Birth   | {formatted DOB}
   Program         | {pr.name}
   Age             | {age} years old  [+ "as of {cutoff}" if cutoff exists]
   Primary Guardian| {guardian first last} — {phone}
   Secondary Guardian | {if exists: name — phone, else "—"}
   Primary Contact | {selected phone}
   Hat Size        | {hat}
   Jersey Size     | {jersey}
   Digital Picture | Yes (+$10) / No
   Extra Hat       | {size} (+$30) / No
   Coaching        | {selection}
   Sponsorship     | {selection}
   Waivers         | {comma-separated titles}
   ─────────────────────────────
   Program Fee     | ${pr.fee}.00
   Digital Picture | +$10.00  (only if yes)
   Extra Hat       | +$30.00  (only if yes)
   Total           | ${total}.00  (bold, gold styling)
   ```

3. **`submit()` function — update cart item shape:**
   ```js
   addToCart({
     id: `c-${Date.now()}`,
     player: pl,
     program: pr,
     hat, jersey: jer,
     guardian,           // full guardian object
     digitalPicture: digitalPic,
     extraHat: extraHat ? { size: extraHatSize } : null,
     coaching,
     sponsorship,
     total: calcTotal(pr, digitalPic, extraHat)
   });
   ```

4. **CartPage — update to use item.total:**
   - Change `i.program.fee` references to `i.total`
   - Update line item display to show breakdown:
     ```
     {playerName}
     {programName} · Hat: {hat} · Jersey: {jersey}
     {if digitalPicture: "+ Digital Picture"}
     {if extraHat: "+ Extra Hat ({size})"}
     ```
   - Total line: sum of all `i.total`

5. **Reset all new state variables** in the submit function: `setDigitalPic(false)`, `setExtraHat(false)`, `setExtraHatSize("")`, `setCoaching("")`, `setSponsorship("")`, reset guardian to pre-filled defaults.

---

## Task 7: Admin dashboard mock data

**Goal:** Update mock registration data and admin table to reflect all changes.

**Changes to `src/App.jsx`:**

1. **Update `REGS` mock data:**
   - Update all fees to match new pricing ($65 for T-Ball/T-Shirt, $80 for all others)
   - Update hat sizes from "S/M"/"L/XL" to "XS/SM"/"SM/M"/"L/XL"
   - Add new fields to each mock registration:
     ```js
     {
       ...existing fields,
       digitalPic: true/false,        // mix of yes/no
       extraHat: "SM/M" or null,      // some have it, some don't
       coaching: "Not Interested",     // vary across registrations
       sponsorship: "No",             // vary across registrations
       guardian: "Sarah Carter",       // primary guardian name
       guardianPhone: "(555) 867-5309",
       total: 80                       // calculated: fee + add-ons
     }
     ```

2. **Admin dashboard table — add columns:**
   - Add columns after Jersey: "Pic", "Extra Hat", "Coaching", "Total"
   - "Pic" column: show checkmark icon or "—"
   - "Extra Hat" column: show size or "—"
   - "Coaching" column: show value
   - "Total" column: show fee with add-on total
   - Keep table readable — use abbreviated headers and compact display

3. **Stat boxes — update fees in any displayed totals** (these reference SEASON.programs which were already updated in Task 2, so the stat counts should work as-is. Just verify no hardcoded fee values.)

---

## Execution

Choose your preferred execution approach:

- **Subagent-Driven:** Fresh subagent per task group (checkpoint) + code review at each checkpoint
  - Checkpoint 1: Tasks 1-2 (scaffolding + data/logic)
  - Checkpoint 2: Tasks 3-5 (new registration steps)
  - Final: Tasks 6-7 (cart/admin updates)

- **Parallel Session:** Batch execution with checkpoint-based review
