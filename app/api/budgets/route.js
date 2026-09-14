import { NextResponse } from 'next/server';
import { setBudgetAction } from '@/actions/budget-actions';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await setBudgetAction(body);

    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Budget set successfully',
        data: { budget: result.budget },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
