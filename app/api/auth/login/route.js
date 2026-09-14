import { NextResponse } from 'next/server';
import { loginAction } from '@/actions/auth-actions';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await loginAction(body);

    if (!result.success) {
      return NextResponse.json(
        { status: 'error', message: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Logged in successfully',
        data: { user: result.user },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
