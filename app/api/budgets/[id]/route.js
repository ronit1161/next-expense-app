import { NextResponse } from 'next/server';
import { deleteBudgetAction } from '@/actions/budget-actions';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await deleteBudgetAction(id);
    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }
    return NextResponse.json({
      status: 'success',
      message: 'Budget limit removed successfully',
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
