'use server';

import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { budgetSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function getBudgetStatusAction(yearParam, monthParam) {
  try {
    const user = await requireAuth();
    const now = new Date();
    const year = Number(yearParam) || now.getFullYear();
    const month = Number(monthParam) || now.getMonth() + 1;

    // First, find all budgets for this user in this period
    const budgets = await prisma.budget.findMany({
      where: {
        userId: user.id,
        year,
        month,
      },
      include: {
        category: true,
      },
      orderBy: {
        category: { name: 'asc' },
      },
    });

    // Compute spent amounts per category in the month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const expenseSums = await prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        userId: user.id,
        expenseDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const expenseMap = new Map();
    expenseSums.forEach((item) => {
      expenseMap.set(item.categoryId, Number(item._sum.amount) || 0);
    });

    const budgetStatusList = budgets.map((b) => {
      const budgetLimit = Number(b.amount);
      const spentAmount = expenseMap.get(b.categoryId) || 0;
      const remainingAmount = Math.max(0, budgetLimit - spentAmount);
      const utilizationPercentage =
        budgetLimit > 0 ? Number(((spentAmount / budgetLimit) * 100).toFixed(1)) : 0;
      const isOverBudget = spentAmount > budgetLimit;

      return {
        budgetId: b.id,
        categoryId: b.categoryId,
        categoryName: b.category.name,
        categoryColor: b.category.color,
        categoryIcon: b.category.icon,
        budgetLimit,
        spentAmount,
        remainingAmount,
        utilizationPercentage,
        isOverBudget,
      };
    });

    return {
      success: true,
      period: `${year}-${String(month).padStart(2, '0')}`,
      budgets: budgetStatusList,
    };
  } catch (error) {
    console.error('Failed to get budget status:', error);
    return { success: false, error: error.message || 'Failed to fetch budget status' };
  }
}

export async function setBudgetAction(data) {
  try {
    const user = await requireAuth();
    const validated = budgetSchema.parse(data);

    // Upsert budget
    const budget = await prisma.budget.upsert({
      where: {
        uq_user_category_period: {
          userId: user.id,
          categoryId: validated.categoryId,
          month: validated.month,
          year: validated.year,
        },
      },
      update: {
        amount: validated.amount,
      },
      create: {
        userId: user.id,
        categoryId: validated.categoryId,
        amount: validated.amount,
        month: validated.month,
        year: validated.year,
      },
      include: {
        category: true,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/budgets');
    revalidatePath('/reports');

    return {
      success: true,
      budget: {
        id: budget.id,
        categoryId: budget.categoryId,
        categoryName: budget.category.name,
        amount: Number(budget.amount),
        month: budget.month,
        year: budget.year,
      },
    };
  } catch (error) {
    console.error('Set budget error:', error);
    return {
      success: false,
      error: error.errors?.[0]?.message || error.message || 'Failed to set budget limit',
    };
  }
}

export async function deleteBudgetAction(id) {
  try {
    const user = await requireAuth();

    const existing = await prisma.budget.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: 'Budget limit record not found or access denied.' };
    }

    await prisma.budget.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    revalidatePath('/budgets');
    revalidatePath('/reports');

    return { success: true };
  } catch (error) {
    console.error('Delete budget error:', error);
    return { success: false, error: error.message || 'Failed to remove budget limit' };
  }
}
