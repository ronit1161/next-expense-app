'use server';

import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

/**
 * Get Platform-wide Executive KPI Overview
 */
export async function getAdminOverviewAction() {
  try {
    await requireAdmin();

    const [
      totalUsers,
      totalExpensesCount,
      totalExpenseSumResult,
      totalBudgetsCount,
      totalLoansCount,
      totalLoansVolumeResult,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.expense.count(),
      prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
      }),
      prisma.budget.count(),
      prisma.loan.count(),
      prisma.loan.aggregate({
        _sum: {
          amount: true,
          remainingAmount: true,
        },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: { expenses: true },
          },
        },
      }),
    ]);

    const totalVolume = Number(totalExpenseSumResult._sum.amount || 0);
    const totalLoanVolume = Number(totalLoansVolumeResult._sum.amount || 0);
    const totalRemainingDebt = Number(totalLoansVolumeResult._sum.remainingAmount || 0);

    return {
      success: true,
      stats: {
        totalUsers,
        totalExpensesCount,
        totalVolume,
        totalBudgetsCount,
        totalLoansCount,
        totalLoanVolume,
        totalRemainingDebt,
        averageSpendPerUser: totalUsers > 0 ? totalVolume / totalUsers : 0,
        recentUsers: recentUsers.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt.toISOString().split('T')[0],
          expenseCount: u._count.expenses,
        })),
      },
    };
  } catch (error) {
    console.error('Admin overview error:', error);
    return { success: false, error: error.message || 'Failed to fetch admin overview.' };
  }
}

/**
 * Get Paginated User Directory with Activity Stats
 */
export async function getAdminUsersAction({ search = '', page = 1, limit = 15 } = {}) {
  try {
    await requireAdmin();

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 15));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              expenses: true,
              budgets: true,
              loans: true,
            },
          },
          expenses: {
            select: {
              amount: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    const formatted = users.map((u) => {
      const totalSpent = u.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt.toISOString().split('T')[0],
        expenseCount: u._count.expenses,
        budgetCount: u._count.budgets,
        loanCount: u._count.loans,
        totalSpent,
      };
    });

    return {
      success: true,
      users: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
      },
    };
  } catch (error) {
    console.error('Admin users error:', error);
    return { success: false, error: error.message || 'Failed to fetch users.' };
  }
}

/**
 * Deep-Dive Activity Inspection for a Specific User
 */
export async function getAdminUserDetailAction(userId) {
  try {
    await requireAdmin();

    if (!userId) {
      return { success: false, error: 'User ID required.' };
    }

    const [user, expenses, budgets, loans] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.expense.findMany({
        where: { userId },
        include: {
          category: {
            select: { id: true, name: true, icon: true, color: true },
          },
        },
        orderBy: { expenseDate: 'desc' },
        take: 100,
      }),
      prisma.budget.findMany({
        where: { userId },
        include: {
          category: {
            select: { id: true, name: true, icon: true, color: true },
          },
        },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        take: 20,
      }),
      prisma.loan.findMany({
        where: { userId },
        include: {
          contact: {
            select: { id: true, name: true, phone: true },
          },
        },
        orderBy: { loanDate: 'desc' },
        take: 20,
      }),
    ]);

    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    const totalExpenseSum = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      success: true,
      user: {
        ...user,
        createdAt: user.createdAt.toISOString().split('T')[0],
        totalExpenseSum,
      },
      expenses: expenses.map((e) => ({
        id: e.id,
        amount: Number(e.amount),
        description: e.description || e.category.name,
        paymentMethod: e.paymentMethod,
        expenseDate: e.expenseDate.toISOString().split('T')[0],
        categoryName: e.category.name,
        categoryIcon: e.category.icon,
        categoryColor: e.category.color,
      })),
      budgets: budgets.map((b) => ({
        id: b.id,
        amount: Number(b.amount),
        month: b.month,
        year: b.year,
        categoryName: b.category.name,
        categoryIcon: b.category.icon,
        categoryColor: b.category.color,
      })),
      loans: loans.map((l) => ({
        id: l.id,
        contactName: l.contact.name,
        type: l.type,
        amount: Number(l.amount),
        remainingAmount: Number(l.remainingAmount),
        status: l.status,
        loanDate: l.loanDate.toISOString().split('T')[0],
        dueDate: l.dueDate ? l.dueDate.toISOString().split('T')[0] : null,
      })),
    };
  } catch (error) {
    console.error('Admin user detail error:', error);
    return { success: false, error: error.message || 'Failed to inspect user activity.' };
  }
}

