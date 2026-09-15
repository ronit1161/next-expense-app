# 14 — Troubleshooting & Diagnostic Guide

This document lists common issues, root causes, diagnostic steps, and solutions for ExpenseWise.

---

## 1. Database Connection & Prisma Issues

### Issue 1.1: `Can't reach database server at ...` or Connection Timeout
- **Symptom**: Server actions fail with `PrismaClientInitializationError` or connection timeout.
- **Root Cause**:
  - PostgreSQL server is not running locally.
  - Or Neon database connection string is missing `?sslmode=require` / `connect_timeout=15`.
  - Or PgBouncer pooler endpoint was not configured for serverless deployment.
- **Solution**:
  1. Check `.env.local` to verify `DATABASE_URL` is formatted correctly.
  2. For local PostgreSQL, verify service status:
     ```bash
     # Windows (PowerShell)
     Get-Service postgresql*
     # Linux / macOS
     sudo systemctl status postgresql
     ```
  3. For Neon Serverless, ensure your connection string includes `sslmode=require` and uses the pooled endpoint (contains `-pooler` in host).

---

### Issue 1.2: Windows File Lock Error during `prisma generate` (`query_engine-windows.dll.node`)
- **Symptom**: Running `npx prisma generate` or `npx prisma migrate dev` fails on Windows with:
  `EBUSY: resource busy or locked, unlink ...\query_engine-windows.dll.node`
- **Root Cause**: Next.js development server (`npm run dev`) is currently running in the background and holding an active file lock on the Prisma binary engine.
- **Solution**:
  1. Stop the running `next dev` process (Ctrl+C).
  2. Run `npx prisma generate` or `npx prisma migrate dev`.
  3. Restart `npm run dev`.

---

### Issue 1.3: Category Deletion Fails with Foreign Key Restriction
- **Symptom**: Deleting a category in `/admin` returns:
  `"Cannot delete category: X transactions are currently using it."`
- **Root Cause**: The Prisma schema defines `onDelete: Restrict` between `Expense` and `Category` to protect ledger integrity.
- **Solution**:
  - This is expected safety behavior. To delete a category, either reassign or remove the existing expense records associated with that category first.

---

## 2. Authentication & Session Issues

### Issue 2.1: `JWSSignatureVerificationFailed` or Unexpected Logout
- **Symptom**: User is constantly redirected to `/login` even after entering valid credentials.
- **Root Cause**: `AUTH_SECRET` changed between server restarts or is missing in `.env.local`.
- **Solution**:
  1. Ensure `AUTH_SECRET` is defined in `.env.local` as a consistent, non-empty 32+ character string.
  2. Clear the `auth_session` cookie in your browser (DevTools ➔ Application ➔ Cookies) and re-login.

---

### Issue 2.2: User Cannot Access `/admin` (Forbidden)
- **Symptom**: Navigating to `/admin` results in:
  `"Forbidden: Administrator privileges required."`
- **Root Cause**: The logged-in account has `role: USER` in the database.
- **Solution**:
  1. Promote your account using the CLI script:
     ```bash
     node scripts/promote-admin.js <your-email>
     ```
  2. Log out and log back in to refresh your JWT session payload with the `ADMIN` role.

---

## 3. UI, Theming & PWA Issues

### Issue 3.1: Stale Assets or Service Worker Caching Old Code in Development
- **Symptom**: Changes to CSS or JS components do not reflect immediately in the browser.
- **Root Cause**: The PWA Service Worker (`public/sw.js`) has cached static bundles in browser CacheStorage.
- **Solution**:
  1. Open DevTools (F12) ➔ **Application** tab ➔ **Service Workers**.
  2. Check **"Update on reload"** or click **"Unregister"**.
  3. Under **Storage**, click **"Clear site data"**.
  4. Perform a hard refresh (`Ctrl + F5` or `Cmd + Shift + R`).

---

### Issue 3.2: Hydration Mismatch Warning for Theme
- **Symptom**: Console warning: `Warning: Extra attributes from the server: class`.
- **Root Cause**: Server renders with default theme while client `<head>` script applies `.dark` class from `localStorage` before React hydration.
- **Solution**:
  - `<html>` tag in [`app/layout.jsx`](file:///d:/Sunbeam/Project/Expense-tracker/app/layout.jsx) is configured with `suppressHydrationWarning`. This is standard Next.js practice for theme toggles to prevent layout flicker.

---

## 4. Diagnostics & Health Inspection

To test system health programmatically:
1. Log into an admin account.
2. Navigate to `/admin` ➔ **Health & System** tab.
3. Observe live database ping latency (ms), table counts, and memory heap metrics.
