# ExpenseWise — Personal Finance Journal & Ledger

A full-stack, mobile-first personal finance web application and Progressive Web App (PWA) built with **Next.js 15 (App Router)**, **React 19**, **PostgreSQL**, **Prisma ORM**, and **Tailwind CSS v4**.

ExpenseWise combines daily expense tracking, smart Indian banking SMS/UPI clipboard parsing, monthly category budget pacing, peer lending and debt settlement ledgers, audit reports with CSV exports, executive administrative controls, and a dual-theme Soft UI Neumorphism / Linear Deep Onyx design system.

---

## 🚀 Quick Glance

| Area | Technology / Details |
| :--- | :--- |
| **Framework** | Next.js 15.2.1 (App Router, Server Actions, Route Handlers) |
| **Frontend Runtime** | React 19.0.0 (Server Components & Client Components) |
| **Styling** | Tailwind CSS v4.0.9 + CSS custom properties design tokens |
| **Design System** | Soft UI Neumorphism (Light Mode) & Linear/Vercel Deep Onyx (Dark Mode) |
| **Database** | PostgreSQL (Tested with Neon Serverless & Local PostgreSQL) |
| **ORM** | Prisma ORM 6.4.1 |
| **Authentication** | Stateless `HttpOnly` JWT cookie sessions (`jose` + `bcryptjs`) |
| **Data Visualization** | `recharts` 2.15.1 (Area charts, Donut charts, Bar charts) |
| **PWA Capabilities** | Cache-First Service Worker (`public/sw.js`), Web App Manifest, Standalone install |
| **Language** | 100% JavaScript (ESM / JSX) — No TypeScript |

---

## ✨ Core Features

- **📊 Consolidated Financial Dashboard**: Monthly burn rate, 6-month spending trajectory area chart, category donut breakdown, and rule-based in-memory spending anomaly & velocity insights.
- **💸 Expense Ledger & Multi-Field Filters**: Full CRUD expense journal with payment method tagging (`UPI`, `CASH`, `CREDIT_CARD`, `DEBIT_CARD`, `NET_BANKING`), server-side pagination, category filters, date ranges, and optimistic deletion.
- **📱 Smart SMS & UPI Parser**: In-browser regex parser supporting Indian bank transaction SMS (HDFC, SBI, ICICI, Axis, GPay, PhonePe, Paytm) with automated clipboard detection, merchant cleanup, category deduction, and bulk batch insertion.
- **🎯 Monthly Category Budget Pacing**: Category-specific budget ceilings, dynamic utilization gauges, pacing alerts, and real-time over-budget warnings.
- **🤝 Peer Lending & Debt Settlement**: Track receivables (`LENT`) and payables (`BORROWED`), contact directory management, partial/full settlement records with transaction audit history, and automatic balance recalculations.
- **📑 Audit Reports & CSV Export**: Interactive tabular ledgers with instant client-side CSV downloads for offline auditing.
- **🛡️ Executive Admin Portal (`/admin`)**: Role-based access (`ADMIN`), system-wide KPIs, searchable user directory with deep-dive activity inspector, global transaction stream, global category management, platform analytics charts, database latency health diagnostics, and 1-click JSON backup & master CSV export.
- **🌗 Theme Switcher**: Dual-theme support (Soft Neumorphic Warm Light & Linear/Vercel Deep Onyx Dark) with zero-flash client initialization.

---

## 🏗️ Architecture Overview

```text
Browser Client (React 19 + PWA Service Worker)
    │
    ├── Edge Middleware (Route Guards: auth_session cookie check)
    │
    ├── Server Components (Layouts, Role verification, Server-side data)
    │
    ├── Server Actions & REST API Route Handlers
    │      │
    │      ├── Input Validation (Zod schemas)
    │      ├── Auth Guard (requireAuth / requireAdmin)
    │      └── Data Access Layer (Prisma ORM singleton)
    │             │
    │             ▼
    │       PostgreSQL Database (Neon Serverless / Local)
```

---

## 📁 Repository Structure

