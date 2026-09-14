import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { status: 'error', message: 'No active session' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    status: 'success',
    data: { user },
  });
}
