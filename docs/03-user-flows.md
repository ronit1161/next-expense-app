# 03 — End-to-End User Flows

This document details the actual end-to-end execution flows across ExpenseWise, tracing operations from user actions through components, server actions, validation, Prisma ORM, PostgreSQL transactions, and UI updates.

---

## 1. Authentication & Session Flow

```text
User fills Signup/Login Form
       │
       ▼
React Form Component (app/(auth)/login/page.jsx or signup/page.jsx)
       │ (Submits state payload)
       ▼
Server Action (loginAction / registerAction in actions/auth-actions.js)
       │
       ├── Validation: Zod Schema (registerSchema / loginSchema in lib/validations.js)
       │
       ├── Cryptographic Check: bcrypt.compare() or bcrypt.hash()
       │
       ├── Database Query: prisma.user.findUnique / prisma.user.create
       │
       ├── JWT Signing: jose.SignJWT with 7-day expiration (HS256)
       │
       └── Cookie Injection: cookieStore.set('auth_session', token, { httpOnly: true, sameSite: 'lax' })
       │
       ▼
Client Redirects to /dashboard (or ?redirect destination)
```

### Detailed Steps:
1. **User Action**: Enters email and password on `/login`.
2. **Client Validation**: Checks basic field presence before dispatching action.
3. **Server Action Dispatch**: Calls `loginAction({ email, password })`.
4. **Zod Validation**: Validates string formatting and email syntax.
5. **Database Lookup**: Queries `prisma.user.findUnique({ where: { email } })`.
6. **Password Verification**: Evaluates bcrypt hash match.
7. **Session Token Issuance**: Signs JWT containing `{ id, email, name, role }` using `AUTH_SECRET`.
8. **Cookie Response**: Injects `auth_session` cookie into the HTTP response.
9. **UI Update**: Router performs `router.push('/dashboard')` and refreshes auth context.

---

## 2. Dashboard Loading & Analytics Flow

```text
User navigates to /dashboard
       │
       ▼
Edge Middleware (middleware.js)
       │ (Verifies 'auth_session' JWT token; allows request)
       ▼
Server Component (app/(dashboard)/layout.jsx)
       │ (Fetches user role/identity; renders DashboardLayoutClient)
       ▼
Client Page Component (app/(dashboard)/dashboard/page.jsx)
       │ (Invokes getDashboardDataAction() in useEffect)
       ▼
Consolidated Server Action (actions/dashboard-actions.js)
       │
       ├── Authentication Check: requireAuth() -> verifies user session
       │
       └── Parallel Database Round-Trip (Promise.all):
             ├── prisma.category.findMany()
             ├── prisma.expense.findMany(Last 6 months + Current month)
             ├── prisma.budget.findMany(Current month + year)
             ├── prisma.loan.findMany(status != 'SETTLED')
             └── prisma.expense.aggregate(Previous month sum)
       │
       ├── In-Memory Computations:
             ├── 6-Month Trend Array
             ├── Category Allocation Sums & Ranking
             ├── Net Receivable vs Payable Totals
             └── Rule-Based Financial Insights Evaluation
       │
       ▼
Response: { success: true, data: { summary, analytics, insights } }
       │
       ▼
UI Hydration: Metric Cards, Recharts Area/Donut Charts, Insights Alerts
```

---

## 3. Expense Creation Flow (Standard Form)

```text
User clicks "+ Record Entry"
       │
       ▼
Expense Modal / Bottom Sheet opens (app/(dashboard)/expenses/page.jsx)
       │
       ├── User enters: Amount (₹), Category, Date, Description, Payment Method
       │
       ▼
Server Action: createExpenseAction(data) (actions/expense-actions.js)
       │
       ├── Auth Guard: requireAuth() ensures authenticated user
       ├── Zod Validation: expenseSchema parses amount, categoryId, date, enum
       │
       ├── Database Mutation:
       │     prisma.expense.create({
       │       data: { userId, categoryId, amount, description, paymentMethod, expenseDate }
       │     })
       │
       └── Next.js Cache Invalidation:
             revalidatePath('/dashboard')
             revalidatePath('/expenses')
             revalidatePath('/budgets')
             revalidatePath('/reports')
       │
       ▼
Response: { success: true, expense: {...} }
       │
       ▼
Client State: Appends record to table, closes modal, shows success toast
```

---

## 4. Smart SMS & UPI Clipboard Parsing Flow

```text
User copies Bank SMS -> Opens "Smart SMS Parser" Modal
       │
       ▼
SmsParserModal (components/expenses/SmsParserModal.jsx)
       │ (Auto-reads clipboard via navigator.clipboard.readText())
       ▼
In-Browser Regex Parser (lib/smsParser.js: parseBulkSms)
       │
       ├── Detects Debit Marker: 'debited', 'spent', 'paid to', 'vpa'
       ├── Extracts Amount: Regex pattern matching 'Rs. XXX' / '₹XXX' / 'INR XXX'
       ├── Cleans Merchant: Strips 'UPI/VPA/REF' keywords
       ├── Auto-Categorizes: Matches merchant name against Category Keyword Rules
       └── Detects Payment Method: 'UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING'
       │
       ▼
Interactive Preview Modal: User reviews, edits amounts or categories
       │
       ▼
User clicks "Save All Transactions"
       │
       ▼
Server Action: createBatchExpensesAction(expensesList) (actions/expense-actions.js)
       │
       ├── Validates all items against expenseSchema
       ├── Single Batch Database Insert: prisma.expense.createMany()
       └── Invalides Next.js router caches (revalidatePath)
       │
       ▼
UI Update: Refreshes expense ledger with all parsed records simultaneously
```

