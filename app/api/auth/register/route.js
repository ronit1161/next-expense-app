import { NextResponse } from 'next/server';
import { registerAction } from '@/actions/auth-actions';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await registerAction(body);

    if (!result.success) {
      return NextResponse.json(
        { status: 'error', message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'User registered successfully',
        data: { user: result.user },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
