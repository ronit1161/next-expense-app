import { NextResponse } from 'next/server';
import { getDashboardInsightsAction } from '@/actions/dashboard-actions';

export async function GET() {
  try {
    const result = await getDashboardInsightsAction();
    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }
    return NextResponse.json({
      status: 'success',
      data: { insights: result.insights },
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
