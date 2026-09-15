# 05 — Project Structure & File Map

This document outlines the codebase layout of ExpenseWise, explaining the role of each directory, key source files, and a modification lookup guide for future development.

---

## 1. Directory Tree Overview

```text
ExpenseWise/
├── actions/                         # Next.js Server Actions (Backend business logic & DB access)
│   ├── admin-actions.js             # Platform KPIs, user inspector, backups, health diagnostics
│   ├── auth-actions.js              # Register, login, logout, getMe session actions
│   ├── budget-actions.js            # Budget CRUD and monthly utilization aggregation
│   ├── dashboard-actions.js         # Consolidated parallel dashboard data query & rule engine
│   ├── expense-actions.js           # Expense CRUD, pagination, filtering, batch SMS logging
│   └── loan-actions.js              # Peer loans, contact auto-resolution, settlement transactions
│
├── app/                             # Next.js App Router (Layouts, Pages, Routes, Globals)
│   ├── (auth)/                      # Public authentication route group
│   │   ├── login/page.jsx           # Login page with credentials form & redirect support
│   │   └── signup/page.jsx          # Signup page with name, email, password fields
│   ├── (dashboard)/                 # Protected application route group
│   │   ├── admin/page.jsx           # 6-Tab Executive Admin Dashboard
│   │   ├── budgets/page.jsx         # Monthly budget manager with category pacing meters
│   │   ├── dashboard/page.jsx       # Consolidated financial overview & AI insights
│   │   ├── debts/page.jsx           # Peer lending ledger, contacts, and settlements
│   │   ├── expenses/page.jsx        # Filterable expense journal with optimistic delete
│   │   ├── reports/page.jsx         # Financial statements & client-side CSV exporter
│   │   ├── layout.jsx               # Dashboard server layout (auth check & user injection)
│   │   └── loading.jsx              # Global dashboard loading fallback
│   ├── api/                         # REST API Route Handlers (JSON API endpoints)
│   │   ├── auth/                    # login, logout, me, refresh, register
│   │   ├── budgets/                 # GET/POST budgets, [id], status
│   │   ├── dashboard/               # summary, analytics, insights
│   │   ├── expenses/                # GET/POST expenses, [id], categories
│   │   └── loans/                   # GET/POST loans, [id], contacts, settlements
│   ├── globals.css                  # Tailwind v4 theme, Soft UI Neumorphism & Deep Onyx tokens
│   ├── layout.jsx                   # Root server layout, ThemeProvider, anti-flash script, SW
│   ├── not-found.jsx                # Custom 404 Neumorphic error page
│   └── page.jsx                     # Root redirection handler (auth -> /dashboard, else -> /login)
│
├── components/                      # Reusable React components
│   ├── admin/
│   │   └── AdminAnalyticsCharts.jsx # Recharts charts for admin portal (Dynamic Import)
│   ├── dashboard/
│   │   └── SpendingTrendChart.jsx   # 6-Month trajectory area chart for user dashboard
│   ├── expenses/
│   │   └── SmsParserModal.jsx       # Smart clipboard bank SMS parser & batch logger
│   ├── layout/
│   │   └── DashboardLayoutClient.jsx# Sidebar, mobile top header, floating bottom tab bar
│   ├── theme/
│   │   └── ThemeProvider.jsx        # Client React Context for dark/light mode state
│   └── ui/
│       ├── CategoryIcon.jsx         # Dynamic Lucide icon renderer for categories
│       ├── InstallPwaButton.jsx     # PWA install prompt button (Chromium & iOS)
│       ├── ThemeToggle.jsx          # Multi-variant theme switcher button
│       └── skeletons.jsx            # Neumorphic shimmer loading skeletons
│
├── lib/                             # Shared utility libraries & helper modules
│   ├── auth.js                      # JWT signing/verification, bcrypt hashing, requireAuth guards
│   ├── prisma.js                    # Global PrismaClient singleton
│   ├── smsParser.js                 # Bank SMS parsing regex engine & category keyword mapping
│   ├── utils.js                     # formatCurrency (INR), formatDate, downloadCSV, clsx cn()
│   └── validations.js               # Zod schemas (register, login, expense, budget, loan, settlement)
│
├── prisma/                          # Database configuration & migrations
│   ├── migrations/                  # Version-controlled PostgreSQL SQL migration files
│   │   └── 20260914145225_init/     # Initial migration SQL creating all 6 tables & enums
│   ├── schema.prisma                # Prisma schema definitions & relationships
│   └── seed.js                      # Database seed script for 8 default expense categories
│
├── public/                          # Static assets & PWA files
│   ├── icons/                       # PWA application icons (192x192, 512x512, apple-touch)
│   ├── favicon.svg                  # SVG browser favicon
│   ├── manifest.json                # Web App Manifest for PWA installation
│   └── sw.js                        # Cache-First Progressive Web App Service Worker
│
├── scripts/                         # Operational CLI scripts
│   ├── generate-pwa-icons.js        # Node.js script generating PNG app icons from SVG
│   ├── migrate-mysql-to-postgres.js # Automated legacy MySQL to PostgreSQL data importer
│   └── promote-admin.js             # CLI tool to promote any user email to ADMIN role
│
├── middleware.js                    # Edge Middleware inspecting auth_session JWT cookie
├── next.config.mjs                  # Next.js configuration (bundle optimizer, compression)
├── package.json                     # Project dependencies & npm run scripts
└── jsconfig.json                    # Path aliases (`@/*` mapping to root)
```

---

## 2. Directory Responsibilities

### `actions/`
Contains Next.js Server Actions. Acts as the controller/service layer of the application.
- **Rules**: Must contain `'use server'`, authenticate requests via `requireAuth()` or `requireAdmin()`, validate inputs with Zod schemas, and perform database operations via `prisma`.

### `app/`
Contains Next.js 15 App Router definitions.
- **Layouts**: Define common UI shells and perform server-side session checks.
- **Pages**: Define routes and render feature interfaces.
- **API Routes**: Expose REST endpoints returning JSON payloads.

### `components/`
Contains client and presentational components organized by feature domain (`admin`, `dashboard`, `expenses`, `layout`, `theme`, `ui`).
- **Rules**: Components that use hooks (`useState`, `useEffect`) or browser APIs must have `'use client'` at the top.

### `lib/`
Contains framework-agnostic utilities and helpers:
- `auth.js`: Cryptographic session and role-checking helpers.
- `validations.js`: Zod schemas shared across Server Actions and API route handlers.
- `smsParser.js`: Pure functions for parsing SMS text and extracting structured data.
- `prisma.js`: Prisma client instance with singleton pattern to prevent connection exhaustion in development.

---

## 3. Developer Modification Guide ("Where should I look?")

| If you want to modify... | Look in this file / directory |
| :--- | :--- |
| **Theme colors, shadows, or dark mode styles** | [`app/globals.css`](file:///d:/Sunbeam/Project/Expense-tracker/app/globals.css) |
| **Theme switcher buttons or behavior** | [`components/ui/ThemeToggle.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/ui/ThemeToggle.jsx) & [`components/theme/ThemeProvider.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/theme/ThemeProvider.jsx) |
| **Sidebar navigation links or mobile bottom bar** | [`components/layout/DashboardLayoutClient.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/layout/DashboardLayoutClient.jsx) |
| **Database schema, fields, or relations** | [`prisma/schema.prisma`](file:///d:/Sunbeam/Project/Expense-tracker/prisma/schema.prisma) |
| **Expense logging rules or category mappings** | [`actions/expense-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/expense-actions.js) & [`lib/validations.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/validations.js) |
| **SMS Parser regex patterns or bank keywords** | [`lib/smsParser.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/smsParser.js) |
| **Dashboard calculations or AI rule triggers** | [`actions/dashboard-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/dashboard-actions.js) |
| **Budget limits, alerts, or utilization math** | [`actions/budget-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/budget-actions.js) |
| **Peer debt settlements or loan logic** | [`actions/loan-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/loan-actions.js) |
| **Admin portal tabs, user inspector, or metrics** | [`app/(dashboard)/admin/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/admin/page.jsx) & [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js) |
| **Auth cookies, session duration, or token payload** | [`lib/auth.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/auth.js) |
| **Route protection or public route whitelist** | [`middleware.js`](file:///d:/Sunbeam/Project/Expense-tracker/middleware.js) |
| **PWA Service worker caching rules** | [`public/sw.js`](file:///d:/Sunbeam/Project/Expense-tracker/public/sw.js) |
| **CSV formatting or Indian Rupee currency format** | [`lib/utils.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/utils.js) |
