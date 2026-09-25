'use server';

import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

/**
 * Consolidated, ultra-fast Dashboard Action.
 * Fetches all necessary data in a single parallel batch to eliminate waterfalls and cross-continental latency.
 */
export async function getDashboardDataAction() {
  try {
    const user = await requireAuth();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    const startOfDay = new Date(currentYear, currentMonth - 1, currentDay);
    const endOfDay = new Date(currentYear, currentMonth - 1, currentDay, 23, 59, 59, 999);

    const trendStartDate = new Date(currentYear, currentMonth - 6, 1);

    let prevYear = currentYear;
    let prevMonth = currentMonth - 1;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = currentYear - 1;
    }
    const startOfPrev = new Date(prevYear, prevMonth - 1, 1);
    const endOfPrev = new Date(prevYear, prevMonth, 0, 23, 59, 59, 999);

    // Run all required queries in parallel in a single round-trip
    const [categories, trendExpenses, budgets, loans, prevMonthSum, recentExpensesRaw] = await Promise.all([
      prisma.category.findMany(),
      prisma.expense.findMany({
        where: {
          userId: user.id,
          expenseDate: { gte: trendStartDate, lte: endOfMonth },
        },
        select: {
          amount: true,
          expenseDate: true,
          categoryId: true,
        },
      }),
      prisma.budget.findMany({
        where: {
          userId: user.id,
          year: currentYear,
          month: currentMonth,
        },
        include: { category: true },
      }),
      prisma.loan.findMany({
        where: {
          userId: user.id,
          status: { not: 'SETTLED' },
        },
        select: {
          type: true,
          remainingAmount: true,
        },
      }),
      prisma.expense.aggregate({
        where: {
          userId: user.id,
          expenseDate: { gte: startOfPrev, lte: endOfPrev },
        },
        _sum: { amount: true },
      }),
      prisma.expense.findMany({
        where: { userId: user.id },
        orderBy: [{ expenseDate: 'desc' }, { createdAt: 'desc' }],
        take: 5,
        include: { category: true },
      }),
    ]);

    const catMap = new Map(categories.map((c) => [c.id, c]));

    // 1. Calculate Monthly Trend & Current Month Metrics
    const trendMap = new Map();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1 - i, 1);
      const periodKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      trendMap.set(periodKey, 0);
    }

    let monthSpent = 0;
    let todaySpent = 0;
    const categorySumMap = new Map();

    trendExpenses.forEach((e) => {
      const expDate = new Date(e.expenseDate);
      const amt = Number(e.amount) || 0;

      // Trend accumulation
      const periodKey = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`;
      if (trendMap.has(periodKey)) {
        trendMap.set(periodKey, trendMap.get(periodKey) + amt);
      }

      // Current month accumulation
      if (expDate >= startOfMonth && expDate <= endOfMonth) {
        monthSpent += amt;
        const currentCatTotal = categorySumMap.get(e.categoryId) || 0;
        categorySumMap.set(e.categoryId, currentCatTotal + amt);
      }

      // Today accumulation
      if (expDate >= startOfDay && expDate <= endOfDay) {
        todaySpent += amt;
      }
    });

    const monthlyTrend = Array.from(trendMap.entries()).map(([period, total]) => ({
      period,
      total: Number(total.toFixed(2)),
    }));

    // 2. Category Breakdown
    const categoryBreakdown = Array.from(categorySumMap.entries())
      .map(([catId, total]) => {
        const cat = catMap.get(catId);
        return {
          categoryId: catId,
          categoryName: cat?.name || 'Uncategorized',
          categoryColor: cat?.color || '#0047FF',
          categoryIcon: cat?.icon || 'Layers',
          total: Number(total.toFixed(2)),
        };
      })
      .sort((a, b) => b.total - a.total);

    const highestCategory = categoryBreakdown[0]?.categoryName || 'N/A';

    // 3. Debts (Receivable & Payable)
    let receivable = 0;
    let payable = 0;
    loans.forEach((l) => {
      const rem = Number(l.remainingAmount) || 0;
      if (l.type === 'LENT') receivable += rem;
      if (l.type === 'BORROWED') payable += rem;
    });

    // 4. Budgets
    const budgetLimit = budgets.reduce((acc, b) => acc + Number(b.amount), 0);
    const remainingBudget = Math.max(0, budgetLimit - monthSpent);

    const budgetStatusList = budgets.map((b) => {
      const limit = Number(b.amount);
      const spent = categorySumMap.get(b.categoryId) || 0;
      return {
        budgetId: b.id,
        categoryId: b.categoryId,
        categoryName: b.category.name,
        categoryColor: b.category.color,
        categoryIcon: b.category.icon,
        budgetLimit: limit,
        spentAmount: spent,
        remainingAmount: Math.max(0, limit - spent),
        utilizationPercentage: limit > 0 ? Number(((spent / limit) * 100).toFixed(1)) : 0,
        isOverBudget: spent > limit,
      };
    });

    // 5. In-Memory Insights Generation
    const totalDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const monthProgressRatio = currentDay / totalDaysInMonth;
    const insights = [];

    for (const b of budgets) {
      const limit = Number(b.amount);
      const spent = categorySumMap.get(b.categoryId) || 0;
      const util = limit > 0 ? (spent / limit) * 100 : 0;

      if (limit <= 0) continue;

      if (spent > limit) {
        insights.push({
          type: 'BUDGET_BREACH',
          severity: 'high',
          message: `Budget breached: You spent ₹${spent.toLocaleString()} on ${b.category.name}, exceeding your limit of ₹${limit.toLocaleString()} by ₹${(spent - limit).toLocaleString()}.`,
        });
      } else if (util >= 80) {
        insights.push({
          type: 'BUDGET_WARNING',
          severity: 'medium',
          message: `Warning: You have used ${util.toFixed(1)}% of your ${b.category.name} budget (Spent: ₹${spent.toLocaleString()} of ₹${limit.toLocaleString()}).`,
        });
      } else {
        const spendingRatio = spent / limit;
        if (spendingRatio > monthProgressRatio + 0.15) {
          insights.push({
            type: 'VELOCITY_ALERT',
            severity: 'low',
            message: `Pacing alert: At your current rate, you are spending faster than normal on ${b.category.name} for day ${currentDay} of the month.`,
          });
        }
      }
    }

    if (receivable > 0) {
      insights.push({
        type: 'PENDING_RECEIVABLES',
        severity: 'medium',
        message: `Lending Reminder: You have a total of ₹${receivable.toLocaleString()} receivable from contacts.`,
      });
    }

    if (payable > 10000) {
      insights.push({
        type: 'PENDING_PAYABLES',
        severity: 'high',
        message: `Payables Alert: You owe a total of ₹${payable.toLocaleString()} to others. Schedule your settlements to maintain healthy credit.`,
      });
    }

    const prevTotal = Number(prevMonthSum._sum.amount) || 0;
    if (prevTotal > 0 && monthSpent > prevTotal) {
      const diff = monthSpent - prevTotal;
      const percentInc = ((diff / prevTotal) * 100).toFixed(0);
      if (Number(percentInc) >= 15) {
        insights.push({
          type: 'MOM_SPENDING_SPIKE',
          severity: 'medium',
          message: `Spending Trend: Your current spending of ₹${monthSpent.toLocaleString()} is already ${percentInc}% higher than your total spend of last month (₹${prevTotal.toLocaleString()}).`,
        });
      }
    }

    if (insights.length === 0) {
      insights.push({
        type: 'FINANCIAL_TIP',
        severity: 'low',
        message: 'All clear! You are tracking well within your budgets and ledgers are balanced.',
      });
    }

    return {
      success: true,
      data: {
        summary: {
          monthSpent,
          todaySpent,
          highestCategory,
          receivable,
          payable,
          remainingBudget,
          budgetLimit,
        },
        analytics: {
          monthlyTrend,
          categoryBreakdown,
          budgets: budgetStatusList,
          debts: {
            totalReceivable: receivable,
            totalPayable: payable,
          },
        },
        recentExpenses: recentExpensesRaw.map((e) => ({
          id: e.id,
          amount: Number(e.amount),
          description: e.description,
          expenseDate: e.expenseDate.toISOString(),
          paymentMethod: e.paymentMethod,
          categoryName: e.category.name,
          categoryIcon: e.category.icon,
          categoryColor: e.category.color,
        })),
        insights,
      },
    };
  } catch (error) {
    console.error('Failed to get unified dashboard data:', error);
    return { success: false, error: error.message || 'Failed to fetch dashboard data' };
  }
}

export async function getDashboardSummaryAction() {
  const res = await getDashboardDataAction();
  if (!res.success) return res;
  return { success: true, data: res.data.summary };
}

export async function getDashboardAnalyticsAction() {
  const res = await getDashboardDataAction();
  if (!res.success) return res;
  return { success: true, data: res.data.analytics };
}

export async function getDashboardInsightsAction() {
  const res = await getDashboardDataAction();
  if (!res.success) return res;
  return { success: true, insights: res.data.insights };
}
