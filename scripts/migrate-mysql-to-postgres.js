/**
 * Migration Script: MySQL to PostgreSQL for Expense Tracker
 * 
 * Usage:
 *   1. Ensure DATABASE_URL is set in .env.local for PostgreSQL.
 *   2. Run: node scripts/migrate-mysql-to-postgres.js
 */

import mysql from 'mysql2/promise';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function migrateData() {
  console.log('🔄 Starting data migration from MySQL to PostgreSQL...');

  const mysqlHost = process.env.MYSQL_HOST || 'localhost';
  const mysqlPort = Number(process.env.MYSQL_PORT) || 3306;
  const mysqlUser = process.env.MYSQL_USER || 'root';
  const mysqlPassword = process.env.MYSQL_PASSWORD || '';
  const mysqlDatabase = process.env.MYSQL_DATABASE || 'expense_tracker';

  let mysqlConn;
  try {
    mysqlConn = await mysql.createConnection({
      host: mysqlHost,
      port: mysqlPort,
      user: mysqlUser,
      password: mysqlPassword,
      database: mysqlDatabase,
    });

    console.log('✅ Connected to source MySQL database.');

    // 1. Categories
    console.log('📦 Migrating categories...');
    const [categories] = await mysqlConn.query('SELECT * FROM categories');
    for (const cat of categories) {
      await prisma.category.upsert({
        where: { name: cat.name },
        update: { icon: cat.icon, color: cat.color },
        create: { id: cat.id, name: cat.name, icon: cat.icon, color: cat.color },
      });
    }
    console.log(`✅ Migrated ${categories.length} categories.`);

    // 2. Users
    console.log('📦 Migrating users...');
    const [users] = await mysqlConn.query('SELECT * FROM users');
    for (const u of users) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name, passwordHash: u.password_hash },
        create: {
          id: u.id,
          name: u.name,
          email: u.email,
          passwordHash: u.password_hash,
          createdAt: u.created_at,
          updatedAt: u.updated_at,
        },
      });
    }
    console.log(`✅ Migrated ${users.length} users.`);

    // 3. Expenses
    console.log('📦 Migrating expenses...');
    const [expenses] = await mysqlConn.query('SELECT * FROM expenses');
    for (const exp of expenses) {
      await prisma.expense.upsert({
        where: { id: exp.id },
        update: {},
        create: {
          id: exp.id,
          userId: exp.user_id,
          categoryId: exp.category_id,
          amount: exp.amount,
          description: exp.description,
          paymentMethod: exp.payment_method,
          expenseDate: new Date(exp.expense_date),
          createdAt: exp.created_at,
          updatedAt: exp.updated_at,
        },
      });
    }
    console.log(`✅ Migrated ${expenses.length} expenses.`);

    // 4. Budgets
    console.log('📦 Migrating budgets...');
    const [budgets] = await mysqlConn.query('SELECT * FROM budgets');
    for (const b of budgets) {
      await prisma.budget.upsert({
        where: {
          uq_user_category_period: {
            userId: b.user_id,
            categoryId: b.category_id,
            month: b.month,
            year: b.year,
          },
        },
        update: { amount: b.amount },
        create: {
          id: b.id,
          userId: b.user_id,
          categoryId: b.category_id,
          amount: b.amount,
          month: b.month,
          year: b.year,
          createdAt: b.created_at,
          updatedAt: b.updated_at,
        },
      });
    }
    console.log(`✅ Migrated ${budgets.length} budgets.`);

    // 5. Contacts
    console.log('📦 Migrating contacts...');
    const [contacts] = await mysqlConn.query('SELECT * FROM contacts');
    for (const c of contacts) {
      await prisma.contact.upsert({
        where: {
          uq_user_contact_name: {
            userId: c.user_id,
            name: c.name,
          },
        },
        update: { email: c.email, phone: c.phone },
        create: {
          id: c.id,
          userId: c.user_id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          createdAt: c.created_at,
          updatedAt: c.updated_at,
        },
      });
    }
    console.log(`✅ Migrated ${contacts.length} contacts.`);

    // 6. Loans
    console.log('📦 Migrating loans...');
    const [loans] = await mysqlConn.query('SELECT * FROM loans');
    for (const l of loans) {
      await prisma.loan.upsert({
        where: { id: l.id },
        update: {
          remainingAmount: l.remaining_amount,
          status: l.status,
        },
        create: {
          id: l.id,
          userId: l.user_id,
          contactId: l.contact_id,
          type: l.type,
          amount: l.amount,
          remainingAmount: l.remaining_amount,
          description: l.description,
          status: l.status,
          loanDate: new Date(l.loan_date),
          dueDate: l.due_date ? new Date(l.due_date) : null,
          createdAt: l.created_at,
          updatedAt: l.updated_at,
        },
      });
    }
    console.log(`✅ Migrated ${loans.length} loans.`);

    // 7. Settlements
    console.log('📦 Migrating settlements...');
    const [settlements] = await mysqlConn.query('SELECT * FROM loan_settlements');
    for (const s of settlements) {
      await prisma.loanSettlement.upsert({
        where: { id: s.id },
        update: {},
        create: {
          id: s.id,
          loanId: s.loan_id,
          amount: s.amount,
          paymentMethod: s.payment_method,
          settlementDate: new Date(s.settlement_date),
          notes: s.notes,
          createdAt: s.created_at,
        },
      });
    }
    console.log(`✅ Migrated ${settlements.length} settlements.`);

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    if (mysqlConn) await mysqlConn.end();
    await prisma.$disconnect();
  }
}

migrateData();
