# 11 — Local Environment & Developer Setup

This guide provides step-by-step instructions for configuring, running, and developing ExpenseWise in a local development environment.

---

## 1. System Prerequisites

Ensure the following tools are installed on your workstation:
- **Node.js**: v18.17.0+ or v20.0.0+ (LTS recommended).
- **Package Manager**: `npm` (v9+ / bundled with Node.js).
- **PostgreSQL Database**:
  - **Option A (Cloud Serverless)**: A free [Neon](https://neon.tech) PostgreSQL instance.
  - **Option B (Local)**: Local PostgreSQL server (v14+) running on `localhost:5432`.

---

## 2. Step-by-Step Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/ronit1161/next-expense-app.git
cd next-expense-app
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy the provided `.env.example` to create your local `.env.local` file:
```bash
cp .env.example .env.local
```

Open `.env.local` and configure your credentials:
```env
# 1. Database Connection String (PostgreSQL)
# For Local PostgreSQL:
DATABASE_URL="postgresql://postgres:password@localhost:5432/expense_tracker?schema=public"

# For Neon Serverless (Pooled Connection with PgBouncer):
# DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15"

# 2. JWT Authentication Secret (Minimum 32 characters)
AUTH_SECRET="your-super-secret-random-jwt-key-min-32-characters"
```

---

## 3. Database Initialization & Seeding

### Step 1: Generate Prisma Client
Generates the type-safe Prisma Client based on [`prisma/schema.prisma`](file:///d:/Sunbeam/Project/Expense-tracker/prisma/schema.prisma):
```bash
npm run prisma:generate
```

### Step 2: Apply Database Migrations
Applies SQL schema migrations to your PostgreSQL database:
```bash
npm run prisma:migrate
```

### Step 3: Seed Default Categories
Seeds the 8 standard expense categories (`Food`, `Travel`, `Shopping`, `Entertainment`, `Bills`, `Medical`, `Education`, `Others`):
```bash
npm run prisma:seed
```

---

## 4. Running the Application

### Start Development Server
```bash
npm run dev
```
The application will start with Hot Module Replacement (HMR) at [http://localhost:3000](http://localhost:3000).

### Run ESLint Code Quality Checks
```bash
npm run lint
```

### Validate Production Build
To test the production build bundle locally:
```bash
npm run build
npm run start
```

---

## 5. Setting Up an Admin User

By default, newly registered users receive the standard `USER` role. To promote an account to `ADMIN` (granting access to `/admin`):

1. Register an account through the UI at [http://localhost:3000/signup](http://localhost:3000/signup).
2. Open your terminal in the project directory and run:
   ```bash
   node scripts/promote-admin.js <user-email>
   ```
   *Example*:
   ```bash
   node scripts/promote-admin.js user@example.com
   ```
3. Refresh your browser or re-login to access the **Admin Portal** in the sidebar.

---

## 6. Optional: Migrating Legacy MySQL Data

If you have historical transactions in a legacy MySQL database, use the migration utility in [`scripts/migrate-mysql-to-postgres.js`](file:///d:/Sunbeam/Project/Expense-tracker/scripts/migrate-mysql-to-postgres.js):

1. Add your MySQL credentials to `.env.local`:
   ```env
   MYSQL_HOST="localhost"
   MYSQL_PORT=3306
   MYSQL_USER="root"
   MYSQL_PASSWORD="your_password"
   MYSQL_DATABASE="expense_tracker"
   ```
2. Run the migration script:
   ```bash
   node scripts/migrate-mysql-to-postgres.js
   ```
