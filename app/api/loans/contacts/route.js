import { NextResponse } from 'next/server';
import { getContactsAction } from '@/actions/loan-actions';

export async function GET() {
  try {
    const result = await getContactsAction();
    if (!result.success) {
      return NextResponse.json({ status: 'error', message: result.error }, { status: 400 });
    }
    return NextResponse.json({
      status: 'success',
      data: { contacts: result.contacts },
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
