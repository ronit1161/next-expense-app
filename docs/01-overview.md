# 01 — Project Overview

## 1. Executive Summary

**ExpenseWise** is a full-stack, mobile-first personal finance journal and transaction ledger web application built with **Next.js 15 (App Router)**, **React 19**, **PostgreSQL**, **Prisma ORM**, and **Tailwind CSS v4**.

It is engineered to replace fragmented spreadsheets and manual budgeting apps with a unified, high-performance financial workstation. It provides daily expense logging, automated Indian bank SMS/UPI clipboard parsing, monthly category budget pacing with pacing velocity algorithms, peer debt management (receivables & payables) with multi-stage settlement logs, audit reporting with CSV exports, executive admin operations, and a dual-theme design system (Soft UI Neumorphism & Linear Deep Onyx).

---

## 2. Problem Statement & Purpose

### The Problem
- **Logging Friction**: Recording every daily micro-transaction (chai, groceries, cab fares) into standard finance apps takes too many clicks and form fields.
- **Peer Debt Blindspots**: Informal lending and borrowing between friends, colleagues, and family is rarely tracked alongside primary expenses, leading to forgotten receivables and unbalanced cash flow.
- **Budget Ceiling Breaches**: Users set monthly budget targets but have no real-time pacing alerts to warn them before they exhaust category allocations halfway through the billing cycle.
- **Platform Management Overhead**: Typical self-hosted financial trackers lack centralized administrative tooling for database health diagnostics, platform-wide metrics, and automated disaster-recovery backups.

### The ExpenseWise Solution
- **Instant Digital Ledger**: Low-latency expense creation with keyboard shortcuts and mobile bottom-sheet drawers.
- **Smart SMS & UPI Parsing**: In-browser regex parser that reads copied bank alert SMS (HDFC, SBI, ICICI, Axis, Paytm, GPay, PhonePe) and auto-populates amounts, merchants, dates, and category mappings.
- **Proactive In-Memory Financial Engine**: Real-time evaluation of spending velocity, budget utilization tiers (>80%, 100%+), and month-over-month spending spikes.
- **Complete Peer Lending Workflow**: Dedicated ledger for money lent (`LENT`) and borrowed (`BORROWED`) with contact management and partial settlement audit trails.
- **Executive Admin Controls**: Dedicated `/admin` suite for user activity auditing, global category configuration, Recharts analytics, database latency diagnostics, and 1-click full JSON backup / master CSV export.

---

## 3. Core Concepts & Domain Entities

| Concept | Description |
| :--- | :--- |
| **User** | A registered identity with role-based access (`USER` or `ADMIN`), authenticating via stateless `HttpOnly` JWT sessions. |
| **Category** | Global spending taxonomy (e.g., Food, Travel, Shopping, Bills, Medical, Education, Entertainment, Others) with designated icons and hex colors. |
| **Expense** | An itemized debit entry associated with a User, Category, Amount (`DECIMAL(12,2)`), Payment Method (`CASH`, `UPI`, `CREDIT_CARD`, `DEBIT_CARD`, `NET_BANKING`), and Date (`DATE`). |
| **Budget** | A monthly spending threshold per category for a specific month and year (`userId + categoryId + month + year` composite key). |
| **Contact** | A peer entity associated with a User for recording informal loans and settlements. |
| **Loan** | A debt record classified as `LENT` (Receivable) or `BORROWED` (Payable), with initial amount, remaining balance, and status (`PENDING`, `PARTIAL`, `SETTLED`). |
| **LoanSettlement** | An itemized payment transaction against a Loan record with date, amount, payment method, and audit notes. |

---

## 4. Major Modules

```text
                               ┌────────────────────────────────┐
                               │       ExpenseWise Modules      │
                               └────────────────┬───────────────┘
                                                │
         ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
         │                  │                   │                   │                  │
         ▼                  ▼                   ▼                   ▼                  ▼
┌─────────────────┐┌─────────────────┐┌─────────────────┐┌─────────────────┐┌─────────────────┐
│ Authentication  ││ Financial Pulse ││ Expense Journal ││ Budget Pacing   ││ Peer Debt Ledger│
│ & Route Guards  ││ & AI Insights   ││ & SMS Parser    ││ & Ceiling Alerts││ & Settlements   │
└─────────────────┘└─────────────────┘└─────────────────┘└─────────────────┘└─────────────────┘
         │                                                                             │
         ├─────────────────────────────────────────────────────────────────────────────┤
         │                                                                             │
         ▼                                                                             ▼
┌─────────────────────────────────┐                                           ┌─────────────────┐
│     Executive Admin Portal      │                                           │  Audit Reports  │
│   (KPIs, Health, Backups, CSV)  │                                           │  & CSV Export   │
└─────────────────────────────────┘                                           └─────────────────┘
```

