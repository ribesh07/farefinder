import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const deals = await prisma.deal.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(deals);
}
