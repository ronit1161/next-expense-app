import { NextResponse } from 'next/server';
import { recordSettlementAction } from '@/actions/loan-actions';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await recordSettlementAction(id, body);

    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Settlement transaction logged successfully.',
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
