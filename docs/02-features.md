# 02 — Comprehensive Feature Inventory

This document provides a complete inventory of every feature implemented in ExpenseWise, including user-facing interfaces, interaction behavior, server actions, validation rules, database models, and edge cases.

---

## 1. Authentication & Session Management

### 1.1 User Registration
- **Purpose**: Creates a new user account with encrypted credentials and initiates a 7-day session.
- **Access**: Public / Unauthenticated visitors.
- **UI Location**: `/signup` ([`app/(auth)/signup/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(auth)/signup/page.jsx)).
- **Components**: Neumorphic Auth Form, Input fields with error labels, Submit state spinner.
- **Server Action**: `registerAction(data)` in [`actions/auth-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/auth-actions.js).
- **Database Model**: `User` (`id`, `name`, `email`, `passwordHash`, `role: 'USER'`).
- **Validation**:
  - `name`: Min 2 chars, max 100 chars.
  - `email`: Valid email format via Zod `z.string().email()`.
  - `password`: Min 6 chars, hashed via `bcrypt.hash(password, 10)`.
  - Unique email check in PostgreSQL (`prisma.user.findUnique`).
- **Edge Cases**: Duplicate email returns friendly inline error message without disclosing database internals.
- **Success Behavior**: Signs JWT via `jose` HS256, sets `auth_session` cookie (`httpOnly: true, sameSite: 'lax', path: '/'`), redirects to `/dashboard`.

### 1.2 User Login
- **Purpose**: Authenticates existing credentials and issues a secure session cookie.
- **Access**: Public / Unauthenticated visitors.
- **UI Location**: `/login` ([`app/(auth)/login/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(auth)/login/page.jsx)).
- **Server Action**: `loginAction(data)` in [`actions/auth-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/auth-actions.js).
- **Validation**: `loginSchema` (valid email, non-empty password). Password verification via `bcrypt.compare`.
- **Error Behavior**: Generic `"Incorrect email or password"` message to prevent account enumeration.
- **Redirection**: If `?redirect=/path` query param is present, redirects user to their requested destination after login.

### 1.3 User Logout
- **Purpose**: Terminates current authenticated session.
- **UI Location**: Sidebar user widget, Mobile bottom drawer widget.
- **Server Action**: `logoutAction()` in [`actions/auth-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/auth-actions.js).
- **Behavior**: Deletes `auth_session` cookie from `cookieStore`, performs client-side router redirect to `/login`.

---

## 2. Dashboard & Financial Pulse

### 2.1 Executive Summary KPI Cards
- **Purpose**: Instant glance at total monthly outflow, today's spend, top category, remaining budget pool, and net peer debts.
- **Access**: Authenticated Users.
- **UI Location**: `/dashboard` ([`app/(dashboard)/dashboard/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/dashboard/page.jsx)).
- **Server Action**: `getDashboardDataAction()` in [`actions/dashboard-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/dashboard-actions.js).
- **Calculated Metrics**:
  - **This Month's Spending**: Sum of all expenses within current calendar month.
  - **Today's Outflow**: Sum of expenses timestamped today (`00:00:00` to `23:59:59`).
  - **Highest Spending Category**: Ranked category with the largest cumulative total in current month.
  - **Remaining Budget Margin**: `Sum(Budget limits) - Month spending` (floor at ₹0).
  - **Net Peer Debt**: Calculated from non-settled `Loan` records (`Receivable` from `LENT` vs `Payable` from `BORROWED`).
- **Loading State**: Neumorphic pulse skeleton cards ([`components/ui/skeletons.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/ui/skeletons.jsx)).

