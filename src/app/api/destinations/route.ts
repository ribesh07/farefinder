import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  const destinations = await prisma.destination.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(destinations);
}