```text
ExpenseWise/
├── actions/                  # Next.js Server Actions (CRUD, Auth, Admin, Dashboard)
├── app/                      # App Router: Pages, Layouts, API Route Handlers
│   ├── (auth)/               # Public Login & Signup pages
│   ├── (dashboard)/          # Authenticated App Shell (Dashboard, Expenses, Budgets, Debts, Reports, Admin)
│   └── api/                  # REST API Route Handlers (JSON endpoints)
├── components/               # UI components (Admin, Dashboard, Expenses, Layout, Theme, UI)
├── docs/                     # Comprehensive project documentation (16 guides + Feature Map)
├── lib/                      # Core helpers (auth, validations, smsParser, prisma, utils)
├── prisma/                   # Prisma Schema, migrations, and seed scripts
├── public/                   # PWA Service Worker, manifest, and icons
├── scripts/                  # CLI utilities (promote-admin, data migration, icon generation)
├── middleware.js             # Edge route protection & auth redirection
└── next.config.mjs           # Next.js optimization configuration
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **PostgreSQL**: PostgreSQL 14+ instance or Neon Serverless database

### 2. Clone & Install
```bash
git clone https://github.com/ronit1161/next-expense-app.git
cd next-expense-app
npm install
```

### 3. Setup Environment Variables
Create `.env.local` based on `.env.example`:
```bash
cp .env.example .env.local
```

Configure your variables in `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/expense_tracker?schema=public"
AUTH_SECRET="your-super-secret-random-jwt-key-min-32-characters"
```

### 4. Database Setup & Seed
```bash
# Generate Prisma Client
npx prisma generate

# Apply Database Migrations
npx prisma migrate dev --name init

# Seed Default Categories (Food, Travel, Shopping, Bills, etc.)
npm run prisma:seed
```

### 5. Run the Application
```bash
# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Essential Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production optimized bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint validation |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed default expense categories |
| `node scripts/promote-admin.js <email>` | Promote a registered user to `ADMIN` |

---

## 📚 Complete Documentation Index

For in-depth guides, architecture diagrams, and API specifications, explore the [`docs/`](./docs) directory:

- [**01. Project Overview**](./docs/01-overview.md): Purpose, concepts, scope, and technical stack.
- [**02. Feature Inventory**](./docs/02-features.md): Detailed inventory of all user and admin features.
- [**03. User Flows**](./docs/03-user-flows.md): Step-by-step UI to database operational flows.
- [**04. System Architecture**](./docs/04-architecture.md): App Router patterns, data flow, and diagrams.
- [**05. Project Structure**](./docs/05-project-structure.md): Directory breakdown and modification guide.
- [**06. Database Design**](./docs/06-database.md): Prisma schema, tables, relationships, indexes, and ER diagram.
- [**07. Authentication & Security**](./docs/07-authentication-security.md): JWT sessions, RBAC, Zod validation, and security posture.
- [**08. API & Server Actions**](./docs/08-api-server-actions.md): Complete reference table of all Server Actions & Route Handlers.
- [**09. Frontend Implementation**](./docs/09-frontend.md): Layout shell, components, styling system, and charts.
- [**10. Performance Optimizations**](./docs/10-performance.md): Caching, dynamic imports, bundle reduction, and PWA.
- [**11. Environment Setup Guide**](./docs/11-environment-setup.md): Complete local setup and developer guide.
- [**12. Deployment Guide**](./docs/12-deployment.md): Deploying on Vercel and connecting with Neon PostgreSQL.
- [**13. Testing Strategy**](./docs/13-testing.md): Automated verification, build validation, and manual test checklist.
- [**14. Troubleshooting Guide**](./docs/14-troubleshooting.md): Common errors, causes, solutions, and diagnostics.
- [**15. Technical Decisions**](./docs/15-decisions.md): Architecture Decision Records (ADRs) and design trade-offs.
- [**16. Changelog**](./docs/16-changelog.md): Chronological record of release milestones.
- [**FEATURE MAP**](./docs/FEATURE_MAP.md): Quick developer cheat sheet mapping UI → Component → Action → Model.

---

## 📄 License
Private project. All rights reserved.
