import { NextResponse } from 'next/server';
import { submitContactForm } from '@/app/actions/contact';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await submitContactForm(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message }, { status: 201 });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Failed to submit contact message' }, { status: 500 });
  }
}
