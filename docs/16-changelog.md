# 16 — Project Changelog

All notable changes to the ExpenseWise project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-09-15

### Added
- **Core Architecture**: Initialized Next.js 15 App Router architecture with React 19, Prisma ORM 6.4, and PostgreSQL database.
- **Authentication & Security**:
  - Stateless JWT session authentication in `HttpOnly` cookies via `jose` and `bcryptjs`.
  - Next.js Edge Middleware route guards for protected and auth route redirections.
  - Strict user-level data isolation (`requireAuth`) preventing IDOR vulnerabilities.
- **Financial Dashboard**:
  - Consolidated financial overview with Month Spend, Today Outflow, Remaining Margin, and Net Debt KPIs.
  - 6-Month Spending Trajectory area chart using `recharts`.
  - Category Allocation Donut Chart and spending breakdown progress meters.
  - Rule-based in-memory AI Financial Insights engine for budget breaches, velocity alerts, receivables, and spending spikes.
- **Expense Journal**:
  - Itemized expense table with category and date-range filters.
  - Modal and mobile bottom-sheet expense creation/edit drawers.
  - Optimistic UI updates for instant expense deletion.
- **Smart SMS & UPI Bank Parser**:
  - In-browser regex parser supporting Indian bank SMS (HDFC, SBI, ICICI, Axis, GPay, PhonePe, Paytm).
  - Automated clipboard detection, merchant cleanup, category mapping, and bulk batch logging via `prisma.expense.createMany`.
- **Monthly Budget Pacing**:
  - Category spending limit manager with monthly utilization gauges and over-budget breach indicators.
- **Peer Lending & Debts**:
  - Two-way loan ledger for money lent (`LENT`) and borrowed (`BORROWED`).
  - Contact auto-resolution and multi-installment settlement history with interactive database transactions.
- **Audit Reports & CSV Export**:
  - Multi-tab financial statements for Expense Ledgers, Category Aggregates, Budget Compliance, and Debts.
  - Instant client-side CSV export engine via browser Blob URLs.
- **Executive Admin Portal (`/admin`)**:
  - Role-based authorization (`requireAdmin`) with live database role verification.
  - Platform-wide KPI overview and recent user stream.
  - Paginated user directory with deep-dive Activity Inspector modal.
  - Global cross-user activity stream with multi-criteria filters.
  - Custom category manager with usage safety guards and cache invalidation.
  - Platform analytics charts (Recharts) for macro gross volume, category distribution, and user engagement tiers.
  - Database latency ping diagnostics (`SELECT 1`) and runtime memory metrics.
  - 1-Click full platform JSON snapshot backup and master CSV transaction exporter.
- **Design System & Theme Switcher**:
  - Soft UI Neumorphism design system with custom CSS property tokens.
  - Linear/Vercel Deep Onyx dark mode palette with glass borders and top-rim specular highlights.
  - Zero-flash theme initialization script in `app/layout.jsx`.
- **Progressive Web App (PWA)**:
  - Cache-First Service Worker (`public/sw.js`).
  - Web App Manifest (`public/manifest.json`) supporting standalone mobile display.
  - Smart `InstallPwaButton` with Chromium prompt detection and native iOS Safari installation guide.

### Performance
- Configured `optimizePackageImports` in `next.config.mjs` for `lucide-react` and `recharts`.
- Enabled Gzip/Brotli compression and stripped `x-powered-by` headers.
- Implemented in-memory server caching (`unstable_cache`) for global categories with `revalidateTag` invalidation.
- Dynamically imported Recharts components in the Admin portal (`ssr: false`), reducing initial admin bundle size from 122kB to 11.6kB (~90% reduction).
- Consolidated all 5 dashboard queries into a single parallel `Promise.all` round-trip.

---

## Instructions for Future Changelog Updates

When releasing new updates, maintainers should append a new version block at the top of this document using the following categories:

- **Added**: For new features.
- **Changed**: For changes in existing functionality.
- **Deprecated**: For soon-to-be-removed features.
- **Removed**: For now-removed features.
- **Fixed**: For any bug fixes.
- **Security**: In case of vulnerabilities or security enhancements.
- **Performance**: For optimizations and latency reductions.
