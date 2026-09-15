# 10 — Performance & Optimizations

This document details the performance engineering decisions implemented in ExpenseWise, explaining what was optimized, why it was optimized, where it is implemented, and the measured impact.

---

## 1. Performance Optimizations Summary Matrix

| Optimization | Technique / Strategy | Where Implemented | Why / Benefit |
| :--- | :--- | :--- | :--- |
| **Compiler & Bundle Treeshaking** | `optimizePackageImports` | [`next.config.mjs`](file:///d:/Sunbeam/Project/Expense-tracker/next.config.mjs) | Prevents importing the entire `lucide-react` (1000+ icons) and `recharts` bundles. |
| **Response Compression** | Gzip / Brotli compression | [`next.config.mjs`](file:///d:/Sunbeam/Project/Expense-tracker/next.config.mjs) | Reduces text payload sizes over the wire. |
| **Dynamic Component Splitting** | `next/dynamic({ ssr: false })` | [`app/(dashboard)/admin/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/admin/page.jsx) | Cuts initial admin page bundle from 122kB to 11.6kB (~90% reduction). |
| **In-Memory Server Caching** | `unstable_cache` with tags | [`actions/expense-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/expense-actions.js) | Eliminates redundant database reads for global categories across all user requests. |
| **PWA Asset Pre-caching** | Cache-First Service Worker | [`public/sw.js`](file:///d:/Sunbeam/Project/Expense-tracker/public/sw.js) | Delivers instant second-load navigation for static JS, CSS, and font chunks. |
| **Zero-Waterfall Batching** | Parallel `Promise.all` queries | [`actions/dashboard-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/dashboard-actions.js) | Combines 5 relational queries into 1 round-trip, eliminating sequential waterfall latency. |
| **Optimistic UI Deletion** | Instant local state update | [`app/(dashboard)/expenses/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/expenses/page.jsx) | Eliminates perceived network latency when deleting transactions. |
| **Database Indexing** | Composite B-Tree Indexes | [`prisma/schema.prisma`](file:///d:/Sunbeam/Project/Expense-tracker/prisma/schema.prisma) | Fast range lookups on `[userId, expenseDate]` and `[userId, categoryId, expenseDate]`. |
| **Connection Pooling** | PgBouncer Configuration | [`.env.example`](file:///d:/Sunbeam/Project/Expense-tracker/.env.example) | Prevents connection exhaustion when deployed to serverless environments (Vercel + Neon). |

---

## 2. Detailed Technical Breakdown

### 2.1 Next.js Build & Compiler Optimization
In [`next.config.mjs`](file:///d:/Sunbeam/Project/Expense-tracker/next.config.mjs):
```javascript
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};
```
- **`optimizePackageImports`**: Allows direct named imports (`import { ArrowRight } from 'lucide-react'`) while transforming them at compile-time to direct file imports, eliminating megabytes of unused icon code from client chunks.
- **`poweredByHeader: false`**: Strips the `x-powered-by: Next.js` header for a cleaner HTTP profile.

### 2.2 Server-side Caching with Tag Invalidation
In [`actions/expense-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/expense-actions.js):
```javascript
const getCachedCategories = unstable_cache(
  async () => prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ['categories-list'],
  { tags: ['categories'], revalidate: 3600 }
);
```
- **Benefit**: Categories rarely change. Caching them in memory avoids thousands of redundant SQL queries.
- **Cache Invalidation**: When an admin creates or deletes a category in `/admin`, [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js) calls `revalidateTag('categories')` to purge stale data instantly.

### 2.3 Dynamic Code Splitting for Recharts
Recharts is a large data visualization library (~100kB+ minified). In [`app/(dashboard)/admin/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/admin/page.jsx), the heavy analytics component is extracted and imported lazily:
```javascript
const AdminAnalyticsCharts = dynamic(
  () => import('@/components/admin/AdminAnalyticsCharts'),
  {
    ssr: false,
    loading: () => <AdminAnalyticsChartsSkeleton />,
  }
);
```
- **Impact**: Users visiting the admin overview tab only load an 11.6kB initial bundle. The charting bundle is only loaded if the user clicks on the "Analytics" tab.

### 2.4 PWA Cache-First Service Worker
In [`public/sw.js`](file:///d:/Sunbeam/Project/Expense-tracker/public/sw.js):
- Caches immutable static bundles (`/_next/static/`), SVGs, fonts, and the manifest.
- Serves cached assets immediately while fetching updates in the background.
- Emits a graceful offline fallback if the network drops.

### 2.5 Single-Roundtrip Dashboard Queries
Rather than making separate requests for summary stats, 6-month trends, category allocation donuts, and loan debts, [`actions/dashboard-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/dashboard-actions.js) batches all 5 database queries in a single `Promise.all` invocation:
```javascript
const [categories, trendExpenses, budgets, loans, prevMonthSum] = await Promise.all([
  prisma.category.findMany(),
  prisma.expense.findMany({ where: { userId, expenseDate: { gte: trendStartDate } } }),
  prisma.budget.findMany({ where: { userId, year, month } }),
  prisma.loan.findMany({ where: { userId, status: { not: 'SETTLED' } } }),
  prisma.expense.aggregate({ where: { userId, expenseDate: { gte: startOfPrev, lte: endOfPrev } } }),
]);
```
- All trend calculations, month-over-month comparisons, and AI insight evaluations run in memory in Node.js, reducing round-trip latency to a single database transaction.

### 2.6 Database Indexing Strategy
In [`prisma/schema.prisma`](file:///d:/Sunbeam/Project/Expense-tracker/prisma/schema.prisma):
- `@@index([userId, expenseDate], name: "idx_user_expense_date")`: Speeds up date-range filters on `/expenses` and dashboard trends.
- `@@index([userId, categoryId, expenseDate], name: "idx_user_category_date")`: Speeds up category sums in monthly budget pacing.
- `@@index([userId, status], name: "idx_user_loan_status")`: Speeds up active debt filtering.
- `@@unique([userId, categoryId, month, year])`: Ensures $O(1)$ upserts for budget limits.