/**
 * Global Activity Stream (All Users' Transactions across the platform)
 */
export async function getAdminAllActivitiesAction({
  page = 1,
  limit = 25,
  userId,
  categoryId,
  search,
} = {}) {
  try {
    await requireAdmin();

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 25));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (userId) {
      where.userId = userId;
    }
    if (categoryId) {
      where.categoryId = Number(categoryId);
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { description: { contains: q, mode: 'insensitive' } },
        { user: { name: { contains: q, mode: 'insensitive' } } },
        { user: { email: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [expenses, totalCount] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          category: {
            select: { id: true, name: true, icon: true, color: true },
          },
        },
        orderBy: [{ expenseDate: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limitNum,
      }),
      prisma.expense.count({ where }),
    ]);

    const formatted = expenses.map((e) => ({
      id: e.id,
      amount: Number(e.amount),
      description: e.description || e.category.name,
      paymentMethod: e.paymentMethod,
      expenseDate: e.expenseDate.toISOString().split('T')[0],
      userName: e.user.name,
      userEmail: e.user.email,
      userId: e.user.id,
      categoryName: e.category.name,
      categoryIcon: e.category.icon,
      categoryColor: e.category.color,
    }));

    return {
      success: true,
      activities: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
      },
    };
  } catch (error) {
    console.error('Admin all activities error:', error);
    return { success: false, error: error.message || 'Failed to fetch platform activity stream.' };
  }
}

/**
 * Create a New Global Category
 */
export async function createCategoryAction(data) {
  try {
    await requireAdmin();

    const { name, icon = 'Layers', color = '#6B7280' } = data;
    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Category name must be at least 2 characters.' };
    }

    const existing = await prisma.category.findUnique({
      where: { name: name.trim() },
    });

    if (existing) {
      return { success: false, error: 'A category with this name already exists.' };
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        icon: icon.trim(),
        color: color.trim(),
      },
    });

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    revalidatePath('/budgets');

    return { success: true, category };
  } catch (error) {
    console.error('Create category error:', error);
    return { success: false, error: error.message || 'Failed to create category.' };
  }
}

/**
 * Delete a Global Category (with safety check)
 */
