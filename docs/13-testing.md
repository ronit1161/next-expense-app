# 13 — Testing Strategy & Quality Assurance

This document details the current testing implementation, build verification mechanisms, and a comprehensive manual testing checklist for ExpenseWise.

---

## 1. Automated Testing Implementation Status

| Test Category | Implementation Status | Current Tools / Framework |
| :--- | :--- | :--- |
| **Static Build Verification** | **IMPLEMENTED** | `next build` (compiles all 26 routes, validates JSX and imports) |
| **Linting & Code Style** | **IMPLEMENTED** | `next lint` (ESLint Next.js rules) |
| **Unit Tests (Jest / Vitest)** | **NOT IMPLEMENTED** | No automated unit test runner currently in `package.json` |
| **End-to-End Tests (Playwright / Cypress)** | **NOT IMPLEMENTED** | No automated browser testing suite currently configured |
| **API Integration Tests (Supertest)** | **NOT IMPLEMENTED** | API route handlers tested manually / through Server Actions |

---

## 2. Automated Quality Verification Commands

### 2.1 Static Build & Route Compilation
Running `npm run build` acts as a static integration test, verifying that all Server Components, Client Components, dynamic imports, and route handlers compile without syntax or packaging errors:
```bash
npm run build
```
*Expected Output*: Exit code `0` with green status across all 26 App Router routes.

### 2.2 ESLint Validation
```bash
npm run lint
```

---

## 3. Comprehensive Manual Testing Checklist

When making changes to the codebase, verify features using this functional checklist:

### 3.1 Authentication & Route Guards
- [ ] **Registration**: Register a new user (`/signup`). Verify password validation (min 6 chars) and unique email constraint.
- [ ] **Login**: Sign in with valid credentials (`/login`). Verify `auth_session` cookie is issued.
- [ ] **Invalid Login**: Attempt login with wrong password. Verify user-friendly error message is displayed.
- [ ] **Edge Redirects**: Attempt to access `/dashboard` while unauthenticated ➔ Redirects to `/login?redirect=/dashboard`.
- [ ] **Auth Redirects**: Attempt to access `/login` while authenticated ➔ Redirects to `/dashboard`.
- [ ] **Sign Out**: Click "Sign Out". Verify cookie is cleared and user is redirected to `/login`.

### 3.2 Financial Dashboard
- [ ] **KPI Calculations**: Verify Month Spend, Today Outflow, and Remaining Margin match actual transaction sums.
- [ ] **Spending Trajectory Chart**: Verify 6-month area chart renders without NaN or layout jitter.
- [ ] **Category Donut Breakdown**: Verify percentages total 100% and hover tooltips show accurate values.
- [ ] **AI Financial Insights**: Test triggering budget breach and mom spending spike warnings.

### 3.3 Expense Management & SMS Parser
- [ ] **Create Expense**: Add an expense with Category, Amount, Payment Method, and Date. Verify row appears in ledger.
- [ ] **Edit Expense**: Update amount and description. Verify changes persist.
- [ ] **Optimistic Deletion**: Delete an expense. Verify row disappears instantly without page reload.
- [ ] **Filters**: Filter by category and date range (`startDate`, `endDate`). Verify results update.
- [ ] **Pagination**: Navigate between pages with >10 transactions.
- [ ] **SMS Parser (Single)**: Paste an HDFC/SBI/GPay debit SMS. Verify auto-extracted amount, merchant, and category.
- [ ] **SMS Parser (Bulk)**: Paste multi-line transaction SMS. Verify batch insert logs all records.

### 3.4 Monthly Budget Pacing
- [ ] **Set Budget**: Set a budget ceiling for a category.
- [ ] **Utilization Meters**: Log expenses under that category and verify progress bar colors (Blue `<80%`, Amber `80-99%`, Red `≥100%`).
- [ ] **Month / Year Selector**: Switch between calendar periods and verify historical budgets load.

### 3.5 Peer Lending & Debts
- [ ] **Create Loan (`LENT`)**: Create a loan to a new contact name. Verify Contact is auto-created.
- [ ] **Create Loan (`BORROWED`)**: Create a payable loan. Verify total payable updates.
- [ ] **Partial Settlement**: Record an installment. Verify loan status transitions to `PARTIAL` and balance drops.
- [ ] **Full Settlement**: Repay entire remaining balance. Verify status transitions to `SETTLED`.

### 3.6 Audit Reports & CSV Export
- [ ] **Tab Navigation**: Toggle between Expense Ledger, Category Aggregates, Budget Compliance, and Debt Statements.
- [ ] **CSV Download**: Click "Download CSV" on each tab. Verify downloaded file opens correctly in Excel/Sheets with proper formatting.

### 3.7 Executive Admin Portal (`/admin`)
- [ ] **Access Guard**: Attempt to open `/admin` as a standard user (`role: USER`) ➔ Verify access is forbidden.
- [ ] **Overview KPIs**: Verify Gross Volume, Total Users, and Total Loans reflect real platform totals.
- [ ] **User Directory**: Search users by name/email and open Activity Inspector modal.
- [ ] **Category Manager**: Create a new category with icon and hex color. Verify it appears in user dropdowns.
- [ ] **System Health Diagnostics**: Verify database latency ping (in ms) and RAM heap usage metrics load.
- [ ] **JSON Backup & Master CSV**: Click "Download JSON Snapshot" and "Master CSV". Verify exports contain complete platform records.

### 3.8 PWA & Theme Switcher
- [ ] **Theme Switcher**: Toggle between Light and Dark mode. Verify instant theme change without page flicker.
- [ ] **Anti-Flash Verification**: Hard-refresh page in dark mode. Verify no white flash occurs before mount.
- [ ] **Service Worker**: Verify `sw.js` registers in DevTools (Application ➔ Service Workers).
