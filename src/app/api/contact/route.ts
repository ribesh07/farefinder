import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { contactInquirySchema } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactInquirySchema.parse(body);

    const inquiry = await prisma.contactInquiry.create({
      data: validated,
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
