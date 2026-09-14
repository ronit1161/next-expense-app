'use server';

import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { expenseSchema } from '@/lib/validations';
import { unstable_cache, revalidatePath } from 'next/cache';

const getCachedCategories = unstable_cache(
  async () => {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  },
  ['categories-list'],
  { tags: ['categories'], revalidate: 3600 }
);

export async function getCategoriesAction() {
  try {
    const categories = await getCachedCategories();
    return { success: true, categories };
  } catch (error) {
    console.error('Failed to get categories:', error);
    return { success: false, error: 'Failed to fetch categories' };
  }
}

export async function getExpensesAction({
  page = 1,
  limit = 10,
  categoryId,
  startDate,
  endDate,
} = {}) {
  try {
    const user = await requireAuth();

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where = {
      userId: user.id,
    };

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (startDate || endDate) {
      where.expenseDate = {};
      if (startDate) {
        where.expenseDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.expenseDate.lte = new Date(endDate);
      }
    }

    const [expenses, totalCount] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
            },
          },
        },
        orderBy: [{ expenseDate: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limitNum,
      }),
      prisma.expense.count({ where }),
    ]);

    // Format expenses for client components (converting Decimal and Date to plain values)
    const formatted = expenses.map((e) => ({
      id: e.id,
      amount: Number(e.amount),
      description: e.description,
      paymentMethod: e.paymentMethod,
      expenseDate: e.expenseDate.toISOString().split('T')[0],
      categoryId: e.categoryId,
      categoryName: e.category.name,
      categoryIcon: e.category.icon,
      categoryColor: e.category.color,
    }));

    return {
      success: true,
      expenses: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
      },
    };
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    return { success: false, error: error.message || 'Failed to fetch expenses' };
  }
}

export async function getExpenseAction(id) {
  try {
    const user = await requireAuth();
    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        category: true,
      },
    });

    if (!expense) {
      return { success: false, error: 'Expense not found' };
    }

    return {
      success: true,
      expense: {
        id: expense.id,
        amount: Number(expense.amount),
        description: expense.description,
        paymentMethod: expense.paymentMethod,
        expenseDate: expense.expenseDate.toISOString().split('T')[0],
        categoryId: expense.categoryId,
        categoryName: expense.category.name,
        categoryIcon: expense.category.icon,
        categoryColor: expense.category.color,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createExpenseAction(data) {
  try {
    const user = await requireAuth();
    const validated = expenseSchema.parse(data);

    const expense = await prisma.expense.create({
      data: {
        userId: user.id,
        categoryId: validated.categoryId,
        amount: validated.amount,
        description: validated.description || null,
        paymentMethod: validated.paymentMethod,
        expenseDate: new Date(validated.expenseDate),
      },
      include: {
        category: true,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    revalidatePath('/budgets');
    revalidatePath('/reports');

    return {
      success: true,
      expense: {
        id: expense.id,
        amount: Number(expense.amount),
        description: expense.description,
        paymentMethod: expense.paymentMethod,
        expenseDate: expense.expenseDate.toISOString().split('T')[0],
        categoryId: expense.categoryId,
        categoryName: expense.category.name,
        categoryIcon: expense.category.icon,
        categoryColor: expense.category.color,
      },
    };
  } catch (error) {
    console.error('Create expense error:', error);
    return {
      success: false,
      error: error.errors?.[0]?.message || error.message || 'Failed to create expense',
    };
  }
}

export async function updateExpenseAction(id, data) {
  try {
    const user = await requireAuth();
    const validated = expenseSchema.parse(data);

    const existing = await prisma.expense.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: 'Expense not found or access denied.' };
    }

    const updated = await prisma.expense.update({
      where: { id },
      data: {
        categoryId: validated.categoryId,
        amount: validated.amount,
        description: validated.description || null,
        paymentMethod: validated.paymentMethod,
        expenseDate: new Date(validated.expenseDate),
      },
      include: {
        category: true,
      },
    });

    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    revalidatePath('/budgets');
    revalidatePath('/reports');

    return {
      success: true,
      expense: {
        id: updated.id,
        amount: Number(updated.amount),
        description: updated.description,
        paymentMethod: updated.paymentMethod,
        expenseDate: updated.expenseDate.toISOString().split('T')[0],
        categoryId: updated.categoryId,
        categoryName: updated.category.name,
        categoryIcon: updated.category.icon,
        categoryColor: updated.category.color,
      },
    };
  } catch (error) {
    console.error('Update expense error:', error);
    return {
      success: false,
      error: error.errors?.[0]?.message || error.message || 'Failed to update expense',
    };
  }
}

export async function deleteExpenseAction(id) {
  try {
    const user = await requireAuth();

    const existing = await prisma.expense.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return { success: false, error: 'Expense not found or access denied.' };
    }

    await prisma.expense.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    revalidatePath('/budgets');
    revalidatePath('/reports');

    return { success: true };
  } catch (error) {
    console.error('Delete expense error:', error);
    return { success: false, error: error.message || 'Failed to delete expense' };
  }
}

export async function createBatchExpensesAction(expensesList) {
  try {
    const user = await requireAuth();

    if (!Array.isArray(expensesList) || expensesList.length === 0) {
      return { success: false, error: 'No expenses provided for batch creation.' };
    }

    const recordsToCreate = expensesList.map((item) => {
      const validated = expenseSchema.parse({
        categoryId: Number(item.categoryId),
        amount: Number(item.amount),
        description: item.description || 'Auto-Parsed Transaction',
        paymentMethod: item.paymentMethod || 'UPI',
        expenseDate: item.expenseDate || new Date().toISOString().split('T')[0],
      });

      return {
        userId: user.id,
        categoryId: validated.categoryId,
        amount: validated.amount,
        description: validated.description,
        paymentMethod: validated.paymentMethod,
        expenseDate: new Date(validated.expenseDate),
      };
    });

    const result = await prisma.expense.createMany({
      data: recordsToCreate,
    });

    revalidatePath('/dashboard');
    revalidatePath('/expenses');
    revalidatePath('/budgets');
    revalidatePath('/reports');

    return {
      success: true,
      count: result.count,
      message: `Successfully logged ${result.count} transaction${result.count > 1 ? 's' : ''}.`,
    };
  } catch (error) {
    console.error('Batch expense creation error:', error);
    return {
      success: false,
      error: error.errors?.[0]?.message || error.message || 'Failed to create batch expenses.',
    };
  }
}

