This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

<div align="center">

<br />

```
███████╗███████╗ █████╗ ██╗  ████████╗██╗  ██╗██╗   ██╗
╚══███╔╝██╔════╝██╔══██╗██║  ╚══██╔══╝██║  ██║╚██╗ ██╔╝
  ███╔╝ █████╗  ███████║██║     ██║   ███████║ ╚████╔╝
 ███╔╝  ██╔══╝  ██╔══██║██║     ██║   ██╔══██║  ╚██╔╝
███████╗███████╗██║  ██║███████╗██║   ██║  ██║   ██║
╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝  ╚═╝   ╚═╝
```

### Mini Electronic Medical Records System + Patient Portal

<br />

[![Next.js](https://img.shields.io/badge/Next.js-14.0-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

<br />

**[🚀 Live Demo](https://zealthy-emr.vercel.app)** &nbsp;·&nbsp;
**[📁 GitHub Repository](https://github.com/YOUR-USERNAME/zealthy-emr)** &nbsp;·&nbsp;
**[🐛 Report a Bug](https://github.com/YOUR-USERNAME/zealthy-emr/issues/new)**

<br />

> Built as a full-stack engineering exercise for **[Zealthy](https://getzealthy.com)** —
> a modern telehealth company reimagining patient care.
> Completed in under 5 hours. Deployed and production-ready.

<br />

</div>

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Live Demo & Credentials](#-live-demo--credentials)
3. [Feature Breakdown](#-feature-breakdown)
4. [System Architecture](#-system-architecture)
5. [Tech Stack & Rationale](#-tech-stack--rationale)
6. [Database Schema](#-database-schema)
7. [Authentication & Security](#-authentication--security)
8. [Core Business Logic — Recurrence Engine](#-core-business-logic--recurrence-engine)
9. [Project Structure](#-project-structure)
10. [API Reference](#-api-reference)
11. [Local Development Setup](#-local-development-setup)
12. [Environment Variables](#-environment-variables)
13. [Database Setup](#-database-setup)
14. [Running the App](#-running-the-app)
15. [Deployment Guide](#-deployment-guide)
16. [Key Engineering Decisions](#-key-engineering-decisions)
17. [What I Would Build Next](#-what-i-would-build-next)
18. [Author](#-author)

---

## 🔭 Project Overview

Zealthy Mini-EMR is a **production-grade, full-stack healthcare application** built on Next.js 14. It serves two distinct user groups from a single codebase:

| Interface | URL | Auth Required | Who Uses It |
|---|---|---|---|
| **Patient Portal** | `/` → `/portal/*` | ✅ Yes — JWT cookie | Patients logging in to view their health summary |
| **Admin EMR** | `/admin/*` | ❌ No (per spec) | Healthcare providers managing patient records |

The application demonstrates enterprise-level patterns — **Server Components for zero-waterfall data fetching**, **httpOnly JWT cookies for XSS-safe authentication**, **middleware-level route protection**, and a **recurrence engine that expands appointment schedules at read time** rather than polluting the database with pre-generated rows.

Every line of code reflects deliberate decisions. This README documents not just *what* was built, but *why* each technical choice was made — because in a healthcare context, the reasoning matters as much as the result.

---

## 🎯 Live Demo & Credentials

### 🌐 Deployed Application
```
https://zealthy-emr.vercel.app
```

### 🔑 Test Credentials

| Role | Email | Password | Portal Access |
|---|---|---|---|
| Patient | `mark@some-email-provider.net` | `Password123!` | `/portal` — Mark Johnson's records |
| Patient | `lisa@some-email-provider.net` | `Password123!` | `/portal` — Lisa Smith's records |
| Admin | *(no login required)* | *(per spec)* | `/admin` — full patient management |

### 🗺️ Key Routes to Explore

```
/                         → Patient login page
/portal                   → Dashboard — 7-day health summary
/portal/appointments      → Full appointment schedule (3-month window)
/portal/prescriptions     → All prescriptions with status indicators

/admin                    → Provider — full patient table
/admin/patients/new       → Create a new patient
/admin/patients/1         → Mark Johnson's full record + CRUD
/admin/patients/2         → Lisa Smith's full record + CRUD
```

---

## ✨ Feature Breakdown

### 🧑‍⚕️ Admin EMR — `/admin`

The admin interface is built for healthcare providers who need fast, frictionless access to patient data.

#### Patient Management
- **Patient Table** — sortable list of all patients with at-a-glance metrics: appointment count, prescription count, membership date
- **Drill-down Detail View** — click any patient to see their complete record in one view
- **Create Patient** — full form with name, email, and password (allows testing portal login without extra tooling)
- **Inline Edit** — update patient name, email, or password directly on the detail page without navigating away

#### Appointment Management (Full CRUD)
- **Schedule New Appointments** — provider name (free-form text), date/time picker, repeat schedule selector
- **Recurring Appointments** — supports `one-time`, `weekly`, and `monthly` recurrence patterns
- **End Date Control** — set an optional end date for recurring series; leave blank for indefinite recurrence
- **Edit Existing** — modify provider, time, recurrence, or end date via modal dialog
- **Delete** — remove with confirmation prompt

#### Prescription Management (Full CRUD)
- **Prescribe Medication** — medication and dosage dropdowns populated from the seeded reference list (matches `data.json` exactly)
- **Set Quantity** — numeric quantity field
- **Refill Scheduling** — set next refill date and recurring refill schedule (monthly/weekly/quarterly)
- **Edit & Delete** — full lifecycle management

---

### 👤 Patient Portal — `/portal`

The portal is patient-facing — clean, focused, and mobile-responsive.

#### Login (`/`)
- Email + password authentication
- Secure JWT stored in httpOnly cookie (not accessible to JavaScript)
- Generic error messages — no email enumeration
- Immediate redirect to dashboard on success

#### Dashboard (`/portal`)
- Personalized greeting based on time of day
- **7-day appointment summary** — all recurring occurrences expanded within the next week
- **7-day refill summary** — prescriptions due for refill in the next 7 days
- Patient info card with membership date
- Quick-links to drill-down pages

#### Full Appointment Schedule (`/portal/appointments`)
- All upcoming occurrences expanded **up to 3 months ahead**
- Grouped by calendar month with occurrence counts
- Each occurrence shows date badge, provider name, time, recurrence indicator
- Empty state when schedule is clear

#### Prescriptions (`/portal/prescriptions`)
- All active prescriptions with visual status system:
  - 🔴 **Overdue** — refill date has passed
  - 🟡 **Due Soon** — refill within the next 7 days
  - 🟢 **On Track** — refill is more than 7 days away
- Refill date, schedule, quantity displayed per prescription

---

## 🏗 System Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                          │
│                                                                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │   "/" Login     │  │  "/portal/*"     │  │  "/admin/*"    │  │
│  │   (public)      │  │  (protected)     │  │  (open)        │  │
│  └────────┬────────┘  └────────┬─────────┘  └───────┬────────┘  │
└───────────┼────────────────────┼────────────────────┼───────────┘
            │   HTTPS            │                    │
            ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 14 — APP ROUTER                       │
│                                                                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │  middleware.ts  │  │ Server Components │  │  API Routes    │  │
│  │                 │  │                  │  │                │  │
│  │  • Reads JWT    │  │  • Fetch data    │  │  /api/auth/*   │  │
│  │  • Verifies     │  │    via Prisma    │  │  /api/patients │  │
│  │  • Redirects    │  │  • No client JS  │  │  /api/appts    │  │
│  │    if invalid   │  │    for page data │  │  /api/rxs      │  │
│  └─────────────────┘  └──────────────────┘  └────────────────┘  │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                        PRISMA ORM                                │
│              Type-safe query layer — zero raw SQL                │
└──────────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                  POSTGRESQL — hosted on Supabase                 │
│                 (managed, connection-pooled, free tier)          │
└──────────────────────────────────────────────────────────────────┘
```

---

### Request Lifecycle — Patient Dashboard

This is the most instructive flow to understand the architecture:

```
① Patient's browser requests GET /portal

② middleware.ts runs (Edge Runtime — fast, before any page code):
   ┌─ reads cookie "zealthy_token"
   ├─ cookie missing? → redirect "/" (never reaches page)
   ├─ jwt.verify(token, JWT_SECRET)
   ├─ invalid/expired? → redirect "/"
   └─ valid → attach x-user-id header → continue to page

③ app/portal/page.tsx (Server Component) runs on the server:
   ┌─ getCurrentUser() reads cookie → gets { userId, name, email }
   ├─ prisma.user.findUnique({ where: { id: userId }, include: {
   │    appointments: true,
   │    prescriptions: true
   │  }})
   ├─ expandRecurring(appointments, today, today+7days)
   ├─ upcomingRefills(prescriptions, today, today+7days)
   └─ renders fully-formed HTML on the server

④ Browser receives complete HTML — no loading spinners,
   no client-side fetch on mount, no layout shift
   Zero JavaScript shipped for page data
```

---

### Authentication Flow

```
LOGIN
─────
Client                              Server (Next.js API Route)
  │                                         │
  ├──── POST /api/auth/login ──────────────►│
  │     { email, password }                 │
  │                                         ├─ prisma.user.findUnique({ email })
  │                                         │  → not found: 401 "Invalid credentials"
  │                                         │    (same error — no email enumeration)
  │                                         │
  │                                         ├─ bcrypt.compare(password, passwordHash)
  │                                         │  → mismatch: 401 "Invalid credentials"
  │                                         │
  │                                         ├─ jwt.sign({ userId, name, email },
  │                                         │    JWT_SECRET, { expiresIn: "7d" })
  │                                         │
  │◄─── 200 { ok: true, user: {...} } ─────┤
  │     Set-Cookie: zealthy_token=...       │  httpOnly, Secure, SameSite=Lax
  │     (cookie auto-sent on every request) │
  │                                         │
  ├──── redirect to /portal ───────────────►│
  │                                         │  middleware verifies JWT on every request
  │                                         │  Server Components read userId from cookie


LOGOUT
──────
  ├──── POST /api/auth/logout ─────────────►│
  │                                         ├─ Set-Cookie: zealthy_token=; maxAge=0
  │◄─── 200 { ok: true } ──────────────────┤  (deletes the cookie)
  ├──── redirect to "/" ───────────────────►│
```

---

## 🛠 Tech Stack & Rationale

Every technology choice was deliberate. Here's the reasoning behind each:

| Layer | Technology | Version | Why This, Not Something Else |
|---|---|---|---|
| **Framework** | Next.js App Router | 14.x | Server Components eliminate client-side data fetching boilerplate. File-based routing makes the URL structure self-documenting. One repo, one deploy — no CORS, no separate API server. |
| **Language** | TypeScript | 5.x | Shared types between database models, API responses, and UI components. Catches contract mismatches at compile time, not runtime. Critical in healthcare where data integrity matters. |
| **Database** | PostgreSQL | 15 | Relational model is the right fit: a patient *has many* appointments, a patient *has many* prescriptions. Foreign keys and cascades enforce referential integrity at the DB level. |
| **ORM** | Prisma | 5.x | Type-safe queries with autocomplete. Schema-as-code with migrations. The generated client matches the TypeScript types exactly — no manual DTO mapping. |
| **DB Hosting** | Supabase | — | Managed PostgreSQL with connection pooling, a clean dashboard, and a generous free tier. No infrastructure to maintain for a demo — but it's production-grade Postgres underneath. |
| **Auth** | bcrypt + JWT | — | No library magic. bcrypt for password hashing (cost factor 10 — calibrated to ~100ms per hash on modern hardware, making brute-force impractical). JWT for stateless session tokens. httpOnly cookies for XSS protection. Explicit, readable, auditable. |
| **Styling** | Tailwind CSS | 3.x | Utility-first means no context-switching between files. Co-located styles. No dead CSS in production — Tailwind purges unused classes. |
| **Icons** | Lucide React | — | Tree-shakeable. Every icon is individually imported — zero unused icon code in the bundle. Consistent visual language across the app. |
| **Date Logic** | date-fns | 2.x | Immutable, functional, and individually importable (tree-shaking friendly). `addWeeks`, `addMonths`, `isBefore`, `isAfter` read like plain English. Far lighter than Moment.js. |
| **Deployment** | Vercel | — | Zero-config Next.js deployment. Edge Middleware runs globally. Preview deployments per branch. Logs and analytics built in. |

---

## 🗄 Database Schema

```prisma
// prisma/schema.prisma

model User {
  id            Int            @id @default(autoincrement())
  name          String
  email         String         @unique
  passwordHash  String         // bcrypt hash — NEVER the plain text password
  createdAt     DateTime       @default(now())
  appointments  Appointment[]
  prescriptions Prescription[]
}

model Appointment {
  id             Int       @id @default(autoincrement())
  userId         Int
  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  provider       String    // free-form text per spec — no FK to a Providers table
  datetime       DateTime  // the BASE datetime of the first occurrence
  repeatSchedule String    @default("none")  // "none" | "weekly" | "monthly"
  endsOn         DateTime? // NULL means "repeats indefinitely" — explicit design choice
  createdAt      DateTime  @default(now())
}

model Prescription {
  id             Int      @id @default(autoincrement())
  userId         Int
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  medication     String   // validated against the seeded Medication list in the UI
  dosage         String   // validated against the seeded Dosage list in the UI
  quantity       Int
  refillOn       DateTime // next upcoming refill date
  refillSchedule String   // "monthly" | "weekly" | "quarterly"
  createdAt      DateTime @default(now())
}

// Reference tables — seeded from data.json
// Used to populate dropdowns; enforces consistent medication/dosage names
model Medication {
  id   Int    @id @default(autoincrement())
  name String @unique
}

model Dosage {
  id    Int    @id @default(autoincrement())
  value String @unique
}
```

### Seeded Reference Data

From `data.json`, the following reference data is loaded on first deploy:

**Medications:** Diovan, Lexapro, Metformin, Ozempic, Prozac, Seroquel, Tegretol

**Dosages:** 1mg, 2mg, 3mg, 5mg, 10mg, 25mg, 50mg, 100mg, 250mg, 500mg, 1000mg

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────┐
│                         USER                            │
│  id · name · email · passwordHash · createdAt           │
└──────────────────┬──────────────────────────────────────┘
                   │ 1
       ┌───────────┴──────────────┐
       │ *                        │ *
┌──────▼────────────┐   ┌─────────▼──────────────┐
│   APPOINTMENT     │   │     PRESCRIPTION        │
│  id               │   │  id                     │
│  userId (FK)      │   │  userId (FK)            │
│  provider         │   │  medication             │
│  datetime         │   │  dosage                 │
│  repeatSchedule   │   │  quantity               │
│  endsOn (nullable)│   │  refillOn               │
│  createdAt        │   │  refillSchedule         │
└───────────────────┘   │  createdAt              │
                        └─────────────────────────┘

┌─────────────────┐   ┌─────────────────┐
│   MEDICATION    │   │     DOSAGE      │
│  id · name      │   │  id · value     │
│  (seeded ref)   │   │  (seeded ref)   │
└─────────────────┘   └─────────────────┘
```

**Cascade delete** is configured on both `Appointment` and `Prescription` — deleting a patient removes all their associated records automatically, preventing orphaned rows.

---

## 🔐 Authentication & Security

### Password Storage

```
User sets password: "Password123!"
         │
         ▼
bcrypt.hash("Password123!", 10)
         │
         ▼  (cost factor 10 = ~100ms per hash on modern hardware)
Stored: "$2b$10$X9Y8Z7W6V5U4T3S2R1Q0P.abcdefghijklmnopqrstuvwxyz012345"
         │
         ▼
The original password is mathematically unrecoverable from the hash.
Even if the database is breached, passwords are not exposed.
```

### Cookie Security Properties

```
Set-Cookie: zealthy_token=<jwt>;
  HttpOnly   → Cannot be read by JavaScript — XSS attacks cannot steal it
  Secure     → Only transmitted over HTTPS in production
  SameSite=Lax → CSRF protection — cookie not sent on cross-site POST requests
  Max-Age=604800 → Expires in 7 days automatically
  Path=/     → Sent on all requests to this domain
```

### Why httpOnly Cookie Instead of localStorage?

A common pattern is storing JWTs in `localStorage` and attaching them as `Authorization: Bearer` headers. **This is a security anti-pattern for healthcare applications:**

- `localStorage` is accessible to any JavaScript on the page
- A single XSS vulnerability allows an attacker to exfiltrate the token and impersonate the user
- httpOnly cookies are **inaccessible to JavaScript by design** — even successful XSS cannot read them

### Generic Error Messages

```typescript
// ❌ What NOT to do — reveals which emails are registered
if (!user) return { error: "No account found with this email" }
if (!validPassword) return { error: "Incorrect password" }

// ✅ What we do — same error either way
if (!user || !isValid) return { error: "Invalid credentials" }
```

This prevents **email enumeration attacks** — where an attacker probes the login form to discover which emails are registered in the system. In a healthcare context, even knowing that someone has a patient account is sensitive information.

### Route Protection Architecture

```
Request to /portal/dashboard
         │
         ▼
middleware.ts (runs at Edge — before any page code)
         │
         ├── No cookie? ──────────────────────────► redirect "/"
         │
         ├── Cookie present, jwt.verify() throws? ► redirect "/"
         │
         └── Valid JWT ───────────────────────────► allow request
                                                    attach x-user-id header
                                                    continue to Server Component
```

The middleware runs on **every request** to `/portal/*` at the Edge — it cannot be bypassed by manipulating client-side state.

---

## ⚙️ Core Business Logic — Recurrence Engine

The most interesting engineering in this codebase is the recurring appointment system. Here's the full design decision:

### The Problem

Appointments can recur weekly or monthly. The patient portal needs to show:
- All occurrences in the next 7 days (dashboard)
- All occurrences in the next 3 months (appointments page)

### Option A: Pre-generate rows in the database

Store every future occurrence as its own row.

**Problems:**
- Edit one appointment → must delete and re-create potentially hundreds of rows
- Database fills with speculative future data
- How far into the future do you generate? 1 year? 5 years?
- Rescheduling is a complex transaction, not a simple UPDATE

### Option B: Store the recurrence rule, expand at read time ✅

Store one row per appointment series. When displaying, compute concrete dates on the fly.

**Advantages:**
- Editing is a single `UPDATE` — no cascade of row deletions
- Database stays clean — one row per logical appointment
- Window can be any size — 7 days, 3 months, 10 years
- Logic is pure, testable, and explicit


## 📁 Project Structure

```
zealthy-emr/
│
├── 📂 app/                              Next.js App Router — pages and API
│   ├── 📄 page.tsx                      "/" — Patient login (public)
│   ├── 📄 layout.tsx                    Root HTML shell
│   ├── 📄 globals.css                   Global base styles
│   │
│   ├── 📂 portal/                       Patient-facing portal (JWT protected)
│   │   ├── 📄 layout.tsx                PortalNav + auth guard
│   │   ├── 📄 page.tsx                  Dashboard — 7-day summary
│   │   ├── 📂 appointments/
│   │   │   └── 📄 page.tsx              Full schedule — 3-month expanded view
│   │   └── 📂 prescriptions/
│   │       └── 📄 page.tsx              All prescriptions + overdue/due-soon status
│   │
│   ├── 📂 admin/                        Provider EMR (no auth per spec)
│   │   ├── 📄 layout.tsx                Admin nav bar
│   │   ├── 📄 page.tsx                  Patient table with at-a-glance counts
│   │   └── 📂 patients/
│   │       ├── 📂 new/
│   │       │   └── 📄 page.tsx          Create patient form
│   │       └── 📂 [id]/
│   │           └── 📄 page.tsx          Patient detail — full record + CRUD
│   │
│   └── 📂 api/                          REST API routes
│       ├── 📂 auth/
│       │   ├── 📂 login/
│       │   │   └── 📄 route.ts          POST — verify credentials, issue JWT cookie
│       │   └── 📂 logout/
│       │       └── 📄 route.ts          POST — clear JWT cookie
│       ├── 📂 patients/
│       │   ├── 📄 route.ts              GET list · POST create
│       │   └── 📂 [id]/
│       │       └── 📄 route.ts          GET detail · PUT update
│       ├── 📂 appointments/
│       │   ├── 📄 route.ts              POST create
│       │   └── 📂 [id]/
│       │       └── 📄 route.ts          PUT update · DELETE
│       ├── 📂 prescriptions/
│       │   ├── 📄 route.ts              POST create
│       │   └── 📂 [id]/
│       │       └── 📄 route.ts          PUT update · DELETE
│       ├── 📂 medications/
│       │   └── 📄 route.ts              GET medications + dosages for dropdowns
│       └── 📂 portal/
│           └── 📂 me/
│               └── 📄 route.ts          GET current patient's full data (protected)
│
├── 📂 components/
│   ├── 📂 admin/
│   │   ├── 📄 PatientForm.tsx           Create new patient — name, email, password
│   │   ├── 📄 EditPatientForm.tsx       Inline update patient info
│   │   ├── 📄 AppointmentSection.tsx    Appointment list + add/edit/delete modal
│   │   └── 📄 PrescriptionSection.tsx  Prescription list + add/edit/delete modal
│   └── 📂 portal/
│       └── 📄 PortalNav.tsx             Top nav + mobile bottom nav
│
├── 📂 lib/
│   ├── 📄 prisma.ts                     Prisma singleton — avoids hot-reload leaks
│   ├── 📄 auth.ts                       bcrypt, JWT helpers, cookie config
│   ├── 📄 recurrence.ts                 Recurring appointment expansion engine
│   └── 📄 utils.ts                      cn() — Tailwind class merging utility
│
├── 📂 types/
│   └── 📄 index.ts                      Shared TypeScript interfaces across layers
│
├── 📂 prisma/
│   ├── 📄 schema.prisma                 Database schema — single source of truth
│   └── 📄 seed.ts                       Seeds medications, dosages, 2 sample patients
│
├── 📄 middleware.ts                      Edge middleware — JWT guard for /portal/*
├── 📄 .env                              Local environment variables (gitignored)
├── 📄 .env.example                      Template for environment setup
├── 📄 .gitignore                        Excludes node_modules, .env, .next
├── 📄 next.config.ts                    Next.js configuration
├── 📄 tailwind.config.ts                Tailwind configuration
├── 📄 tsconfig.json                     TypeScript configuration
└── 📄 package.json                      Dependencies and scripts
```

### 🔒 Portal Endpoints (JWT Required)

#### `GET /api/portal/me`
Get the currently authenticated patient's full record.

**Headers required:** Cookie `zealthy_token` (set automatically by browser after login)

**Success response `200`:** Same structure as `GET /api/patients/:id`

**Error responses:**
- `401` — No token or invalid/expired token

---

## 🚀 Local Development Setup

### Prerequisites

Verify these are installed before starting:

```bash
node --version    # Must be v18.0.0 or higher
npm --version     # Must be v9.0.0 or higher
git --version     # Any recent version
```

If you need to install Node.js, download the **LTS version** from [nodejs.org](https://nodejs.org). npm is bundled with it.

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/Govind-Chinni/zealthy-emr.git
cd zealthy-emr
```

---

### Step 2 — Install dependencies

```bash
npm install
```

This installs all packages defined in `package.json`. Expect 30–60 seconds.

---

### Step 3 — Set up environment variables

```bash
cp .env.example .env
```

Then open `.env` and fill in the two required values (see [Environment Variables](#-environment-variables) below).

---

### Step 4 — Set up the database

```bash
# Push the Prisma schema to your PostgreSQL database
# (creates all tables — safe to run multiple times)
npx prisma db push

# Generate the Prisma TypeScript client
# (must run after any schema changes)
npx prisma generate

# Seed the database with medications, dosages, and 2 sample patients
npx prisma db seed
```

---

### Step 5 — Start the development server

```bash
npm run dev
```

The app is now running at **[http://localhost:3000](http://localhost:3000)**

---

### Step 6 — Verify everything works

Open these URLs and confirm each works:

| URL | Expected |
|---|---|
| `http://localhost:3000` | Login page with Zealthy branding |
| `http://localhost:3000/admin` | Patient table showing Mark Johnson and Lisa Smith |
| `http://localhost:3000/admin/patients/1` | Mark's detail page with appointments and prescriptions |
| Login with Mark's credentials | Redirects to `/portal` dashboard |
| `http://localhost:3000/portal/appointments` | Appointment list with recurring expansions |
| `http://localhost:3000/portal/prescriptions` | Prescription list with status badges |

---

## 🔧 Environment Variables

```bash
# .env.example

# ─────────────────────────────────────────────────────
# DATABASE_URL
# ─────────────────────────────────────────────────────
# PostgreSQL connection string.
# Get it from: Supabase → Project Settings → Database
#              → Connection String → URI tab
#
# Replace [YOUR-PASSWORD] with the password you set
# when creating the Supabase project.
#
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# ─────────────────────────────────────────────────────
# JWT_SECRET
# ─────────────────────────────────────────────────────
# Secret key used to sign and verify JWT tokens.
# Must be a long, random string.
# In production: generate with → openssl rand -base64 32
# NEVER commit the real value to git.
#
JWT_SECRET="your-super-secret-jwt-signing-key-minimum-32-chars"

# ─────────────────────────────────────────────────────
# NEXT_PUBLIC_APP_URL (optional — for metadata)
# ─────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Getting Your Supabase DATABASE_URL

1. Go to [supabase.com](https://supabase.com) → sign in
2. Select your project → **Project Settings** (gear icon, bottom-left sidebar)
3. Click **Database** in the settings menu
4. Scroll to **Connection string** section
5. Select the **URI** tab
6. Copy the string — it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijkl.supabase.co:5432/postgres
   ```
7. Replace `[YOUR-PASSWORD]` with the database password you set during project creation

### Generating a Secure JWT_SECRET

```bash
# On Mac/Linux:
openssl rand -base64 32

# Output example (use this as your JWT_SECRET):
# 8K3mN9qR2vX7pL0jH5wE4tY1uC6sA9dF2gB8nM3kP0qR7vX4t
```

---

## 🗄 Database Setup

### First-Time Setup

```bash
# 1. Create all tables from schema.prisma
npx prisma db push

# 2. Generate the TypeScript client
npx prisma generate

# 3. Insert seed data
npx prisma db seed
```

### What Seeding Creates

The seed script (`prisma/seed.ts`) inserts:

- **7 medications** — Diovan, Lexapro, Metformin, Ozempic, Prozac, Seroquel, Tegretol
- **11 dosages** — 1mg through 1000mg
- **2 patients** with hashed passwords, appointments, and prescriptions:
  - Mark Johnson (`mark@some-email-provider.net`)
  - Lisa Smith (`lisa@some-email-provider.net`)

Seeding uses `upsert` — safe to run multiple times without creating duplicate records.

### Resetting the Database

If you need a clean slate:

```bash
# Drop all data and re-run migrations
npx prisma db push --force-reset

# Re-seed
npx prisma db seed
```

> ⚠️ `--force-reset` drops all tables and data. Never run on production.

### Viewing Data with Prisma Studio

```bash
npx prisma studio
```

Opens a browser-based GUI at `http://localhost:5555` — lets you inspect and edit data directly. Useful for debugging.

---

## ☁️ Deployment Guide

### Deploy to Vercel (Recommended)

Vercel is the natural choice for Next.js apps — built by the same team, zero configuration required.

#### Step 1 — Push code to GitHub

```bash
git add .
git commit -m "feat: zealthy mini-EMR — complete implementation"
git push origin main
```

#### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find and click **"Import"** next to `zealthy-emr`

#### Step 3 — Configure environment variables

In the Vercel project setup screen, scroll to **"Environment Variables"** and add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your Supabase connection string |
| `JWT_SECRET` | Your JWT signing secret (generate with `openssl rand -base64 32`) |

#### Step 4 — Deploy

Click **"Deploy"**. Vercel will:
1. Install dependencies
2. Run `next build`
3. Deploy to a global CDN
4. Give you a URL like `zealthy-emr.vercel.app`

#### Step 5 — Verify deployment

The database is already seeded (Supabase is cloud-hosted — your local seed already populated it). Visit your Vercel URL and test the login flow.

---

### Available npm Scripts

```bash
npm run dev        # Start development server with hot reload → localhost:3000
npm run build      # Build production bundle → .next/
npm run start      # Serve production build locally (run build first)
npm run lint       # Run ESLint across all TypeScript files
npx prisma studio  # Open Prisma database GUI → localhost:5555
npx prisma db push # Push schema changes to database
npx prisma db seed # Run seed script
```

---

## 🔮 What I Would Build Next

Given more time, here's a prioritized roadmap:

### P0 — Security (Would block production in a real healthcare app)

- [ ] **Rate limiting on `/api/auth/login`** — prevent brute-force attacks. Add `X-RateLimit` headers, limit to 5 attempts per IP per 15 minutes using an in-memory or Redis store
- [ ] **Admin authentication** — the spec waived it, but any real EMR must authenticate providers before granting access to patient records
- [ ] **CSRF token validation** — the httpOnly cookie protects against token theft; CSRF tokens protect against cross-site request forgery on state-mutating endpoints
- [ ] **Audit log table** — every create/update/delete should record `who`, `what`, `when`, and `previous value`. Non-negotiable for HIPAA compliance
- [ ] **Input validation with Zod** — replace manual `if (!field)` checks with schema validation on every API route

### P1 — Features (High user value)

- [ ] **Soft delete appointments** — "cancel" rather than hard delete. Keeps history for audit purposes
- [ ] **Appointment notifications** — email or SMS reminder 24 hours before each appointment. Would use a job queue (BullMQ or Inngest) for scheduling
- [ ] **Prescription refill history** — track when each refill was processed, by whom, and any notes
- [ ] **Patient search** — debounced search across name and email in the admin patient table
- [ ] **Pagination** — the patient table will need server-side pagination at scale

### P2 — Code Quality (Raises the floor)

- [ ] **Unit tests for `lib/recurrence.ts`** — this is the core business logic and deserves full coverage: weekly expansion, monthly edge cases (Jan 31 + 1 month), end dates, one-time appointments
- [ ] **Integration tests for API routes** — test the auth flow, CRUD operations, and error cases against a test database
- [ ] **E2E tests with Playwright** — cover the two main user journeys: patient login → dashboard → drill-downs, admin create patient → add appointment → delete
- [ ] **Zod schemas shared between API and frontend** — single source of truth for data shapes

### P3 — Infrastructure (Scale and operations)

- [ ] **Connection pooling with PgBouncer** — Supabase provides this; configure `?pgbouncer=true&connection_limit=1` in the connection string for serverless environments
- [ ] **Structured logging** — replace `console.error` with a structured logger (Pino) that outputs JSON. Enables log aggregation and alerting
- [ ] **Health check endpoint** — `GET /api/health` that verifies database connectivity, for uptime monitoring
- [ ] **Preview deployments** — Vercel provides these automatically per branch; configure them to use a separate `DATABASE_URL` pointing to a staging schema

---