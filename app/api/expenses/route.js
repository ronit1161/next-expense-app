import { NextResponse } from 'next/server';
import { getExpensesAction, createExpenseAction } from '@/actions/expense-actions';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const categoryId = searchParams.get('categoryId') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const result = await getExpensesAction({ page, limit, categoryId, startDate, endDate });

    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      data: {
        expenses: result.expenses,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await createExpenseAction(body);

    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Expense added successfully',
        data: { expense: result.expense },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