---

## 5. Optimistic Expense Deletion Flow

```text
User clicks "Delete" on an expense row
       │
       ▼
Expenses Page Component (app/(dashboard)/expenses/page.jsx)
       │
       ├── OPTIMISTIC STEP: Instantly filters out row from local React state
       │
       ▼
Server Action: deleteExpenseAction(id) (actions/expense-actions.js)
       │
       ├── Auth Guard: requireAuth()
       ├── Ownership Verification: prisma.expense.findFirst({ where: { id, userId } })
       ├── Database Deletion: prisma.expense.delete({ where: { id } })
       └── Next.js Cache Invalidation (revalidatePath)
       │
       ▼
If Server Success:
   - Deletion confirmed, UI remains clean.
If Server Failure:
   - Rollback: Re-injects deleted item into local state and shows error toast.
```

---

## 6. Monthly Budget Setting & Pacing Flow

```text
User selects Month/Year & sets Category Limit (e.g., Food: ₹15,000)
       │
       ▼
Budgets Page (app/(dashboard)/budgets/page.jsx)
       │
       ▼
Server Action: setBudgetAction(data) (actions/budget-actions.js)
       │
       ├── Zod Validation: budgetSchema (month 1-12, year 2000-2100, amount > 0)
       │
       └── Database Upsert:
             prisma.budget.upsert({
               where: { uq_user_category_period: { userId, categoryId, month, year } },
               update: { amount },
               create: { userId, categoryId, amount, month, year }
             })
       │
       └── Invalidate paths: /dashboard, /budgets, /reports
       │
       ▼
Refetch Budget Status: getBudgetStatusAction(year, month)
       │
       ├── Calculates actual category spend using prisma.expense.groupBy
       ├── Computes utilization % and isOverBudget flag
       │
       ▼
UI Update: Renders color-coded utilization gauge (Green/Blue <80%, Amber 80-99%, Red ≥100%)
```

---

## 7. Peer Lending & Multi-Installment Settlement Flow

```text
User creates Loan (LENT ₹5,000 to "Rahul")
       │
       ▼
Server Action: createLoanAction(data) (actions/loan-actions.js)
       │
       ├── Contact Resolution:
       │     prisma.contact.findFirst({ where: { userId, name: 'Rahul' } })
       │     If not found -> prisma.contact.create()
       │
       └── Database Create:
             prisma.loan.create({
               data: { userId, contactId, type: 'LENT', amount: 5000, remainingAmount: 5000, status: 'PENDING' }
             })
       │
       ▼
Later: Rahul pays back ₹2,000 installment
       │
       ▼
User clicks "Record Settlement" on Loan Card
       │
       ▼
Server Action: recordSettlementAction(loanId, { amount: 2000, paymentMethod: 'UPI' })
       │
       ▼
Database Transaction (prisma.$transaction):
       ├── 1. Validates loan ownership & checks (2000 <= remainingAmount)
       ├── 2. Creates LoanSettlement entry (amount: 2000, paymentMethod: 'UPI')
       ├── 3. Computes new remainingAmount = 5000 - 2000 = 3000
       ├── 4. Updates Loan status to 'PARTIAL' (or 'SETTLED' if balance becomes 0)
       └── 5. Updates Loan record
       │
       ▼
UI Update: Shows updated balance (₹3,000 remaining) and appends settlement to history list
```

---

## 8. Audit Reports & CSV Export Flow

```text
User navigates to /reports -> Selects Tab (e.g., Expense Ledger)
       │
       ▼
Reports Page Component (app/(dashboard)/reports/page.jsx)
       │ (Fetches active ledger records)
       ▼
User clicks "Download CSV"
       │
       ▼
Client-Side Utility: downloadCSV(filename, csvData) (lib/utils.js)
       │
       ├── Formats records into standard CSV rows (with quotes escaping)
       ├── Constructs in-memory Blob: new Blob([csvData], { type: 'text/csv' })
       ├── Creates temporary anchor element: <a href="blob:..." download="filename.csv">
       └── Programmatically triggers anchor click & cleans up object URL
       │
       ▼
Browser immediately downloads CSV file with zero server latency
```

---

## 9. Executive Admin Health Diagnostics & Backup Flow

```text
Admin User accesses /admin -> Navigates to "Health & System"
       │
       ▼
Server Action: getAdminSystemHealthAction() (actions/admin-actions.js)
       │
       ├── Security Check: requireAdmin() (verifies role === 'ADMIN' in DB)
       │
       ├── Live Database Ping: Measures execution time of prisma.$queryRaw`SELECT 1 as ping` (in ms)
       ├── Row Count Aggregation: Counts rows across all 6 PostgreSQL tables
       └── Node.js Runtime Inspection: process.memoryUsage(), process.uptime(), process.version
       │
       ▼
UI displays Database Latency Badge (e.g., "38ms • HEALTHY"), Record Counts, and RAM metrics
       │
       ▼
Admin clicks "Download Platform JSON Snapshot"
       │
       ▼
Server Action: getAdminBackupSnapshotAction()
       │
       ├── Reads full relational snapshot of categories, users, expenses, budgets, loans
       └── Injects export metadata (exportDate, totalRecords, appVersion)
       │
       ▼
Client downloads `expensewise-backup-YYYY-MM-DD.json`
```
