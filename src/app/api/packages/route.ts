import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const packages = await prisma.holidayPackage.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(packages);
}
