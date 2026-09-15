# Feature Map & Developer Cross-Reference

This reference maps every feature to its corresponding UI page, React components, Server Action, Prisma model, validation schema, and interacting systems.

---

## 1. Quick Feature-to-Code Mapping Table

| Feature Domain | UI Page Route | Primary React Components | Server Action / API Handler | Prisma Database Model | Zod Validation Schema | Interacting / Related Features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **User Registration** | `/signup` | [`app/(auth)/signup/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(auth)/signup/page.jsx) | `registerAction` | `User` | `registerSchema` | `createSession`, `middleware.js` |
| **User Login** | `/login` | [`app/(auth)/login/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(auth)/login/page.jsx) | `loginAction` | `User` | `loginSchema` | `createSession`, `middleware.js` |
| **User Logout** | Anywhere | [`DashboardLayoutClient.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/layout/DashboardLayoutClient.jsx) | `logoutAction` | None | None | `destroySession`, `/login` redirect |
| **Dashboard Pulse** | `/dashboard` | [`app/(dashboard)/dashboard/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/dashboard/page.jsx) | `getDashboardDataAction` | `Expense`, `Budget`, `Loan`, `Category` | None | `SpendingTrendChart`, AI Rule Engine |
| **6-Month Trajectory** | `/dashboard` | [`SpendingTrendChart.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/dashboard/SpendingTrendChart.jsx) | `getDashboardDataAction` | `Expense` | None | Recharts Area Chart |
| **Expense Journal** | `/expenses` | [`app/(dashboard)/expenses/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/expenses/page.jsx) | `getExpensesAction` | `Expense`, `Category` | None | Pagination, Multi-field Filters |
| **Add / Edit Expense** | `/expenses` | Modal in [`expenses/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/expenses/page.jsx) | `createExpenseAction`, `updateExpenseAction` | `Expense` | `expenseSchema` | Category Dropdown, Dashboard refresh |
| **Optimistic Delete** | `/expenses` | Table in [`expenses/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/expenses/page.jsx) | `deleteExpenseAction` | `Expense` | None | Optimistic State Filter |
| **Smart SMS Parser** | `/expenses` | [`SmsParserModal.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/expenses/SmsParserModal.jsx) | `createBatchExpensesAction` | `Expense` | `expenseSchema` | `lib/smsParser.js`, Clipboard API |
| **Budget Pacing** | `/budgets` | [`app/(dashboard)/budgets/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/budgets/page.jsx) | `getBudgetStatusAction` | `Budget`, `Expense`, `Category` | None | Utilization Meters, Velocity Alert |
| **Set Budget Ceiling** | `/budgets` | Modal in [`budgets/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/budgets/page.jsx) | `setBudgetAction` | `Budget` | `budgetSchema` | Upsert composite key |
| **Peer Loans (Debts)**| `/debts` | [`app/(dashboard)/debts/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/debts/page.jsx) | `getLoansAction` | `Loan`, `Contact` | None | Receivable vs Payable Totals |
| **Create Loan** | `/debts` | Modal in [`debts/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/debts/page.jsx) | `createLoanAction` | `Loan`, `Contact` | `loanSchema` | Contact Auto-Creation |
| **Record Settlement** | `/debts` | Settlement Drawer in [`debts/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/debts/page.jsx) | `recordSettlementAction` | `LoanSettlement`, `Loan` | `settlementSchema` | `prisma.$transaction`, Status change |
| **Audit Statements** | `/reports` | [`app/(dashboard)/reports/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/reports/page.jsx) | Page Data Actions | `Expense`, `Budget`, `Loan` | None | Tabbed Ledgers |
| **Client CSV Export** | `/reports` | Table headers in [`reports/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/reports/page.jsx) | Client-side Blob | None | None | `downloadCSV` in `lib/utils.js` |
| **Admin Overview** | `/admin` | Tab 1 in [`admin/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/admin/page.jsx) | `getAdminOverviewAction` | Multi-model count & sum | None | `requireAdmin` |
| **Admin User Inspector**| `/admin` | Tab 2 in [`admin/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/admin/page.jsx) | `getAdminUsersAction`, `getAdminUserDetailAction` | `User`, `Expense`, `Budget`, `Loan` | None | Search & Inspection Modal |
| **Admin Category Mgr**| `/admin` | Tab 4 in [`admin/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/admin/page.jsx) | `createCategoryAction`, `deleteCategoryAction` | `Category` | Custom validation | `revalidateTag('categories')` |
| **Admin Analytics** | `/admin` | [`AdminAnalyticsCharts.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/admin/AdminAnalyticsCharts.jsx) | `getAdminAnalyticsAction` | `Expense`, `User`, `Category` | None | Dynamic Import (`ssr: false`) |
| **Admin System Health**| `/admin` | Tab 6 in [`admin/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/admin/page.jsx) | `getAdminSystemHealthAction` | Raw DB ping + all models | None | `SELECT 1 as ping`, Node memory |
| **Admin Platform Backup**| `/admin`| Tab 6 in [`admin/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/admin/page.jsx) | `getAdminBackupSnapshotAction`, `getAdminMasterCsvAction` | All Tables | None | Full JSON Snapshot & Master CSV |
| **Theme Switching** | Global | [`ThemeToggle.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/ui/ThemeToggle.jsx) | Client React Context | None | None | `ThemeProvider`, `globals.css` |
| **PWA Install Trigger**| Global | [`InstallPwaButton.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/components/ui/InstallPwaButton.jsx) | Browser PWA Event | None | None | `manifest.json`, `public/sw.js` |

---

## 2. Developer Modification Trace Examples

### Example A: Modifying an Expense Field (e.g., Adding a `receiptUrl` field)
1. **Database**: Update `model Expense` in [`prisma/schema.prisma`](file:///d:/Sunbeam/Project/Expense-tracker/prisma/schema.prisma) ➔ Run `npx prisma migrate dev --name add_receipt_url`.
2. **Validation**: Add `receiptUrl: z.string().url().optional()` to `expenseSchema` in [`lib/validations.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/validations.js).
3. **Server Action**: Update `createExpenseAction`, `updateExpenseAction`, `getExpensesAction` in [`actions/expense-actions.js`](file:///d:/Sunbeam/Project/Expense-tracker/actions/expense-actions.js).
4. **UI Modal**: Add input field in modal inside [`app/(dashboard)/expenses/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/expenses/page.jsx).
5. **Reports**: Include field in CSV export column headers in [`app/(dashboard)/reports/page.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/(dashboard)/reports/page.jsx).

---

### Example B: Adding a New Bank SMS Pattern to the Parser
1. **Regex / Keywords**: Open [`lib/smsParser.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/smsParser.js).
2. **Merchant Extraction**: Add new regex pattern to `merchantPatterns` array.
3. **Category Keyword**: Add merchant name to appropriate category in `CATEGORY_RULES`.
4. **UI Test**: Test pasting the SMS in the Smart SMS Parser modal on `/expenses`.
