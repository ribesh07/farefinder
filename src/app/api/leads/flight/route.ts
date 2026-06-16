import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { flightLeadSchema } from '@/types';
import { resend } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = flightLeadSchema.parse(body);

    // Save to database
    const { departureDate, returnDate, ...rest } = validated;
    const lead = await prisma.flightBookingLead.create({
      data: {
        ...rest,
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : null,
      },
    });

    // Fetch flight details for email
    const flight = await prisma.flight.findUnique({
      where: { id: validated.flightId },
    });

    // Send email to customer service
    await resend.emails.send({
      from: "FareFinderUK <no-reply@info.farefinderuk.co.uk>",
      to: 'customerservice@farefinderuk.co.uk',
      subject: 'New Flight Booking Request from FareFinderUK',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F4C81;">New Flight Booking Request</h2>
          <h3 style="color: #333;">Flight Details</h3>
          <p><strong>Airline:</strong> ${flight?.airline || 'N/A'}</p>
          <p><strong>Flight Number:</strong> ${flight?.flightNumber || 'N/A'}</p>
          <p><strong>Route:</strong> ${flight?.fromAirport || 'N/A'} → ${flight?.toAirport || 'N/A'}</p>
          <p><strong>Price:</strong> £${flight?.farePrice || 'N/A'}</p>
          
          <h3 style="color: #333; margin-top: 24px;">Passenger Details</h3>
          <p><strong>Full Name:</strong> ${validated.fullName}</p>
          <p><strong>Email:</strong> ${validated.email}</p>
          <p><strong>Phone:</strong> ${validated.phone}</p>
          ${validated.whatsapp ? `<p><strong>WhatsApp:</strong> ${validated.whatsapp}</p>` : ''}
          <p><strong>Adults:</strong> ${validated.adults}</p>
          <p><strong>Children:</strong> ${validated.children}</p>
          <p><strong>Departure Date:</strong> ${validated.departureDate}</p>
          ${validated.returnDate ? `<p><strong>Return Date:</strong> ${validated.returnDate}</p>` : ''}
          ${validated.notes ? `
            <p><strong>Notes:</strong></p>
            <p style="background-color: #f5f5f5; padding: 16px; border-radius: 8px;">
              ${validated.notes}
            </p>
          ` : ''}
        </div>
      `,
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Flight lead error:', error);
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