### 2.2 6-Month Spending Trajectory Chart
- **Purpose**: Visualizes month-over-month expense progression across the last 6 calendar periods.
- **UI Component**: [`components/dashboard/SpendingTrendChart.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/dashboard/SpendingTrendChart.jsx).
- **Library**: `recharts` (`ResponsiveContainer`, `AreaChart`, `Area`, `XAxis`, `YAxis`, `Tooltip`).
- **Visuals**: Gradient stroke with soft blue underfill (`#0047FF`), custom currency tooltip with Indian numbering format.

### 2.3 Category Allocation Donut Breakdown
- **Purpose**: Proportional visualization of category distribution in current month.
- **Visuals**: Donut chart with category legend and percentage allocation meters.

### 2.4 Rule-Based AI Financial Insights Engine
- **Purpose**: In-memory rule engine evaluating spending velocity and budget health.
- **Execution**: Runs in `getDashboardDataAction` during dashboard query execution.
- **Rule Hierarchy**:
  1. `BUDGET_BREACH` (High Severity): Triggers when `spent > budgetLimit`.
  2. `BUDGET_WARNING` (Medium Severity): Triggers when `utilization >= 80%`.
  3. `VELOCITY_ALERT` (Low Severity): Triggers when spending pace exceeds calendar day progress ratio by >15%.
  4. `PENDING_RECEIVABLES` (Medium Severity): Reminds user of total outstanding money lent to peers.
  5. `PENDING_PAYABLES` (High Severity): Warns when total debts owed exceed ₹10,000.
  6. `MOM_SPENDING_SPIKE` (Medium Severity): Triggers when current month spend exceeds previous month total by ≥15%.
  7. `FINANCIAL_TIP` (Fallback): Displayed when all metrics are within safe thresholds.

---

## 3. Expense Journal & Management

### 3.1 Itemized Expense Table & Filters
- **Purpose**: Complete chronological ledger of personal expenses with multi-field filtering and pagination.
- **UI Location**: `/expenses` ([`app/(dashboard)/expenses/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/expenses/page.jsx)).
- **Server Action**: `getExpensesAction({ page, limit, categoryId, startDate, endDate })` in [`actions/expense-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/expense-actions.js).
- **Features**:
  - Category dropdown filter.
  - Date range filters (`startDate`, `endDate`).
  - Payment method badges (`UPI`, `Cash`, `Credit Card`, `Debit Card`, `Net Banking`).
  - Server-side pagination with 10 records per page.
  - Optimistic UI instant deletion on delete trigger.

### 3.2 Add & Edit Expense Modal / Bottom Sheet
- **Purpose**: Modal on desktop / slide-up bottom sheet on mobile to record or edit expense entries.
- **Server Actions**: `createExpenseAction(data)` and `updateExpenseAction(id, data)`.
- **Validation**: `expenseSchema` in [`lib/validations.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/validations.js) (positive amount, valid category ID, valid ISO date `YYYY-MM-DD`, payment method enum).
- **Revalidation**: Calls `revalidatePath('/dashboard')`, `revalidatePath('/expenses')`, `revalidatePath('/budgets')`, and `revalidatePath('/reports')`.

### 3.3 Smart SMS & UPI Bank Transaction Parser
- **Purpose**: Zero-friction expense logging by parsing Indian bank alert SMS text from the clipboard.
- **UI Component**: [`components/expenses/SmsParserModal.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/expenses/SmsParserModal.jsx).
- **Parser Engine**: [`lib/smsParser.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/smsParser.js).
- **Capabilities**:
  - **Clipboard Auto-Detection**: Uses `navigator.clipboard.readText()` to auto-detect pasted bank alert text upon opening modal.
  - **Supported Formats**: Single and bulk pasted SMS from HDFC, SBI, ICICI, Axis, Kotak, GPay, PhonePe, Paytm, CRED, Amazon Pay.
  - **Amount Extraction**: Matches `Rs. 450.00`, `INR 1,200`, `₹350`, `debited by 500`.
  - **Merchant Cleaning**: Strips bank routing noise (`VPA`, `UPI`, `REF NO`, `XX1234`) to extract clean vendor names (e.g. `Swiggy`, `Uber`, `Blinkit`).
  - **Category Auto-Mapping**: Matches merchant keywords to 7 category buckets (`Food`, `Travel`, `Shopping`, `Entertainment`, `Bills`, `Medical`, `Education`, fallback to `Others`).
  - **Batch Insertion**: `createBatchExpensesAction(expensesList)` logs multiple parsed transactions into PostgreSQL in a single database round-trip via `prisma.expense.createMany`.

---

## 4. Monthly Category Budget Pacing

### 4.1 Budget Limits & Ceiling Gauges
- **Purpose**: Establish monthly spending limits per category and monitor real-time utilization.
- **UI Location**: `/budgets` ([`app/(dashboard)/budgets/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/budgets/page.jsx)).
- **Server Action**: `getBudgetStatusAction(year, month)` in [`actions/budget-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/budget-actions.js).
- **Calculations**:
  - Aggregates actual expenses per category using `prisma.expense.groupBy`.
  - Computes `spentAmount`, `remainingAmount`, `utilizationPercentage`, and `isOverBudget` flag.
- **Visuals**: Color-coded progress meters (Blue `<80%`, Amber `80-99%`, Red `100%+` breach).

### 4.2 Set / Update Budget Ceilings
- **Server Action**: `setBudgetAction(data)` using `prisma.budget.upsert` on composite key `[userId, categoryId, month, year]`.
- **Validation**: `budgetSchema` (positive amount, valid month `1-12`, valid year `2000-2100`).

### 4.3 Delete Budget Limit
- **Server Action**: `deleteBudgetAction(id)`. Validates record ownership before deletion.

---

## 5. Peer Lending & Debt Settlement Ledger

### 5.1 Peer Loan Register
- **Purpose**: Track informal receivables (`LENT` / money given) and payables (`BORROWED` / money taken).
- **UI Location**: `/debts` ([`app/(dashboard)/debts/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/debts/page.jsx)).
- **Server Action**: `getLoansAction({ type, status })` in [`actions/loan-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/loan-actions.js).
- **Entities Involved**: `Contact`, `Loan`, `LoanSettlement`.
- **Metrics**: Total outstanding receivables vs payables.

### 5.2 Contact Management
- **Behavior**: When creating a loan, the contact name is matched against existing user contacts via `prisma.contact.findFirst({ where: { userId, name } })`. If non-existent, a new `Contact` entity is automatically created in the same flow.

### 5.3 Partial & Full Settlement Logging
- **Purpose**: Record repayment installments against an open debt.
- **Server Action**: `recordSettlementAction(loanId, data)` in [`actions/loan-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/loan-actions.js).
- **Execution**: Uses an interactive database transaction (`prisma.$transaction`) to:
  1. Validate loan ownership and ensure `settleAmount <= remainingAmount`.
  2. Create a `LoanSettlement` entry with payment method and notes.
  3. Recalculate `remainingAmount` and update loan status (`PENDING` ➔ `PARTIAL` ➔ `SETTLED`).

