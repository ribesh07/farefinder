import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { flightLeadSchema } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = flightLeadSchema.parse(body);

    const { departureDate, returnDate, ...rest } = validated;
    const lead = await prisma.flightBookingLead.create({
      data: {
        ...rest,
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : null,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
