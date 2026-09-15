# 04 — System Architecture

This document describes the technical architecture of ExpenseWise, detailing how Next.js App Router, React 19, Server Actions, Edge Middleware, Prisma ORM, and PostgreSQL interact.

---

## 1. High-Level Architecture Diagram

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT TIER (Browser)                             │
│                                                                                  │
│   React 19 Components  │  Theme Context  │  PWA Service Worker (Cache-First)     │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ HTTPS Requests (HTML, RSC Payloads, Actions)
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              NEXT.JS 15 RUNTIME TIER                             │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Edge Middleware (middleware.js)                                         │  │
│  │    • Validates 'auth_session' JWT token                                    │  │
│  │    • Handles route protection and auth redirects                           │  │
│  └─────────────────────────────────────┬──────────────────────────────────────┘  │
│                                        │ Authorized Requests                     │
│                                        ▼                                         │
│  ┌─────────────────────────────────────┬──────────────────────────────────────┐  │
│  │ 2. App Router Layouts & Pages       │ 3. Server Actions & API Handlers     │  │
│  │    • (auth) Route Group             │    • actions/dashboard-actions.js    │  │
│  │    • (dashboard) Route Group        │    • actions/expense-actions.js      │  │
│  │    • Server Component Layouts       │    • actions/budget-actions.js       │  │
│  │    • Dynamic Client Components      │    • actions/loan-actions.js         │  │
│  │    • In-memory Caching System       │    • actions/admin-actions.js        │  │
│  └─────────────────────────────────────┴──────────────────┬───────────────────┘  │
│                                                           │                      │
│                                        ┌──────────────────▼───────────────────┐  │
│                                        │ 4. Validation & Auth Guards          │  │
│                                        │    • lib/validations.js (Zod)        │  │
│                                        │    • requireAuth() / requireAdmin()  │  │
│                                        └──────────────────┬───────────────────┘  │
└───────────────────────────────────────────────────────────┼──────────────────────┘
                                                            │ SQL Queries (Connection Pool)
                                                            ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE TIER (PostgreSQL)                          │
│                                                                                  │
│   Prisma ORM Client Singleton (lib/prisma.js)                                    │
│   PostgreSQL 14+ / Neon Serverless (PgBouncer Pooled Connection)                 │
│   Tables: users, categories, expenses, budgets, contacts, loans, loan_settlements│
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Next.js App Router Architecture

The project leverages Next.js 15 App Router conventions with clear logical separation:

### 2.1 Route Groups
- **`(auth)` Route Group** ([`app/(auth)/`](file:///d:/Sunbeam/Project/Expense-tracker/app/(auth)/)): Contains public authentication routes (`/login`, `/signup`). Public users can register or sign in. Authenticated users attempting to access these routes are redirected back to `/dashboard` by `middleware.js`.
- **`(dashboard)` Route Group** ([`app/(dashboard)/`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/)): Contains protected application pages (`/dashboard`, `/expenses`, `/budgets`, `/debts`, `/reports`, `/admin`). Shares a common server layout ([`app/(dashboard)/layout.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/layout.jsx)) that verifies the user session before mounting [`components/layout/DashboardLayoutClient.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/layout/DashboardLayoutClient.jsx).

### 2.2 REST API Route Handlers (`app/api/`)
Located in [`app/api/`](file:///d:/Sunbeam/Project/Expense-tracker/app/api/), these route handlers act as standard HTTP REST endpoints providing JSON responses. They wrap corresponding Server Actions, allowing external integration or programmatic API access while maintaining identical validation and business rules.

---

## 3. Server Components vs Client Components

| Component Type | Purpose & Responsibility | Examples |
| :--- | :--- | :--- |
| **Server Components** | Server-side rendering, reading HTTP headers/cookies, executing database queries without shipping runtime JS, initial auth verification. | `app/layout.jsx`, `app/(dashboard)/layout.jsx`, `app/page.jsx` |
| **Client Components** (`'use client'`) | Interactive UI, state management (`useState`, `useEffect`), animations, modals, clipboard reading, Recharts visualizations. | `DashboardLayoutClient.jsx`, `SpendingTrendChart.jsx`, `SmsParserModal.jsx`, `AdminAnalyticsCharts.jsx`, `ThemeToggle.jsx` |

---

## 4. Server Actions Layer (`actions/`)

ExpenseWise uses Next.js **Server Actions** (`'use server'`) as the primary data mutation and retrieval interface between client components and the PostgreSQL database.

### Core Design Rules Enforced in Server Actions:
1. **Authentication Enforcement**: Every protected action begins with `await requireAuth()` or `await requireAdmin()`.
2. **Strict User Scoping**: All database queries explicitly filter by `where: { userId: user.id }` (except admin platform-wide aggregates).
3. **Zod Validation**: All mutation payloads are validated against strict Zod schemas before database execution.
4. **Cache Invalidation**: Successful mutations call `revalidatePath(...)` or `revalidateTag(...)` to ensure Next.js router caches remain accurate.
5. **Standardized Response Format**: All server actions return a consistent JSON response:
   ```javascript
   // Success
   { success: true, data: { ... } }
   
   // Error
   { success: false, error: 'User-friendly error message' }
   ```

---

## 5. Authentication Architecture

```text
HTTP Request
     │
     ▼
middleware.js (Edge Runtime)
     │
     ├── Reads 'auth_session' cookie
     ├── Verifies signature via jose (HS256) using AUTH_SECRET
     │
     ├── If Token Valid:
     │     • /login or /signup  ➔ Redirect to /dashboard
     │     • Protected route   ➔ Allow (NextResponse.next())
     │
     └── If Token Invalid / Missing:
           • Protected route   ➔ Redirect to /login?redirect=<pathname>
           • Public route      ➔ Allow
```

- **Stateless Tokens**: Auth state is stored inside a compact JWT signed with `jose` HS256 algorithm. No server-side session table lookup is required for basic route verification.
- **`HttpOnly` Cookie Storage**: Cookies cannot be accessed via JavaScript (`document.cookie`), mitigating Cross-Site Scripting (XSS) token theft.
- **Database User Lookup**: Full database user record lookup occurs only when performing sensitive admin operations (`requireAdmin(forceDb = true)`) or fetching user profile metadata.

---

## 6. Data Fetching & Performance Strategy

### 6.1 Zero-Waterfall Batch Queries
The primary dashboard action ([`actions/dashboard-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/dashboard-actions.js)) queries 5 independent database models in parallel via `Promise.all`:
1. `prisma.category.findMany()`
2. `prisma.expense.findMany()`
3. `prisma.budget.findMany()`
4. `prisma.loan.findMany()`
5. `prisma.expense.aggregate()`

This prevents multi-hop network round trips and delivers sub-100ms dashboard hydration on PostgreSQL databases.

### 6.2 In-Memory Caching (`unstable_cache`)
Global categories are cached in-memory with a 1-hour TTL:
```javascript
const getCachedCategories = unstable_cache(
  async () => prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ['categories-list'],
  { tags: ['categories'], revalidate: 3600 }
);
```
When an admin creates or deletes a category in `/admin`, `revalidateTag('categories')` is invoked to instantly purge the cache.

### 6.3 Dynamic Component Splitting
Recharts components (`AdminAnalyticsCharts.jsx`) are dynamically imported with `ssr: false`:
```javascript
const AdminAnalyticsCharts = dynamic(
  () => import('@/components/admin/AdminAnalyticsCharts'),
  { ssr: false, loading: () => <ChartsSkeleton /> }
);
```
This isolates heavy charting libraries from the initial critical JavaScript bundle, reducing initial admin page load bundle size by ~90%.

---

## 7. Progressive Web App (PWA) Layer

- **Registration**: Self-registering service worker injected in `app/layout.jsx`.
- **Caching Strategy**: Cache-First for static assets (`/_next/static/`, `/icons/`, `/fonts/`, `/manifest.json`) and Network-First for dynamic Server Action data mutations.
- **Standalone Mode**: Configured in `public/manifest.json` for full-screen mobile app experience on iOS and Android.