1. **Authentication & Session Module (`/login`, `/signup`)**: Stateless JWT cookie session lifecycle with Next.js edge route protection.
2. **Financial Pulse & Dashboard Module (`/dashboard`)**: Unified data-fetching pipeline computing monthly totals, 6-month trends, category allocation donuts, and rule-based in-memory insights.
3. **Expense Journal & SMS Automation (`/expenses`)**: Filterable, paginated expense log with quick-entry modals and smart bank SMS clipboard parser.
4. **Budget Management Module (`/budgets`)**: Monthly limit manager with visual utilization bars and over-budget breach flags.
5. **Peer Lending & Debts Module (`/debts`)**: Two-way loan tracker with contact directory and settlement modal.
6. **Reporting & Auditing Module (`/reports`)**: Interactive multi-tab data tables with instant client-side CSV downloads.
7. **Executive Admin Portal (`/admin`)**: Platform KPI cards, user directory with deep-dive inspection, category editor, database ping latency diagnostics, and 1-click platform backups.

---

## 5. Technology Stack Summary

- **Framework**: Next.js 15.2.1 (App Router)
- **Frontend Core**: React 19.0.0 (Server & Client Components)
- **Language**: JavaScript (ESM / JSX) — 100% JavaScript, zero TypeScript
- **Database**: PostgreSQL (tested on Neon Serverless & Local PostgreSQL 14+)
- **ORM**: Prisma Client & Prisma CLI 6.4.1
- **Styling**: Tailwind CSS v4.0.9 + PostCSS 8.5.3 + custom CSS custom property tokens
- **Session Security**: `jose` (v6.0.8) for HS256 JWT signing + `bcryptjs` (v3.0.2) for password hashing
- **Schema Validation**: `zod` (v3.24.2)
- **Visualizations**: `recharts` (v2.15.1)
- **Icons**: `lucide-react` (v1.16.0)
- **PWA & Caching**: Cache-First Service Worker (`public/sw.js`), Web App Manifest, `unstable_cache` with tag revalidation

---

## 6. Architectural Characteristics

- **Zero-Waterfall Dashboard**: The primary dashboard fetches all summary stats, trend lines, category sums, budgets, and loans in a single consolidated parallel database query (`Promise.all`), eliminating waterfall round-trips.
- **Strict Data Isolation**: Every mutation and query validates user ownership against the verified session (`userId: user.id`), preventing Insecure Direct Object References (IDOR).
- **Edge Route Guards**: Next.js `middleware.js` inspects `auth_session` JWT before requests reach route handlers or server components.
- **Optimistic UI Updates**: Expense deletion triggers immediate optimistic removal from the UI state before awaiting database completion.
- **Adaptive Dual-Theme Engine**: Built with CSS custom properties (`--bg-main`, `--bg-surface`, `--text-primary`, `--neu-flat`), with an inline anti-flash script in `app/layout.jsx`.

---

## 7. Current Application Scope & Boundaries

### Included & Implemented
- Full expense lifecycle with multi-field search and date range filters.
- Smart SMS & UPI parser for Indian bank alerts.
- Category budget limits with real-time spend aggregation.
- Peer lending with multi-installment partial settlements.
- Client-side and server-side CSV exports.
- Executive Admin Portal with user activity inspection and platform backup.
- Offline static caching via PWA Service Worker.

### Current Scope Boundaries / Limitations
- **Currency**: Formatted in Indian Rupees (`INR` / `₹`) using `Intl.NumberFormat('en-IN')`. Multi-currency conversion is not currently implemented.
- **OAuth Providers**: Authentication uses email and password credentials. Third-party social logins (Google, GitHub) are not implemented.
- **Automated Bank Sync**: SMS parsing is done via manual clipboard paste in-browser; direct Open Banking / Account Aggregator API integration is not implemented.
- **Recurring Transactions**: Subscriptions and auto-debits must be logged manually or via SMS parser; scheduled automated cron-based expense creation is not currently implemented.
