# MAA Sports Registration Platform — Claude Code Specification

## Overview

Build a full-stack web application for **Meadow Athletic Association (MAA)** to manage youth recreational sports registration. This replaces an existing NBC SportsEngine workflow. The application is a **proof of concept** running locally in Docker.

The system supports three seasonal registration periods per year (Spring, Fall, Winter), each containing multiple sports with age-group divisions. Parents/guardians register children, acknowledge waivers, and (eventually) pay online. Admins manage seasons, sports configuration, and registration data exports.

---

## Tech Stack

### Backend API
- **Framework:** ASP.NET Core 10.0
- **Language:** C# 12 (nullable reference types enabled)
- **Database:** MongoDB 8.0
- **ODM:** MongoDB.Driver (official C# driver)
- **Authentication:** Auth0 JWT Bearer tokens
- **Authorization:** Role-based, stored on the user's MongoDB document
- **Logging:** Serilog (Console + Seq sinks)
- **Testing:** xUnit, Moq, FluentAssertions
- **API Docs:** Scalar (development mode only)
- **Containerization:** Docker and Docker Compose

### Frontend
- **Framework:** React 19.1
- **Language:** TypeScript 5.9 (strict mode)
- **Build Tool:** Vite 7.1
- **UI Library:** Ant Design 5.28
- **Routing:** React Router 7.9
- **Authentication:** Auth0 React SDK (`@auth0/auth0-react` 2.8)
- **Styling:** SASS/SCSS modules
- **HTTP Client:** Axios (or fetch — your preference, be consistent)

### Infrastructure (Local PoC)
- **Repositories:** Separate GitHub repos:
  - `maa-api` — Backend API (.NET solution)
  - `maa-web` — Frontend (React/Vite app, runs separately via `npm run dev`)
  - `maa-infra` — (future) Infrastructure as code
- **Docker Compose** (lives in the `maa-api` repo) orchestrating:
  - `maa-api` — ASP.NET Core API
  - `mongo` — MongoDB 8.0
  - `seq` — Seq log viewer (development)
- **Frontend** runs separately via `npm run dev` (not in Docker Compose). This matches the developer's existing project conventions.
- Auth0 tenant configured externally (not containerized)

---

## User Roles & Authorization

### Roles
| Role | Description |
|------|-------------|
| **Admin** | Full access. Create/edit/delete seasons and programs. View all registrations, export CSV. Manage waivers. |
| **Registrar** | Read-only access to registration data. Can view sign-up counts, search registrations, and export to CSV. Cannot create/modify seasons or programs. |
| *(Authenticated, no role)* | Parent/Guardian. Can register children, view their own profile and registration history, manage their household. |
| *(Unauthenticated)* | Can browse all public pages (Home, About, Fields, Sponsors). Redirected to Auth0 login to register or access any authenticated feature. |

### Implementation
- Auth0 handles authentication (login, signup, JWT issuance).
- Upon first login, create a `User` document in MongoDB linked by `auth0Id` (the `sub` claim).
- Roles are stored on the MongoDB `User` document as a `UserRole[]` enum array (e.g., `[UserRole.Admin]`). `UserRole` is a C# enum with string serialization.
- API authorization: custom middleware or policy-based authorization that reads roles from the user's MongoDB document (not from Auth0 tokens/claims — keep Auth0 simple, keep role management in your own DB).
- Frontend: after login, fetch the user profile from the API (which includes roles) and use it to conditionally render admin/registrar UI.

---

## Domain Model (MongoDB Collections)

### User
```
{
  _id: string (GUID),
  auth0Id: string,              // Auth0 "sub" claim
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  address: {
    street: string,
    city: string,
    state: string,
    zip: string
  },
  secondaryGuardian: {          // optional
    firstName: string,
    lastName: string,
    phone: string
  },
  roles: UserRole[],            // enum: Admin, Registrar (serialized as strings)
  players: [                    // children in this household
    {
      _id: string (GUID),
      firstName: string,
      middleName: string,       // optional
      lastName: string,
      dateOfBirth: Date,        // stored as full date; displayed as Month/Year only in UI
      gender: Gender            // enum: Male, Female (serialized as string)
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Season
```
{
  _id: string (GUID),
  name: string,                 // e.g., "2026 Spring Sports"
  seasonType: SeasonType,       // enum: Spring, Fall, Winter (serialized as string)
  year: number,
  registrationOpenDate: Date,
  registrationCloseDate: Date,
  isActive: boolean,            // only one season active at a time for registration
  programs: [                   // FLAT list — each entry is one registerable option
    {
      _id: string (GUID),
      name: string,             // e.g., "8U Baseball", "T-Ball", "10U Softball"
      gender: Gender,           // enum: Male, Female, Coed (serialized as string) — SUGGESTION filter, not hard gate
      ageAsOfDate: Date?,        // optional — the date used to calculate a player's age for program eligibility; if not set, today's date is used
      minAge: number,           // inclusive
      maxAge: number,           // inclusive
      fee: number               // in dollars, e.g., 85.00
    }
  ],
  waivers: [
    {
      _id: string (GUID),
      title: string,            // e.g., "Liability Waiver"
      content: string,          // full text (markdown or plain text)
      isRequired: boolean
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Program model notes:**
- Each program is a single registerable unit (e.g., "8U Baseball" not "Baseball → 8U").
- Gender is a **soft filter**: the UI suggests programs matching the player's gender but does NOT prevent cross-gender registration (e.g., a girl can register for 8U Baseball).
- **`ageAsOfDate` is optional.** If set, it is used to calculate the player's age for recommendations AND displayed on the program card (e.g., "Age determined as of May 1, 2026"). If not set (e.g., T-Ball, T-Shirt), the player's age at registration time is used instead. Either way, it does NOT gate registration.
- **Age is a soft recommendation, not a hard gate.** Programs are displayed in tiers (Recommended vs. Other Programs) but parents can register for any program. Pre-season assessments handle borderline/edge cases.

### Registration
```
{
  _id: string (GUID),
  seasonId: string (GUID),
  userId: string (GUID),        // parent/guardian
  player: {                     // snapshot of player at registration time
    playerId: string (GUID),    // reference to User.players._id
    firstName: string,
    middleName: string,         // optional
    lastName: string,
    dateOfBirth: Date,
    gender: Gender              // enum snapshot
  },
  program: {                    // snapshot of program at registration time
    programId: string (GUID),
    name: string,               // e.g., "8U Baseball"
    fee: number
  },
  primaryGuardian: {            // snapshot from user profile
    firstName: string,
    lastName: string,
    phone: string
  },
  secondaryGuardian: {          // optional, snapshot from user profile
    firstName: string,
    lastName: string,
    phone: string
  },
  primaryContactPhone: string,  // selected via radio toggle — primary or secondary guardian's phone
  hatSize: string,              // e.g., "XS/SM", "SM/M", "L/XL"
  jerseySize: string,           // e.g., "Youth M", "Adult L"
  digitalPicture: boolean,      // adds $10 to total if true
  extraHat: {                   // optional — adds $30 to total if present
    size: string                // "XS/SM", "SM/M", or "L/XL"
  },
  coachingInterest: CoachingInterest,  // enum: Coach, AssistantCoach, NotInterested — required
  sponsorshipInterest: boolean, // required
  waiverAcknowledgments: [
    {
      waiverId: string (GUID),
      title: string,
      acknowledgedAt: Date
    }
  ],
  paymentStatus: PaymentStatus, // enum: Pending, Completed, Waived — "Pending" for PoC
  registeredAt: Date,
  notes: string                 // optional admin notes
}
```

### C# Enums (string-serialized in MongoDB)
```csharp
public enum Gender { Male, Female, Coed }      // Coed used on programs only
public enum SeasonType { Spring, Fall, Winter }
public enum PaymentStatus { Pending, Completed, Waived }
public enum UserRole { Admin, Registrar }
public enum CoachingInterest { Coach, AssistantCoach, NotInterested }
```
All enums should be serialized as strings in MongoDB (not integers) for readability and forward compatibility. Configure via `BsonRepresentation(BsonType.String)` or a global convention.

### Design Notes
- **IDs:** All `_id` fields use .NET `Guid` (stored as strings in MongoDB), not ObjectId. Generate with `Guid.NewGuid()`.
- **Snapshots:** Registration documents snapshot the player and program data at registration time. This preserves historical accuracy if season config changes later.
- **Players are embedded in User:** Keeps the parent-child relationship simple. A household with 3 kids has 3 entries in the `players` array.
- **Programs are embedded in Season:** Each program (e.g., "8U Baseball") is a single flat entry. No nesting of sports → age groups. Seasons are self-contained. Copying program config from a previous season is an admin feature (clone season).
- **Gender and age are both soft filters:** The UI recommends programs matching the player's gender and age range, but allows registration for any program. Pre-season assessments handle borderline cases for skill evaluation and fair team composition.
- **Hat/Jersey sizes:** Collected per registration (not per player) since sizing may change season to season. Stored as plain strings (not enums) since size options may evolve without requiring a code change. Available sizes are configurable per season but defaults are: Hat: XS/SM, SM/M, L/XL. Jersey: Youth S, Youth M, Youth L, Youth XL, Adult S, Adult M, Adult L, Adult XL.
- **Parent/guardian info:** Primary guardian (first name, last name, phone) is stored on the User profile and snapshotted onto each Registration. Secondary guardian is optional, also stored on profile for easy re-use. A `primaryContactPhone` field on the registration captures which guardian's phone is the primary contact (selected via radio toggle).
- **Registration add-ons:** Digital picture ($10) and extra hat ($30) are optional per-registration add-ons. Their costs are rolled into the registration total, not separate cart line items. The registration summary shows the breakdown (e.g., "8U Baseball $80 + Digital Picture $10 + Extra Hat $30 = $120").
- **Coaching/sponsorship interest:** Collected per registration. Coaching interest (Coach, Assistant Coach, Not Interested) and sponsorship interest (Yes/No) are both required with no default selection.
- **Player middle name:** Optional field on the player model. Displayed where player names appear but not required.
- **Cart persistence:** The cart is stored in `localStorage` so it survives browser refreshes and accidental tab closures. The cart context hydrates from `localStorage` on mount and syncs on every change.
- **DOB display:** Player date of birth is stored as a full date (needed for precise age calculation). **Parent/guardian-facing UI shows the full date** (e.g., "6/15/2016") — registration flow, profile, cart. **Admin/registrar-facing UI shows Month/Year only** (e.g., "Jun 2016") — registration dashboard, CSV export. Admins don't need the exact day; parents see it for verification.
- **Age calculation:** `playerAge = ageAsOfDate.Year - player.dateOfBirth.Year`, adjusted if the player hasn't had their birthday yet by the as-of date. The API should auto-determine eligibility based on the player's age as of the program's `ageAsOfDate`.

---

## Core Features & User Flows

### 1. Public Pages

**Home Page**
- MAA branding, hero section with association name and mission statement.
- Current/upcoming season callout with "Register Now" CTA → redirects to Auth0 login if unauthenticated.
- If no season is currently open for registration, show "Registration is currently closed" with info about the next season if available.
- Grid of available programs for the active season.

**About Us Page**
- Association history and mission.
- Board of directors listing (name + role).
- Contact information and physical address.

**Field Rentals Page**
- List of fields with descriptions and availability.
- Rental rates (2-hour, half-day, full-day, tournament).
- Contact information for reservations.

**Sponsorship Info Page**
- Why sponsor MAA.
- Sponsorship tiers (Bronze, Gold, Platinum) with benefits and pricing.
- Contact information for sponsorship inquiries.

### 2. Parent/Guardian Registration Flow

**Step 1: Profile Setup (first-time only)**
- After first login, prompt user to complete their profile: name, phone, address.
- Optionally add a secondary guardian (first name, last name, phone).
- Prompt to add at least one player (child): first name, optional middle name, last name, date of birth, gender.
- Users can manage players and guardian info from their profile at any time.

**Step 2: Player Selection**
- If the user has multiple players, select which player to register.
- Include an "Add Child" button inline so first-time users (or users with a new child) can add a player without leaving the registration flow.
- Adding a child requires: first name, last name, date of birth, gender. Middle name is optional.

**Step 3: Select Program**
- Show the currently active season.
- For each program, calculate the player's age using `ageAsOfDate` if set, otherwise use today's date.
- Display programs in two tiers:
  - **Recommended:** Programs where the player's calculated age falls within `minAge`–`maxAge` and matches the player's gender. These are the 1-2 most appropriate options (e.g., a 4-year-old sees T-Ball and T-Shirt; an 8-year-old sees 8U and 10U).
  - **Other Programs:** All remaining programs in the season. Shown below under a separate header. Parents can still register for these (e.g., playing up an age group, cross-gender registration).
- Gender and age are both **soft filters** — used for recommendations only, not hard gates. Pre-season assessments handle borderline cases.
- If a program has an `ageAsOfDate`, display it on the program card as informational context (e.g., "Age determined as of May 1, 2026").

**Step 4: Parent/Guardian & Contact**
- Pre-fill primary guardian info (first name, last name, phone) from user profile.
- Show secondary guardian info if on profile; allow editing or adding inline.
- Radio toggle to select primary contact phone (primary or secondary guardian). Required.

**Step 5: Hat & Jersey Size + Add-ons**
- Select hat size: XS/SM, SM/M, or L/XL. Required.
- Select jersey size: Youth S, Youth M, Youth L, Youth XL, Adult S, Adult M, Adult L, Adult XL. Required.
- Digital picture: Yes/No. If yes, adds $10 to registration total. Includes team and individual picture delivered via email.
- Extra hat: optional. If yes, select size (XS/SM, SM/M, L/XL). Adds $30 to registration total. Limited to one extra hat per registration.

**Step 6: Coaching & Sponsorship Interest**
- Coaching interest: Coach, Assistant Coach, or Not Interested. Required, no default.
- Sponsorship interest: Yes or No. Required, no default.

**Step 7: Waiver Acknowledgment**
- Display each required waiver. User must check/acknowledge each one.
- Record the acknowledgment timestamp.

**Step 8: Review & Add to Cart**
- Show summary: player name, program, guardian info, primary contact, hat size, jersey size, add-ons (digital picture, extra hat), coaching/sponsorship interest, total fee (base + add-ons), waivers acknowledged.
- "Add to Cart" → adds this registration to the cart.
- User can then "Register Another Player" (back to Step 2) or proceed to checkout.

**Step 9: Cart & Checkout**
- Show all items in cart with line items and total.
- Allow removing items from cart.
- **Cart persists in localStorage** so it survives browser refresh / accidental close.
- "Complete Registration" button.
- **For PoC:** Payment is deferred. Mark `paymentStatus` as `"Pending"`. Show a confirmation message: "Your registration has been submitted. Payment details will be communicated separately."
- Future: integrate PayPal / Stripe / etc.

**Step 10: Confirmation**
- Show registration confirmation with summary.
- Send confirmation email (future — out of scope for PoC, but structure the code so this is easy to add).

### 3. User Profile / Dashboard
- View/edit profile information.
- Manage players (add/edit/remove children).
- View registration history across seasons.
- View current cart (if registration is in progress).

### 4. Admin Features

**Season Management**
- CRUD for seasons.
- Clone a previous season as a starting point (copies programs, fees, waivers).
- Set registration open/close dates.
- Activate/deactivate a season for registration.

**Program Configuration**
- Add/edit/remove programs within a season.
- Configure gender (suggestion filter), age-as-of date, min/max age, and fee per program.

**Waiver Management**
- Add/edit/remove waivers per season.
- Mark waivers as required or optional.

**Registration Dashboard**
- View all registrations for the active season.
- Filter by program, payment status.
- **Summary stat boxes:** Total registrations count, plus one box per program showing registration count for that program.
- Search registrations by player name or parent name.
- Export registrations to CSV (the primary output — this is what gets loaded into spreadsheets for team formation).
- CSV includes: hat size, jersey size columns.

### 5. Registrar Features
- Same as Admin Registration Dashboard, but read-only.
- Can view counts, search, filter, and export CSV.
- Cannot access Season Management, Program Configuration, or Waiver Management.

---

## API Endpoints

### Auth / User
| Method | Route | Auth | Roles | Description |
|--------|-------|------|-------|-------------|
| GET | `/api/users/me` | ✅ | Any | Get current user profile (creates user doc on first call if needed) |
| PUT | `/api/users/me` | ✅ | Any | Update profile (name, phone, address) |
| POST | `/api/users/me/players` | ✅ | Any | Add a player to household |
| PUT | `/api/users/me/players/{playerId}` | ✅ | Any | Update a player |
| DELETE | `/api/users/me/players/{playerId}` | ✅ | Any | Remove a player |

### Seasons
| Method | Route | Auth | Roles | Description |
|--------|-------|------|-------|-------------|
| GET | `/api/seasons` | No | — | List seasons (public: returns active/upcoming only; admin: returns all) |
| GET | `/api/seasons/{id}` | No | — | Get season details including programs, waivers |
| POST | `/api/seasons` | ✅ | Admin | Create a season |
| PUT | `/api/seasons/{id}` | ✅ | Admin | Update a season |
| DELETE | `/api/seasons/{id}` | ✅ | Admin | Delete a season (soft delete or prevent if registrations exist) |
| POST | `/api/seasons/{id}/clone` | ✅ | Admin | Clone a season (copies config, new dates) |

### Registration
| Method | Route | Auth | Roles | Description |
|--------|-------|------|-------|-------------|
| POST | `/api/registrations` | ✅ | Any | Create a registration (validates age eligibility, records waivers, hat/jersey size) |
| GET | `/api/registrations/mine` | ✅ | Any | Get current user's registrations |
| DELETE | `/api/registrations/{id}` | ✅ | Any | Cancel a registration (only if not yet paid / within window) |
| GET | `/api/registrations` | ✅ | Admin, Registrar | List all registrations (with filters) |
| GET | `/api/registrations/export` | ✅ | Admin, Registrar | Export registrations to CSV |
| GET | `/api/registrations/stats` | ✅ | Admin, Registrar | Get registration counts by program |

### Cart (Client-Side with localStorage Persistence)
- The cart is client-side state managed via React Context.
- **Persisted to `localStorage`** so it survives browser refresh, accidental tab/window closure.
- CartContext hydrates from `localStorage` on mount, syncs to `localStorage` on every state change.
- When the user clicks "Complete Registration," the frontend sends one `POST /api/registrations` per cart item (or a batch endpoint `POST /api/registrations/batch` that accepts an array).
- On successful submission, clear the cart from both state and `localStorage`.

---

## Program Configuration Reference

This is the real-world MAA configuration. Use this as seed data and for testing. Each row is one program entry in the season.

### Spring Programs
| Program Name | Gender | Age As-Of Date | Min Age | Max Age | Fee |
|-------------|--------|-----------------|---------|---------|-----|
| T-Ball | Coed | — | 3 | 4 | $65 |
| T-Shirt | Coed | — | 5 | 6 | $65 |
| 8U Baseball | Male | May 1 of season year | 7 | 8 | $80 |
| 10U Baseball | Male | May 1 of season year | 9 | 10 | $80 |
| 12U Baseball | Male | May 1 of season year | 11 | 12 | $80 |
| 8U Softball | Female | Jan 1 of season year | 7 | 8 | $80 |
| 10U Softball | Female | Jan 1 of season year | 9 | 10 | $80 |
| 12U Softball | Female | Jan 1 of season year | 11 | 12 | $80 |

### Fall Programs
| Program Name | Gender | Age As-Of Date | Min Age | Max Age | Fee |
|-------------|--------|-----------------|---------|---------|-----|
| 8U Baseball | Male | May 1 of season year | 7 | 8 | $80 |
| 10U Baseball | Male | May 1 of season year | 9 | 10 | $80 |
| 12U Baseball | Male | May 1 of season year | 11 | 12 | $80 |
| 8U Softball | Female | Jan 1 of season year | 7 | 8 | $80 |
| 10U Softball | Female | Jan 1 of season year | 9 | 10 | $80 |
| 12U Softball | Female | Jan 1 of season year | 11 | 12 | $80 |
| 6U Soccer | Coed | Jan 1 of season year | 5 | 6 | $75 |

### Winter Programs
| Program Name | Gender | Age As-Of Date | Min Age | Max Age | Fee |
|-------------|--------|-----------------|---------|---------|-----|
| 6U Basketball | Coed | Jan 1 of season year | 5 | 6 | $75 |
| 8U Boys Basketball | Male | Jan 1 of season year | 7 | 8 | $75 |
| 10U Boys Basketball | Male | Jan 1 of season year | 9 | 10 | $75 |
| 12U Boys Basketball | Male | Jan 1 of season year | 11 | 12 | $75 |
| 15U Boys Basketball | Male | Jan 1 of season year | 13 | 15 | $75 |
| 8U Girls Basketball | Female | Jan 1 of season year | 7 | 8 | $75 |
| 10U Girls Basketball | Female | Jan 1 of season year | 9 | 10 | $75 |
| 12U Girls Basketball | Female | Jan 1 of season year | 11 | 12 | $75 |

### Age Calculation & Program Recommendation Logic
```
Given: player DOB, program ageAsOfDate (optional)

referenceDate = ageAsOfDate ?? today
playerAge = referenceDate.Year - dob.Year
if (dob.Month > referenceDate.Month || (dob.Month == referenceDate.Month && dob.Day > referenceDate.Day))
    playerAge -= 1

Recommended if: minAge <= playerAge <= maxAge (and gender matches)
Other Programs: everything else in the season
```
- If `ageAsOfDate` is set on a program, use it as the reference date for age calculation. If not set, use the registration date (today).
- `ageAsOfDate`, when present, is also displayed on the program card as informational context.
- No hard gate — parents can register for any program. Pre-season assessments evaluate borderline players for skill and fair team composition.

---

## Project Structure

### Backend (`/src/Maa.Api`)
```
Maa.Api/
├── Controllers/
│   ├── UsersController.cs
│   ├── SeasonsController.cs
│   └── RegistrationsController.cs
├── Models/
│   ├── User.cs
│   ├── Player.cs
│   ├── Season.cs
│   ├── Program.cs
│   ├── Waiver.cs
│   └── Registration.cs
├── Services/
│   ├── UserService.cs
│   ├── SeasonService.cs
│   ├── RegistrationService.cs
│   └── AgeCalculationService.cs
├── DTOs/
│   ├── Requests/
│   └── Responses/
├── Infrastructure/
│   ├── MongoDbContext.cs
│   ├── Auth/
│   │   ├── RoleAuthorizationHandler.cs
│   │   └── RoleRequirement.cs
│   └── Middleware/
│       └── UserSyncMiddleware.cs    // auto-creates user doc on first API call
├── Configuration/
│   ├── MongoDbSettings.cs
│   └── Auth0Settings.cs
├── appsettings.json
├── appsettings.Development.json
├── Program.cs
└── Dockerfile
```

### Frontend (`/src/maa-web`)
```
maa-web/
├── public/
├── src/
│   ├── api/
│   │   ├── client.ts               // axios instance with auth interceptor
│   │   ├── seasons.ts
│   │   ├── registrations.ts
│   │   └── users.ts
│   ├── auth/
│   │   ├── Auth0Provider.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── useAuth.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── registration/
│   │   │   ├── PlayerSelector.tsx
│   │   │   ├── ProgramSelector.tsx
│   │   │   ├── SizeSelector.tsx
│   │   │   ├── WaiverAcknowledgment.tsx
│   │   │   ├── RegistrationSummary.tsx
│   │   │   ├── AddChildModal.tsx
│   │   │   └── Cart.tsx
│   │   ├── admin/
│   │   │   ├── SeasonManager.tsx
│   │   │   ├── ProgramEditor.tsx
│   │   │   ├── WaiverEditor.tsx
│   │   │   └── RegistrationDashboard.tsx
│   │   └── profile/
│   │       ├── ProfileForm.tsx
│   │       └── PlayerManager.tsx
│   ├── context/
│   │   ├── CartContext.tsx           // persists to localStorage
│   │   └── UserContext.tsx
│   ├── hooks/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── FieldRentalsPage.tsx
│   │   ├── SponsorsPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── CartPage.tsx
│   │   ├── ConfirmationPage.tsx
│   │   └── admin/
│   │       ├── SeasonsPage.tsx
│   │       └── DashboardPage.tsx
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── Dockerfile
```

### Root
```
maa-sports-registration/
├── src/
│   ├── Maa.Api/
│   └── maa-web/
├── docker-compose.yml
├── docker-compose.override.yml     // dev overrides (ports, volumes)
├── .env.example
└── README.md
```

---

## Docker Compose

```yaml
services:
  maa-api:
    build:
      context: ./src/Maa.Api
      dockerfile: Dockerfile
    ports:
      - "5100:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - MongoDB__ConnectionString=mongodb://mongo:27017
      - MongoDB__DatabaseName=maa
      - Auth0__Domain=${AUTH0_DOMAIN}
      - Auth0__Audience=${AUTH0_AUDIENCE}
      - Seq__ServerUrl=http://seq:5341
    depends_on:
      - mongo
      - seq

  maa-web:
    build:
      context: ./src/maa-web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5100
      - VITE_AUTH0_DOMAIN=${AUTH0_DOMAIN}
      - VITE_AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID}
      - VITE_AUTH0_AUDIENCE=${AUTH0_AUDIENCE}

  mongo:
    image: mongo:8.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  seq:
    image: datalust/seq:latest
    ports:
      - "5341:5341"
      - "8081:80"
    environment:
      - ACCEPT_EULA=Y

volumes:
  mongo-data:
```

---

## Key Implementation Details

### Auth0 Integration
- **API:** Validate JWT Bearer tokens. Use `Microsoft.AspNetCore.Authentication.JwtBearer`. Configure with Auth0 domain and audience.
- **Frontend:** Use `@auth0/auth0-react`. Wrap app in `Auth0Provider`. Use `useAuth0()` hook for login/logout/token. Attach token to API requests via axios interceptor.
- **User sync:** On first authenticated API call, if no user document exists for the `sub` claim, create one with email from the token claims. This is the `UserSyncMiddleware`.

### Age Calculation Service
- Centralize age calculation logic in `AgeCalculationService`.
- Given a player DOB and a reference date (program's `ageAsOfDate` if set, otherwise today), calculate the player's age and determine which program(s) to recommend.
- Used in the UI to sort programs into "Recommended" vs. "Other Programs" tiers. No hard validation — any program can be selected.

### CSV Export
- Use `CsvHelper` NuGet package.
- Export columns: Player First Name, Player Middle Name, Player Last Name, Player DOB (Month/Year only), Player Age (as of date), Player Gender, Program, Hat Size, Jersey Size, Digital Picture, Extra Hat Size, Primary Guardian Name, Primary Guardian Phone, Secondary Guardian Name, Secondary Guardian Phone, Primary Contact Phone, Coaching Interest, Sponsorship Interest, Parent Email, Registration Date, Payment Status, Total Fee.
- Filterable by program before export.

### Validation Rules
- A player cannot be registered for the same program in the same season twice.
- Age range is a recommendation, not a hard gate. Any program can be selected regardless of age.
- Gender is NOT validated server-side — it is a UI suggestion only. A girl can register for 8U Baseball.
- All required waivers must be acknowledged.
- Hat size and jersey size are required.
- Primary guardian info and primary contact phone are required.
- Coaching interest and sponsorship interest are required.
- Registration is only possible when the season's registration window is open.

---

## Seed Data

On first run (or via an admin API endpoint / CLI command), seed the database with:
1. A "2026 Spring Sports" season with the 8 programs from the configuration reference above.
2. Sample waivers: "Liability Waiver" and "Code of Conduct".
3. Registration dates: open now, close 30 days from now (for testing).

---

## Out of Scope for PoC
- Payment processing (structure the code for future integration)
- Email notifications
- Team/roster management. We will not build this.
- Reporting beyond basic counts and CSV export
- Mobile-responsive design (nice to have, not required)
- CI/CD pipeline
- Cloud deployment (AWS)
- Password reset / account management (handled by Auth0)

---

## Build Strategy

### Phase 0: Frontend Prototype (GitHub Pages)
Before building the full stack, deploy a standalone frontend prototype for stakeholder feedback.

- **Repo:** Separate repo (e.g., `maa-prototype`)
- **Stack:** Vite + React + TypeScript + Ant Design (same frontend stack as the full app)
- **Data:** All mock data, no API calls. Hardcode seasons, programs, and sample registrations.
- **Hosting:** GitHub Pages (Vite builds to static files, simple to deploy)
- **Goal:** Clickable prototype that board members can access from any browser to validate the UX and provide feedback before investing in backend/database work.
- **Scope:** All public pages (Home, About, Fields, Sponsors), full registration flow with mock data, cart, admin dashboard with mock registrations. Auth is simulated (fake logged-in user).
- **When done:** Collect feedback, iterate on UX, then decide whether to proceed with the full stack.

### Phase 1: Infrastructure & Foundation
- Initialize the full-stack repo with the project structure described above.
- Docker Compose: MongoDB, Seq, API container, frontend dev container.
- Backend scaffolding: `Program.cs`, `appsettings.json`, MongoDB connection, Serilog + Seq.
- MongoDB models: `User`, `Season` (with embedded `Program` and `Waiver`), `Registration`.
- Verify: `docker compose up` starts all services, API responds to a health check endpoint, Seq receives logs.

### Phase 2: Authentication & User Management
- Auth0 tenant setup (done manually before this phase):
  - SPA Application (for React frontend)
  - API (for backend JWT validation)
  - Localhost callback/logout URLs configured
- Backend: JWT Bearer authentication middleware, Auth0 configuration.
- Backend: `UserSyncMiddleware` — auto-creates user document on first authenticated API call.
- Backend: Role-based authorization policies (Admin, Registrar).
- Backend: `UsersController` — GET/PUT `/api/users/me`, CRUD for players.
- Frontend: Auth0Provider, ProtectedRoute, useAuth hook, axios interceptor for JWT.
- Frontend: Login/logout flow, user profile page, player management (add/edit/remove children).
- Verify: Can log in via Auth0, API creates user doc, can add/edit players.

### Phase 3: Season & Program Management (Admin)
- Backend: `SeasonsController` — full CRUD, clone endpoint.
- Backend: `SeasonService` — program and waiver management within a season.
- Frontend: Admin season management page — create, edit, clone, activate/deactivate.
- Frontend: Program editor — add/edit/remove programs with gender, age-as-of date, age range, fee.
- Frontend: Waiver editor — add/edit/remove waivers.
- Seed data: "2026 Spring Sports" with all 8 programs and 2 waivers.
- Verify: Can create a season, add programs, activate it. Seed data loads on first run.

### Phase 4: Registration Flow (Core Feature)
- Backend: `RegistrationsController` — create, list mine, cancel.
- Backend: `RegistrationService` — age calculation, eligibility validation, duplicate prevention.
- Backend: `AgeCalculationService` — shared age-as-of-date logic.
- Frontend: Full registration wizard — player selection (with Add Child inline), program selection (suggested vs. other eligible), hat/jersey sizing, waiver acknowledgment, review, add to cart.
- Frontend: CartContext with `localStorage` persistence.
- Frontend: Cart page — view items, remove, complete registration (batch POST to API).
- Frontend: Confirmation page.
- Verify: Can register a player end-to-end, cart persists across refresh, registration saved to MongoDB.

### Phase 5: Admin Dashboard & Export
- Backend: `GET /api/registrations` with filters (program, status, search).
- Backend: `GET /api/registrations/stats` — counts by program.
- Backend: `GET /api/registrations/export` — CSV download with CsvHelper.
- Frontend: Registration dashboard — stat boxes (total + per-program counts), filterable table, search, CSV export button.
- Frontend: Registrar role — same dashboard, read-only (no season management nav).
- Verify: Dashboard shows real registrations, filters work, CSV downloads correctly with all columns including hat/jersey sizes.

### Phase 6: Content Pages & Polish
- Frontend: Home page (hero, season callout, program grid).
- Frontend: About Us, Field Rentals, Sponsorship Info pages.
- Frontend: Responsive design pass (mobile-friendly is nice-to-have but worth a pass).
- Frontend: Error handling, loading states, empty states.
- General cleanup, README documentation.

### Build Principles
- **Work incrementally.** Each phase should be testable before moving to the next.
- **Reference existing projects.** Follow the patterns, conventions, and code style from the developer's existing .NET and React projects.
- **Prioritize the registration flow.** That's the core value prop — everything else supports it.
- **Keep the frontend prototype in sync.** As the real app takes shape, the prototype repo can be archived.
