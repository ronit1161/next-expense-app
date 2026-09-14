import { NextResponse } from 'next/server';
import { logoutAction } from '@/actions/auth-actions';

export async function POST() {
  await logoutAction();
  return NextResponse.json({
    status: 'success',
    message: 'Logged out successfully',
  });
}
