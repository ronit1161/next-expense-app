import { NextResponse } from 'next/server';
import { getBudgetStatusAction } from '@/actions/budget-actions';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const result = await getBudgetStatusAction(year, month);
    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      data: {
        period: result.period,
        budgets: result.budgets,
      },
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
