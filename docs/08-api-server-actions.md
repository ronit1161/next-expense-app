# 08 — Server Actions & API Route Handlers

This document provides a comprehensive reference of all Server Actions and REST API Route Handlers in ExpenseWise.

---

## 1. Complete Server Actions Reference

| Action Name | File Location | Auth | Role | Purpose | Primary DB Operations |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `registerAction(data)` | [`actions/auth-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/auth-actions.js) | None | Public | Register new user & issue session cookie | `prisma.user.findUnique`, `prisma.user.create` |
| `loginAction(data)` | [`actions/auth-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/auth-actions.js) | None | Public | Verify credentials & issue session cookie | `prisma.user.findUnique` |
| `logoutAction()` | [`actions/auth-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/auth-actions.js) | None | Public | Destroy session cookie | `cookieStore.delete('auth_session')` |
| `getMeAction()` | [`actions/auth-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/auth-actions.js) | User | `USER` | Fetch current session profile | `getCurrentUser()` |
| `getDashboardDataAction()` | [`actions/dashboard-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/dashboard-actions.js) | User | `USER` | Parallel fetch of all metrics, charts & insights | `Promise.all` across 5 models |
| `getDashboardSummaryAction()` | [`actions/dashboard-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/dashboard-actions.js) | User | `USER` | Fetch top-level KPI metrics only | Delegates to `getDashboardDataAction` |
| `getDashboardAnalyticsAction()`| [`actions/dashboard-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/dashboard-actions.js) | User | `USER` | Fetch trend & breakdown data only | Delegates to `getDashboardDataAction` |
| `getDashboardInsightsAction()` | [`actions/dashboard-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/dashboard-actions.js) | User | `USER` | Fetch rule-based insights array only | Delegates to `getDashboardDataAction` |
| `getCategoriesAction()` | [`actions/expense-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/expense-actions.js) | None | Public | Fetch all categories (cached via `unstable_cache`)| `prisma.category.findMany` |
| `getExpensesAction(params)` | [`actions/expense-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/expense-actions.js) | User | `USER` | Paginated & filtered expense list | `prisma.expense.findMany`, `prisma.expense.count` |
| `getExpenseAction(id)` | [`actions/expense-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/expense-actions.js) | User | `USER` | Fetch single expense details | `prisma.expense.findFirst` |
| `createExpenseAction(data)` | [`actions/expense-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/expense-actions.js) | User | `USER` | Create single expense entry | `prisma.expense.create` |
| `updateExpenseAction(id, data)`| [`actions/expense-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/expense-actions.js) | User | `USER` | Update existing expense entry | `prisma.expense.update` |
| `deleteExpenseAction(id)` | [`actions/expense-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/expense-actions.js) | User | `USER` | Delete expense entry | `prisma.expense.delete` |
| `createBatchExpensesAction(list)`| [`actions/expense-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/expense-actions.js) | User | `USER` | Batch insert parsed SMS transactions | `prisma.expense.createMany` |
| `getBudgetStatusAction(y, m)` | [`actions/budget-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/budget-actions.js) | User | `USER` | Fetch monthly limits with spent aggregation | `prisma.budget.findMany`, `prisma.expense.groupBy` |
| `setBudgetAction(data)` | [`actions/budget-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/budget-actions.js) | User | `USER` | Upsert budget limit for category/period | `prisma.budget.upsert` |
| `deleteBudgetAction(id)` | [`actions/budget-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/budget-actions.js) | User | `USER` | Remove category budget limit | `prisma.budget.delete` |
| `getContactsAction()` | [`actions/loan-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/loan-actions.js) | User | `USER` | Fetch user's peer contact directory | `prisma.contact.findMany` |
| `getLoansAction({ type, status })`| [`actions/loan-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/loan-actions.js) | User | `USER` | Fetch loans & outstanding balances | `prisma.loan.findMany` |
| `getLoanDetailsAction(id)` | [`actions/loan-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/loan-actions.js) | User | `USER` | Fetch loan details & settlement history | `prisma.loan.findFirst` with `settlements` |
| `createLoanAction(data)` | [`actions/loan-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/loan-actions.js) | User | `USER` | Create loan & auto-resolve contact | `prisma.contact.create`, `prisma.loan.create` |
| `recordSettlementAction(id, d)`| [`actions/loan-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/loan-actions.js) | User | `USER` | Record settlement installment | `prisma.$transaction` (create settlement + update loan) |
| `deleteLoanAction(id)` | [`actions/loan-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/loan-actions.js) | User | `USER` | Delete loan record | `prisma.loan.delete` |
| `getAdminOverviewAction()` | [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js) | Admin| `ADMIN`| Platform-wide KPI totals | Aggregate counts and sums across platform |
| `getAdminUsersAction(params)` | [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js) | Admin| `ADMIN`| Paginated user directory with totals | `prisma.user.findMany` with relations |
| `getAdminUserDetailAction(uid)`| [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js) | Admin| `ADMIN`| Deep-dive inspection of any user | User profile + 100 expenses + budgets + loans |
| `getAdminAllActivitiesAction(p)`| [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js) | Admin| `ADMIN`| Global platform transaction stream | `prisma.expense.findMany` across all users |
| `createCategoryAction(data)` | [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js) | Admin| `ADMIN`| Add global expense category | `prisma.category.create` + `revalidateTag('categories')` |
| `deleteCategoryAction(catId)` | [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js) | Admin| `ADMIN`| Delete category if unused | `prisma.category.delete` + `revalidateTag('categories')` |
| `getAdminAnalyticsAction()` | [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js) | Admin| `ADMIN`| Macro volume, categories, user tiers | Multi-model aggregation |
| `getAdminSystemHealthAction()` | [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js) | Admin| `ADMIN`| DB ping latency & system runtime stats | `prisma.$queryRawSELECT 1` + memory usage |
| `getAdminBackupSnapshotAction()`| [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js) | Admin| `ADMIN`| 1-Click JSON backup of entire database | Relational snapshot of all tables |
| `getAdminMasterCsvAction(p)` | [`actions/admin-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/admin-actions.js) | Admin| `ADMIN`| Generate master CSV of platform transactions | `prisma.expense.findMany` (up to 5000 rows) |

---

## 2. REST API Route Handlers Reference (`app/api/`)

| Route Path | Methods | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register user account via REST |
| `/api/auth/login` | `POST` | Public | Authenticate user via REST |
| `/api/auth/logout` | `POST` | Public | Destroy session cookie |
| `/api/auth/me` | `GET` | User | Get current session user object |
| `/api/auth/refresh` | `POST` | User | Refresh current session |
| `/api/expenses` | `GET`, `POST` | User | Paginated expenses list or create expense |
| `/api/expenses/[id]` | `GET`, `PUT`, `DELETE` | User | Fetch, update, or delete single expense |
| `/api/expenses/categories` | `GET` | Public | Get all active categories |
| `/api/budgets` | `GET`, `POST` | User | List budgets or upsert budget limit |
| `/api/budgets/[id]` | `DELETE` | User | Delete single budget ceiling |
| `/api/budgets/status` | `GET` | User | Get budget limits with spent sums |
| `/api/loans` | `GET`, `POST` | User | List loans or create new loan |
| `/api/loans/[id]` | `GET`, `DELETE` | User | Fetch loan detail or delete loan |
| `/api/loans/[id]/settlements`| `POST` | User | Record partial or full debt settlement |
| `/api/loans/contacts` | `GET` | User | List user's contacts |
| `/api/dashboard/summary` | `GET` | User | Get top-level dashboard metrics |
| `/api/dashboard/analytics` | `GET` | User | Get 6-month trend & category sums |
| `/api/dashboard/insights` | `GET` | User | Get rule-based AI financial insights |
