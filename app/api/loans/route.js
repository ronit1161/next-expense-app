import { NextResponse } from 'next/server';
import { getLoansAction, createLoanAction } from '@/actions/loan-actions';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;

    const result = await getLoansAction({ type, status });
    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      data: {
        loans: result.loans,
        summary: result.summary,
      },
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await createLoanAction(body);

    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Loan record created successfully.',
        data: { loan: result.loan },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
