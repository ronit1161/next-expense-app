# 07 — Authentication, Authorization & Security

This document details the security architecture of ExpenseWise, including authentication mechanisms, session lifecycles, role-based authorization, IDOR protection, and an audit of implemented versus non-implemented security controls.

---

## 1. Authentication Implementation

ExpenseWise uses a **stateless, cookie-based JWT architecture** powered by `jose` (v6.0.8) and `bcryptjs` (v3.0.2).

### 1.1 Password Security
- **Hashing Algorithm**: `bcryptjs` with 10 salt rounds (`bcrypt.hash(password, 10)`).
- **Verification**: `bcrypt.compare(password, hashedPassword)`.
- **Location**: [`lib/auth.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/auth.js).

### 1.2 JWT Token Generation & Lifecycle
- **Algorithm**: `HS256` (HMAC using SHA-256).
- **Token Signing**: Uses `AUTH_SECRET` environment variable (minimum 32 characters required in production).
- **Token Payload**:
  ```json
  {
    "id": "user-uuid-string",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER | ADMIN",
    "iat": 1789400000,
    "exp": 1790004800
  }
  ```
- **Validity**: 7 days (`setExpirationTime('7d')`).

### 1.3 Session Cookie Configuration
The session token is stored in an `auth_session` cookie with strict flags:
```javascript
cookieStore.set('auth_session', token, {
  httpOnly: true,                           // Prevents JavaScript access (XSS mitigation)
  secure: process.env.NODE_ENV === 'production', // Enforces HTTPS in production
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  sameSite: 'lax',                          // CSRF mitigation for top-level navigations
  path: '/',
});
```

---

## 2. Route Protection & Edge Middleware

Edge Middleware ([`middleware.js`](file:///d:/Sunbeam/Project/Expense-tracker/middleware.js)) runs on all matched routes prior to rendering or action execution:

```javascript
export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/expenses/:path*',
    '/budgets/:path*',
    '/debts/:path*',
    '/reports/:path*',
  ],
};
```

### Route Guard Logic:
1. **Root URL (`/`)**:
   - Authenticated ➔ Redirects to `/dashboard`.
   - Unauthenticated ➔ Redirects to `/login`.
2. **Protected Routes (`/dashboard`, `/expenses`, `/budgets`, `/debts`, `/reports`, `/admin`)**:
   - Unauthenticated ➔ Redirects to `/login?redirect=<target_pathname>`.
3. **Public Auth Routes (`/login`, `/signup`)**:
   - Authenticated ➔ Redirects to `/dashboard` (prevents re-login).

---

## 3. Authorization & Ownership Checks (IDOR Protection)

To prevent Insecure Direct Object References (IDOR / BOLA), ExpenseWise enforces two layers of authorization guards in [`lib/auth.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/auth.js):

### 3.1 `requireAuth()`
Used across all standard user operations:
```javascript
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new Error('Unauthorized');
  }
  return user;
}
```
**Database Enforcement**: Every data operation scopes queries by the authenticated user's ID:
```javascript
// Example in actions/expense-actions.js
const existing = await prisma.expense.findFirst({
  where: { id, userId: user.id }, // Ensures user can only access/modify their own records
});
```

### 3.2 `requireAdmin()`
Used across all administrative operations:
```javascript
export async function requireAdmin() {
  const user = await getCurrentUser(true); // forceDb = true ensures live DB verification
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Forbidden: Administrator privileges required.');
  }
  return user;
}
```

---

## 4. Input Validation & Data Sanitization

All incoming client payloads are validated using strict Zod schemas in [`lib/validations.js`](file:///d:/Sunbeam/Project/Expense-tracker/lib/validations.js):

| Schema | Validated Fields | Rules Enforced |
| :--- | :--- | :--- |
| `registerSchema` | `name`, `email`, `password` | Min length, email regex, 6+ char password |
| `loginSchema` | `email`, `password` | Email regex, non-empty |
| `expenseSchema` | `categoryId`, `amount`, `paymentMethod`, `expenseDate`, `description` | Coerce positive numbers, enum whitelist, `YYYY-MM-DD` date regex |
| `budgetSchema` | `categoryId`, `amount`, `month`, `year` | Coerce positive numbers, month `1-12`, year `2000-2100` |
| `loanSchema` | `contactName`, `type`, `amount`, `loanDate`, `dueDate` | Enum whitelist (`LENT`/`BORROWED`), positive amount, ISO date regex |
| `settlementSchema` | `amount`, `paymentMethod`, `settlementDate`, `notes` | Positive amount, enum whitelist, ISO date regex |

---

## 5. Security Status Matrix

| Security Area | Status | Implementation Details |
| :--- | :--- | :--- |
| **Password Hashing** | **IMPLEMENTED** | `bcryptjs` with 10 rounds. Plaintext passwords never logged or stored. |
| **Session Cookies** | **IMPLEMENTED** | `HttpOnly`, `SameSite: Lax`, `Secure` in production. |
| **JWT Signature Validation** | **IMPLEMENTED** | Verified cryptographically with `jose` HS256 algorithm. |
| **Edge Route Guards** | **IMPLEMENTED** | Next.js Edge Middleware checks tokens before requests hit pages. |
| **User Data Isolation (IDOR)**| **IMPLEMENTED** | All mutations verify `where: { userId: user.id }`. |
| **Role-Based Access Control** | **IMPLEMENTED** | `requireAdmin()` enforces `role === 'ADMIN'` with live DB check. |
| **Schema Validation** | **IMPLEMENTED** | Strict Zod schemas on all Server Actions and Route Handlers. |
| **SQL Injection Prevention** | **IMPLEMENTED** | Prisma ORM parameterizes all SQL queries automatically. |
| **PWA Service Worker Scope** | **IMPLEMENTED** | Scope locked to `/`, caches static assets only. |
| **CSRF Protection** | **IMPLEMENTED** | SameSite Lax cookies + Next.js Server Actions built-in POST origin verification. |
| **Rate Limiting** | **NOT IMPLEMENTED** | No in-memory or Redis-based rate limiting on `/api/auth/login` or `loginAction`. |
| **2FA / MFA** | **NOT IMPLEMENTED** | Multi-factor authentication is not currently implemented. |
| **Email Verification** | **NOT IMPLEMENTED** | User accounts are active immediately upon registration without verification emails. |
| **Password Reset Flow** | **NOT IMPLEMENTED** | Forgot password / password reset token workflow is not currently implemented. |
| **CSP Headers** | **REQUIRES VERIFICATION**| Standard Next.js default headers are in use. Explicit `Content-Security-Policy` header in `next.config.mjs` is not configured. |
