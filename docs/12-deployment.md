# 12 — Production Deployment Guide

This document outlines deployment configurations, platform recommendations, database connection strategies, and production checklist items for ExpenseWise.

---

## 1. Recommended Deployment Architecture

The recommended production stack for ExpenseWise is **Vercel** (for the Next.js App Router frontend and Server Actions) paired with **Neon** (for Serverless PostgreSQL with PgBouncer connection pooling).

```text
┌───────────────────────────┐           ┌────────────────────────────┐
│      Vercel Platform      │           │   Neon Serverless DB       │
│                           │           │                            │
│  Next.js 15 App Router    │  PgBouncer│  PostgreSQL 15+            │
│  Server Components        ├──────────►│  Connection Pooler         │
│  Edge Middleware          │  Port 5432│  Pooled Connection URL     │
│  Server Actions           │           │                            │
└───────────────────────────┘           └────────────────────────────┘
```

---

## 2. Production Environment Variables

Configure the following environment variables in your deployment dashboard (e.g., Vercel Project Settings ➔ Environment Variables):

| Variable | Description | Example / Format | Required |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string with PgBouncer pooled parameters. | `postgresql://user:pass@ep-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15` | **Yes** |
| `AUTH_SECRET` | Cryptographic secret used to sign and verify JWT session cookies. Must be a random string with 32+ characters. | `4a8f9c2d1e0b7a6f5e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1` | **Yes** |
| `NODE_ENV` | Runtime environment. Set to `production` automatically by Vercel. | `production` | **Yes** |

---

## 3. Deploying to Vercel (Step-by-Step)

### Step 1: Push Code to Git
Push your repository to GitHub, GitLab, or Bitbucket.

### Step 2: Import Project into Vercel
1. Log into [Vercel](https://vercel.com) and click **Add New ➔ Project**.
2. Select your `Expense-tracker` repository.
3. Framework Preset will auto-detect as **Next.js**.

### Step 3: Configure Build & Output Settings
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
*(The `postinstall` script in `package.json` will automatically execute `prisma generate` upon deployment).*

### Step 4: Add Environment Variables
Add `DATABASE_URL` and `AUTH_SECRET` as defined above.

### Step 5: Deploy
Click **Deploy**. Vercel will build the optimized production bundle, compile all Server Components, and assign a production URL.

---

## 4. Production Database Migrations

Before launching to live users, apply your schema migrations to your production PostgreSQL instance:

```bash
# Apply pending Prisma migrations in production mode (non-interactive)
npx prisma migrate deploy

# Seed default categories if initializing a fresh database
npm run prisma:seed
```

---

## 5. Alternative Hosting Platforms

### 5.1 Standalone Node.js Server / VPS (Ubuntu / Debian / AWS EC2)
1. Install Node.js v20+ and PM2 process manager:
   ```bash
   npm install -g pm2
   ```
2. Clone repository, install dependencies, and build:
   ```bash
   npm ci
   npx prisma generate
   npx prisma migrate deploy
   npm run build
   ```
3. Start application with PM2:
   ```bash
   pm2 start npm --name "expensewise" -- start -- -p 3000
   pm2 save
   pm2 startup
   ```
4. Configure Nginx as a reverse proxy with SSL termination (Let's Encrypt / Certbot).

---

## 6. Pre-Launch Production Checklist

- [ ] `AUTH_SECRET` is set to a cryptographically strong 32+ character random string.
- [ ] `DATABASE_URL` uses SSL (`sslmode=require`) and connection pooling (`pgbouncer=true`).
- [ ] All database migrations are applied via `npx prisma migrate deploy`.
- [ ] Default categories are seeded via `npm run prisma:seed`.
- [ ] At least one administrator account has been promoted via `node scripts/promote-admin.js <email>`.
- [ ] PWA manifest and icons load properly over HTTPS (`/manifest.json`).
- [ ] Service worker registers successfully in browser DevTools.
