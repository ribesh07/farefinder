import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { newsletterSchema } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = newsletterSchema.parse(body);

    await prisma.newsletterSubscriber.create({
      data: validated,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Ignore duplicates
    return NextResponse.json({ success: true });
  }
}