### 5.4 Audit Trail History
- **Server Action**: `getLoanDetailsAction(id)` returns full installment history per debt record.

---

## 6. Audit Reports & CSV Export

### 6.1 Multi-Tab Financial Statements
- **Purpose**: Printable and exportable audit views.
- **UI Location**: `/reports` ([`app/(dashboard)/reports/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/reports/page.jsx)).
- **Tabs**:
  1. **Expense Ledger**: Itemized historical transactions.
  2. **Category Aggregates**: Grouped total spend and transaction counts by category.
  3. **Budget Compliance**: Limit vs actual spend compliance ledger.
  4. **Debt Statements**: Peer loan register and settlement status report.

### 6.2 Instant CSV Exporter
- **Engine**: [`lib/utils.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/utils.js) `downloadCSV(filename, csvData)`.
- **Execution**: Constructs standard RFC-compliant CSV strings in browser memory and triggers zero-latency client-side blob downloads.

---

## 7. Executive Admin Portal (`/admin`)

> **Security Note**: Access is restricted via `requireAdmin()` in [`lib/auth.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/auth.js) and guarded in the UI.

### 7.1 Executive Platform Overview (Tab 1)
- **Server Action**: `getAdminOverviewAction()` in [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js).
- **Metrics**: Total Registered Users, Platform Total Expenses, Gross Transaction Volume, Total Loan Volume, System-Wide Remaining Debt, Average Spend Per User, and 5 Most Recent Users.

### 7.2 User Directory & Activity Inspector (Tab 2)
- **Server Action**: `getAdminUsersAction({ search, page, limit })`.
- **Search**: Case-insensitive substring search across name and email.
- **Activity Inspector Modal**: `getAdminUserDetailAction(userId)` displays complete historical expenses, budgets, and loans for any inspected user.

### 7.3 Global Activity Stream (Tab 3)
- **Server Action**: `getAdminAllActivitiesAction({ page, limit, userId, categoryId, search })`.
- **Features**: Live cross-user transaction feed with multi-criteria filters.

### 7.4 Category Management (Tab 4)
- **Server Actions**: `createCategoryAction(data)` and `deleteCategoryAction(categoryId)`.
- **Safety Rule**: Deletion is rejected if any existing expense records reference the category (`onDelete: Restrict` in Prisma).
- **Cache Invalidation**: Triggers `revalidateTag('categories')` to instantly purge cached category dropdowns across all user sessions.

### 7.5 Platform Analytics & Macro Trends (Tab 5)
- **UI Component**: [`components/admin/AdminAnalyticsCharts.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/admin/AdminAnalyticsCharts.jsx) (Dynamically loaded with `ssr: false`).
- **Charts**:
  - 6-Month Gross Volume Area Chart.
  - Global Category Spending Donut Chart.
  - Payment Method Distribution Bar Chart.
  - User Engagement Tiers (Active `<7d`, Occasional `<30d`, Dormant `>30d`).

### 7.6 System Health Diagnostics & Ping Latency (Tab 6)
- **Server Action**: `getAdminSystemHealthAction()`.
- **Diagnostics**:
  - Live Neon PostgreSQL Ping latency (`SELECT 1 as ping`) in milliseconds.
  - Database table row counts (`users`, `expenses`, `budgets`, `loans`, `settlements`, `categories`).
  - Node.js runtime stats (Memory Heap Used / Total in MB, Process Uptime, Node Version, Environment).

### 7.7 Backup & Master Export
- **1-Click JSON Platform Backup**: `getAdminBackupSnapshotAction()` exports entire platform relational data snapshot as a JSON structure.
- **Master Platform CSV Export**: `getAdminMasterCsvAction({ startDate, endDate })` streams all system transactions into a master spreadsheet.

---

## 8. Progressive Web App (PWA) & Standalone Support

- **Manifest**: [`public/manifest.json`](file:///d:/Sunbeam/Project/Expense-tracker/public/manifest.json) configured for standalone display mode, `#EAE6DF` theme background, and application icons.
- **Service Worker**: [`public/sw.js`](file:///d:/Sunbeam/Project/Expense-tracker/public/sw.js) registers a Cache-First strategy for static JS/CSS assets, fonts, icons, and offline fallbacks.
- **Install Trigger**: [`components/ui/InstallPwaButton.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/ui/InstallPwaButton.jsx) captures `beforeinstallprompt` event on Chromium and provides native iOS "Add to Home Screen" instructions on Safari.

---

## 9. Dual-Theme Engine (Light & Dark Mode)

- **Context Provider**: [`components/theme/ThemeProvider.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/theme/ThemeProvider.jsx).
- **Design Tokens**: Defined in [`app/globals.css`](file:///d:/Sunbeam/Project/Expense-tracker/app/globals.css).
  - **Light Theme**: Soft UI Neumorphism with dual-tone drop shadows (`--bg-main: #EAE6DF`, `--neu-flat: 6px 6px 14px #D1CCC4, -6px -6px 14px #FFFFFF`).
  - **Dark Theme**: Linear/Vercel Deep Onyx glassmorphism (`--bg-main: #090A0F`, `--bg-surface: #12151F`, top-rim specular highlights `inset 0 1px 0 0 rgba(255, 255, 255, 0.09)`).
- **Anti-Flash Script**: Synchronous `localStorage` / `prefers-color-scheme` check in `<head>` of [`app/layout.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/layout.jsx) prevents light-mode flashes on dark mode page loads.
