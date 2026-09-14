import { NextResponse } from 'next/server';
import {
  getExpenseAction,
  updateExpenseAction,
  deleteExpenseAction,
} from '@/actions/expense-actions';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await getExpenseAction(id);
    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 404 });
    }
    return NextResponse.json({
      status: 'success',
      data: { expense: result.expense },
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateExpenseAction(id, body);
    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }
    return NextResponse.json({
      status: 'success',
      message: 'Expense updated successfully',
      data: { expense: result.expense },
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await deleteExpenseAction(id);
    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }
    return NextResponse.json({
      status: 'success',
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
