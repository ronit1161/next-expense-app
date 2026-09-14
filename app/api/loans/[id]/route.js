import { NextResponse } from 'next/server';
import { getLoanDetailsAction, deleteLoanAction } from '@/actions/loan-actions';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await getLoanDetailsAction(id);
    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 404 });
    }
    return NextResponse.json({
      status: 'success',
      data: {
        loan: result.loan,
        settlements: result.settlements,
      },
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await deleteLoanAction(id);
    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }
    return NextResponse.json({
      status: 'success',
      message: 'Loan record deleted successfully.',
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
