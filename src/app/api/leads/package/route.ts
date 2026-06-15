import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { packageLeadSchema } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = packageLeadSchema.parse(body);

    const lead = await prisma.packageLead.create({
      data: validated,
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
