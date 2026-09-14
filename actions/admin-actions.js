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
