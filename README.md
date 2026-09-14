# ExpenseWise — Personal Expense Tracker & Financial Ledger

A modern, full-stack personal finance and expense tracking application built with **Next.js (App Router)**, **JavaScript**, **PostgreSQL**, **Prisma ORM**, and **Tailwind CSS**.

Featuring a luxury **Obsidian Luxury Space Black** glassmorphism aesthetic inspired by Apple Vision Pro, with real-time financial insights, budget limit monitors, peer lending/borrowing registers, and CSV audit reports.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router) — Server Components & Client Components
- **Language**: JavaScript (ESM / JSX) — *100% JavaScript, No TypeScript*
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **Styling**: Tailwind CSS v4 with custom Obsidian Glassmorphism theme
- **Authentication**: Secure JWT sessions in `HttpOnly` cookies via `jose` + password hashing via `bcryptjs`
- **Validation**: Server-side and client-side validation with `zod`
- **Data Visualizations**: `recharts` (Area Charts & Donut/Pie Charts)
- **Icons**: `lucide-react`

---

## 🏛️ Architecture

```
                      Next.js (App Router)
                ┌───────────────────────────────┐
                │  React 19 UI (Glassmorphic)   │
                │               ↕               │
                │ Server Actions / REST Routes  │
                │               ↕               │
                │        Session Auth           │
                └───────────────┬───────────────┘
                                │
                            Prisma ORM
                                │
                                ▼
                           PostgreSQL
```

---

## ✨ Features

1. **Authentication & User Security**
   - User registration and login with `bcryptjs` password hashing.
   - Secure stateless `HttpOnly` JWT cookie session management with Next.js Edge Middleware route guards.
   - Strict server-side user data isolation: all queries and mutations enforce user ownership.

2. **Real-time Financial Dashboard**
   - Key indicators: Monthly spend vs. budget limit, today's outflow, highest spending category, and peer net debt position.
   - 6-Month Spending Trajectory area chart with gradient fill.
   - Category allocation donut chart and spending breakdown progress meters.
   - **Rule-based AI Financial Insights Engine**: Live alerts for budget breaches, >80% utilization warnings, calendar pacing velocity violations, pending receivable/payable reminders, and month-over-month spending spikes.

3. **Expense Journal & Management**
   - Full CRUD: Add, view, edit, and delete expense entries.
   - Categorization with custom icons and color-coding.
   - Payment method classification (`UPI / QR`, `Cash`, `Credit Card`, `Debit Card`, `Net Banking`).
   - Server-side pagination and multi-field filtering (by category and date range).

4. **Monthly Budget Pacing**
   - Establish monthly spending limits per category with month/year selectors.
   - Real-time utilization calculation, progress bars, and over-budget breach indicators.
   - Aggregate summary stats (Total Target Pool, Current Spend, Residual Margin).

5. **Peer Debt Register (Lending & Borrowing)**
   - Track money lent (`LENT` / Receivable) and borrowed (`BORROWED` / Payable).
   - Dynamic contacts directory with inline new contact creation.
   - Partial and full debt settlement logging with audit trail history.
   - Automatic balance updates and `PENDING` ➔ `PARTIAL` ➔ `SETTLED` status transitions.

6. **Audit Reports & CSV Data Exporter**
   - Interactive data tables for Expense Ledgers, Category Aggregates, Budget Pacing, and Debt Registers.
   - Instant client-side CSV export for offline records and audits.

---

## 📁 Project Structure

```text
expense-tracker/
├── actions/                         # Next.js Server Actions
│   ├── auth-actions.js
│   ├── budget-actions.js
│   ├── dashboard-actions.js
│   ├── expense-actions.js
│   └── loan-actions.js
├── app/                             # Next.js App Router
│   ├── (auth)/                      # Public Auth Routes
│   │   ├── login/page.jsx
│   │   └── signup/page.jsx
│   ├── (dashboard)/                 # Protected Application Routes
│   │   ├── layout.jsx
│   │   ├── dashboard/page.jsx
│   │   ├── expenses/page.jsx
│   │   ├── budgets/page.jsx
│   │   ├── debts/page.jsx
│   │   └── reports/page.jsx
│   ├── api/                         # REST Route Handlers
│   │   ├── auth/...
│   │   ├── budgets/...
│   │   ├── dashboard/...
│   │   ├── expenses/...
│   │   └── loans/...
│   ├── globals.css                  # Obsidian Glassmorphism Theme & Tokens
│   ├── layout.jsx
│   └── page.jsx                     # Root Router Redirection
├── components/                      # UI & Layout Components
│   ├── layout/
│   │   └── DashboardLayoutClient.jsx
│   └── ui/
│       └── CategoryIcon.jsx
├── lib/                             # Shared Utilities & Helpers
│   ├── auth.js                      # JWT and password session helpers
│   ├── prisma.js                    # Global Prisma singleton client
│   ├── utils.js                     # Formatting and CSV utilities
│   └── validations.js               # Zod validation schemas
├── prisma/                          # Database Schema & Seeds
│   ├── schema.prisma                # PostgreSQL data models & enums
│   └── seed.js                      # Default category seeds
├── scripts/                         # Migration Scripts
│   └── migrate-mysql-to-postgres.js # MySQL to PostgreSQL data importer
├── middleware.js                    # Edge Route Protection Middleware
├── next.config.mjs
├── postcss.config.mjs
├── jsconfig.json
├── .env.example
├── .env.local
└── package.json
```

---

## 🛠️ Installation & Local Setup

### 1. Prerequisites
- Node.js (v18.17+ or v20+)
- PostgreSQL database instance

### 2. Clone and Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and set your PostgreSQL connection string and secret key:
```bash
cp .env.example .env.local
```

Example `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/expense_tracker?schema=public"
AUTH_SECRET="your-super-secret-random-jwt-key-min-32-characters"
```

### 4. Initialize Database with Prisma
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations to PostgreSQL
npx prisma migrate dev --name init

# Seed default expense categories
npm run prisma:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 Migrating Existing MySQL Data (Optional)

If you have existing data in MySQL that you want to import into PostgreSQL:
1. Ensure your PostgreSQL database is initialized and migrated.
2. In `.env.local`, configure your MySQL credentials:
   ```env
   MYSQL_HOST="localhost"
   MYSQL_PORT=3306
   MYSQL_USER="root"
   MYSQL_PASSWORD="your_mysql_password"
   MYSQL_DATABASE="expense_tracker"
   ```
3. Run the automated data migration script:
   ```bash
   node scripts/migrate-mysql-to-postgres.js
   ```

---

## 📦 Production Build

To build and validate the application for production:
```bash
npm run build
npm run start
```
