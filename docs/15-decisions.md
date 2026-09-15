# 15 — Architecture & Technical Decision Records (ADRs)

This document records key architectural decisions, current implementation rationales, advantages, trade-offs, and considerations for future modifications.

---

## ADR-01: Next.js 15 App Router & Server Actions as Primary Data Layer

### Current Implementation Rationale
- **Decision**: Use Next.js 15 App Router with Server Actions (`'use server'`) as the primary interface for data mutation and retrieval, accompanied by lightweight REST route handlers for external compatibility.
- **Advantages**:
  - Eliminates separate Express/Node.js backend maintenance.
  - Server Actions run on the server with direct access to Prisma and database credentials.
  - Automatic Next.js router cache revalidation (`revalidatePath`, `revalidateTag`).
  - Native type-safe serialization between React 19 components and server execution.
- **Trade-offs**:
  - Tight coupling of business logic to Next.js runtime.
- **Things to Consider Before Changing**: If decoupling into a standalone microservice, the Server Actions in `actions/` would need to be migrated to standard Express/Fastify controllers, and client calls would need an HTTP client (like Axios/Fetch).

---

## ADR-02: PostgreSQL with Decimal Precision & Prisma ORM

### Current Implementation Rationale
- **Decision**: Use PostgreSQL with Prisma ORM. Store monetary values as `Decimal(12, 2)` and calendar dates as `@db.Date`.
- **Advantages**:
  - `Decimal(12, 2)` prevents JavaScript binary floating-point rounding errors (e.g. `0.1 + 0.2 = 0.30000000000000004`).
  - `@db.Date` prevents timezone offset shifts across UTC/IST when logging daily expenses.
  - Prisma provides type-safe query building, automatic connection pooling, and declarative migrations.
- **Trade-offs**:
  - Prisma Decimal objects must be converted to Numbers (`Number(e.amount)`) before serialization across Server Component boundaries.
- **Things to Consider Before Changing**: If migrating away from Prisma (e.g. to Drizzle or Kysely), preserve `DECIMAL(12, 2)` and `DATE` column definitions in PostgreSQL to prevent precision loss.

---

## ADR-03: Pure JavaScript (ESM / JSX) over TypeScript

### Current Implementation Rationale
- **Decision**: The entire codebase is implemented in 100% standard JavaScript (ESM / JSX) with zero TypeScript dependencies.
- **Advantages**:
  - Faster compilation times during development and production builds.
  - Zero build-step type friction.
  - Relies on strict runtime validation schemas (Zod) at system boundaries.
- **Trade-offs**:
  - Lacks compile-time static type checking for internal prop interfaces.
- **Things to Consider Before Changing**: If introducing TypeScript, add `typescript` and `@types/react` to `devDependencies`, rename `.jsx`/`.js` to `.tsx`/`.ts`, and create `tsconfig.json`.

---

## ADR-04: Stateless JWT in `HttpOnly` Cookies over Database Sessions

### Current Implementation Rationale
- **Decision**: Authenticate requests using a 7-day stateless JWT token signed via `jose` HS256 stored inside an `HttpOnly`, `SameSite: Lax` cookie.
- **Advantages**:
  - Fast edge verification in `middleware.js` with zero database round-trips for standard route protection.
  - Stateless architecture scales seamlessly on serverless platforms (Vercel) without session store bottlenecks.
  - Immune to client-side XSS token exfiltration (`httpOnly: true`).
- **Trade-offs**:
  - Instant session revocation requires token expiration or rotation of `AUTH_SECRET`.
- **Things to Consider Before Changing**: If implementing instant multi-device session revocation, introduce a `sessions` table in Prisma or a Redis blacklist.

---

## ADR-05: Consolidated Dashboard Batching over Waterfall Fetches

### Current Implementation Rationale
- **Decision**: Execute all dashboard queries in a single parallel `Promise.all` batch inside `getDashboardDataAction()`, running all trend mapping and financial rule evaluations in Node.js memory.
- **Advantages**:
  - Reduces total network round-trips from 5 sequential waterfalls down to 1 parallel round-trip.
  - Eliminates UI layout shifts during initial dashboard loading.
  - Minimizes cross-region database latency when deployed to serverless environments.
- **Trade-offs**:
  - Node.js performs array filtering and reduce operations in memory rather than complex SQL subqueries.
- **Things to Consider Before Changing**: If transaction volumes exceed tens of thousands of rows per user, offload aggregations to dedicated SQL views or materialized summaries.

---

## ADR-06: Dual-Theme Architecture (Neumorphism + Linear Deep Onyx)

### Current Implementation Rationale
- **Decision**: Implement Soft UI Neumorphism for Light mode (`#EAE6DF`) and Linear/Vercel Deep Onyx glassmorphism for Dark mode (`#090A0F`), synchronized via CSS custom properties and React context.
- **Advantages**:
  - Neumorphic depth looks organic on warm linen backgrounds, while sleek translucent borders and top-rim specular highlights look crisp on OLED dark displays.
  - Zero-flash startup via synchronous `<head>` script in `app/layout.jsx`.
- **Trade-offs**:
  - Requires maintaining dual shadow and border tokens in `app/globals.css`.

---

## ADR-07: In-Browser Regex SMS Parsing over Cloud OCR

### Current Implementation Rationale
- **Decision**: Parse Indian bank alert SMS text in-browser using deterministic regular expressions and keyword rules in `lib/smsParser.js`, with automatic clipboard detection.
- **Advantages**:
  - 100% free with zero third-party API fees or vendor lock-in.
  - Zero latency (sub-millisecond client-side parsing).
  - High privacy (sensitive financial SMS text is processed in the user's browser before saving).
- **Trade-offs**:
  - Regex patterns must be updated if Indian banks drastically alter SMS copywriting formats.