export async function deleteCategoryAction(categoryId) {
  try {
    await requireAdmin();

    const id = Number(categoryId);
    const count = await prisma.expense.count({
      where: { categoryId: id },
    });

    if (count > 0) {
      return {
        success: false,
        error: `Cannot delete category: ${count} transactions are currently using it.`,
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath('/admin');
    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    revalidatePath('/budgets');

    return { success: true };
  } catch (error) {
    console.error('Delete category error:', error);
    return { success: false, error: error.message || 'Failed to delete category.' };
  }
}

/**
 * Get Platform-Wide Analytics & Macro Trends
 */
export async function getAdminAnalyticsAction() {
  try {
    await requireAdmin();

    const now = new Date();
    // 6-Month Trend Window
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [expenses, allUsers, categories] = await Promise.all([
      prisma.expense.findMany({
        where: {
          expenseDate: { gte: sixMonthsAgo },
        },
        include: {
          category: {
            select: { id: true, name: true, color: true },
          },
        },
        orderBy: { expenseDate: 'asc' },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          createdAt: true,
          expenses: {
            select: { expenseDate: true },
            orderBy: { expenseDate: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.category.findMany({
        select: { id: true, name: true, color: true },
      }),
    ]);

    // 1. Monthly Gross Volume Trend (Last 6 Months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = {};

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyMap[key] = { month: key, grossSpend: 0, transactionsCount: 0 };
    }

    expenses.forEach((e) => {
      const d = new Date(e.expenseDate);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      if (monthlyMap[key]) {
        monthlyMap[key].grossSpend += Number(e.amount);
        monthlyMap[key].transactionsCount += 1;
      }
    });

    const monthlyTrend = Object.values(monthlyMap);

    // 2. Category Spend Breakdown
    const catMap = {};
    categories.forEach((c) => {
      catMap[c.name] = { name: c.name, amount: 0, count: 0, color: c.color || '#0047FF' };
    });

    expenses.forEach((e) => {
      const cName = e.category?.name || 'Other';
      if (!catMap[cName]) {
        catMap[cName] = { name: cName, amount: 0, count: 0, color: e.category?.color || '#0047FF' };
      }
      catMap[cName].amount += Number(e.amount);
      catMap[cName].count += 1;
    });

    const categoryDistribution = Object.values(catMap)
      .filter((c) => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    // 3. Payment Method Distribution
    const paymentMap = {
      UPI: { name: 'UPI', amount: 0, count: 0, fill: '#0047FF' },
      CASH: { name: 'Cash', amount: 0, count: 0, fill: '#10B981' },
      CREDIT_CARD: { name: 'Credit Card', amount: 0, count: 0, fill: '#8B5CF6' },
      DEBIT_CARD: { name: 'Debit Card', amount: 0, count: 0, fill: '#F59E0B' },
      NET_BANKING: { name: 'Net Banking', amount: 0, count: 0, fill: '#EC4899' },
      OTHER: { name: 'Other', amount: 0, count: 0, fill: '#6B7280' },
    };

    expenses.forEach((e) => {
      const method = e.paymentMethod || 'OTHER';
      if (paymentMap[method]) {
        paymentMap[method].amount += Number(e.amount);
        paymentMap[method].count += 1;
      } else {
        paymentMap.OTHER.amount += Number(e.amount);
        paymentMap.OTHER.count += 1;
      }
    });

    const paymentDistribution = Object.values(paymentMap).filter((p) => p.count > 0);

    // 4. User Activity Tiers (Active < 7d, Occasional < 30d, Dormant > 30d)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    let activeUsers = 0;
    let occasionalUsers = 0;
    let dormantUsers = 0;

    allUsers.forEach((u) => {
      if (u.expenses && u.expenses.length > 0) {
        const lastDate = new Date(u.expenses[0].expenseDate);
        if (lastDate >= sevenDaysAgo) {
          activeUsers++;
        } else if (lastDate >= thirtyDaysAgo) {
          occasionalUsers++;
        } else {
          dormantUsers++;
        }
      } else {
        dormantUsers++;
      }
    });

    return {
      success: true,
      analytics: {
        monthlyTrend,
        categoryDistribution,
        paymentDistribution,
        userTiers: {
          total: allUsers.length,
          active: activeUsers,
          occasional: occasionalUsers,
          dormant: dormantUsers,
        },
      },
    };
  } catch (error) {
    console.error('Admin analytics error:', error);
    return { success: false, error: error.message || 'Failed to fetch platform analytics.' };
  }
}

/**
 * Get Database & System Health Diagnostics
 */
export async function getAdminSystemHealthAction() {
  try {
    await requireAdmin();

    const startTime = Date.now();
    // Test Neon PostgreSQL connection ping & query latency
    const pingResult = await prisma.$queryRaw`SELECT 1 as ping`;
    const latencyMs = Date.now() - startTime;

    const [
      usersCount,
      expensesCount,
      budgetsCount,
      loansCount,
      settlementsCount,
      categoriesCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.expense.count(),
      prisma.budget.count(),
      prisma.loan.count(),
      prisma.loanSettlement.count(),
      prisma.category.count(),
    ]);

    // Memory usage info in MB
    const memory = process.memoryUsage ? process.memoryUsage() : null;
    const memoryUsage = memory
      ? {
          heapUsedMb: (memory.heapUsed / 1024 / 1024).toFixed(1),
          heapTotalMb: (memory.heapTotal / 1024 / 1024).toFixed(1),
          rssMb: (memory.rss / 1024 / 1024).toFixed(1),
        }
      : null;

    return {
      success: true,
      health: {
        status: latencyMs < 500 ? 'HEALTHY' : 'DEGRADED',
        databaseLatencyMs: latencyMs,
        dbConnected: Boolean(pingResult),
        timestamp: new Date().toISOString(),
        tableCounts: {
          users: usersCount,
          expenses: expensesCount,
          budgets: budgetsCount,
          loans: loansCount,
          settlements: settlementsCount,
          categories: categoriesCount,
          totalRecords:
            usersCount +
            expensesCount +
            budgetsCount +
            loansCount +
            settlementsCount +
            categoriesCount,
        },
        runtime: {
          nodeVersion: process.version,
          environment: process.env.NODE_ENV || 'development',
          uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
          memoryUsage,
        },
      },
    };
  } catch (error) {
    console.error('System health error:', error);
    return {
      success: false,
      error: error.message || 'Failed to perform system health check.',
    };
  }
}

/**
 * Export Full Platform Snapshot (JSON Backup)
 */
export async function getAdminBackupSnapshotAction() {
  try {
    await requireAdmin();

    const [users, expenses, budgets, loans, categories] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
      prisma.expense.findMany({
        include: {
          category: { select: { id: true, name: true } },
          user: { select: { email: true, name: true } },
        },
      }),
      prisma.budget.findMany({
        include: {
          category: { select: { id: true, name: true } },
          user: { select: { email: true } },
        },
      }),
      prisma.loan.findMany({
        include: {
          contact: { select: { name: true, phone: true } },
          settlements: true,
          user: { select: { email: true } },
        },
      }),
      prisma.category.findMany(),
    ]);

    const backupData = {
      meta: {
        exportDate: new Date().toISOString(),
        exportedBy: 'ExpenseWise Admin Portal',
        appVersion: '1.0.0',
        totalUsers: users.length,
        totalExpenses: expenses.length,
      },
      categories,
      users,
      expenses,
      budgets,
      loans,
    };

    return {
      success: true,
      backupData,
    };
  } catch (error) {
    console.error('Admin backup snapshot error:', error);
    return { success: false, error: error.message || 'Failed to generate backup snapshot.' };
  }
}

/**
 * Generate Master Platform CSV Data
 */
export async function getAdminMasterCsvAction({ startDate, endDate } = {}) {
  try {
    await requireAdmin();

    const where = {};
    if (startDate && endDate) {
      where.expenseDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        category: { select: { name: true } },
      },
      orderBy: { expenseDate: 'desc' },
      take: 5000,
    });

    const headers = [
      'Transaction ID',
      'Date',
      'User Name',
      'User Email',
      'Category',
      'Amount (INR)',
      'Payment Method',
      'Description',
      'Tags',
      'Created At',
    ];

    const rows = expenses.map((e) => [
      e.id,
      e.expenseDate.toISOString().split('T')[0],
      `"${(e.user.name || '').replace(/"/g, '""')}"`,
      `"${(e.user.email || '').replace(/"/g, '""')}"`,
      `"${(e.category.name || '').replace(/"/g, '""')}"`,
      Number(e.amount).toFixed(2),
      e.paymentMethod,
      `"${(e.description || '').replace(/"/g, '""')}"`,
      `"${(e.tags || []).join('; ')}"`,
      e.createdAt.toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return {
      success: true,
      csvContent,
      count: expenses.length,
    };
  } catch (error) {
    console.error('Admin master CSV error:', error);
    return { success: false, error: error.message || 'Failed to generate master CSV.' };
  }
}
