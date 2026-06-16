import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { destinationLeadSchema } from '@/types';
import { resend } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = destinationLeadSchema.parse(body);

    const lead = await prisma.destinationLead.create({
      data: validated,
    });

    // Fetch destination details for email
    const destination = await prisma.destination.findUnique({
      where: { id: validated.destinationId },
    });

    // Send email to customer service
    await resend.emails.send({
      from: "FareFinderUK <no-reply@info.farefinderuk.co.uk>",
      to: 'customerservice@farefinderuk.co.uk',
      subject: 'New Destination Interest Request from FareFinderUK',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F4C81;">New Destination Interest Request</h2>
          <h3 style="color: #333;">Destination Details</h3>
          <p><strong>Name:</strong> ${destination?.name || 'N/A'}</p>
          <p><strong>Country:</strong> ${destination?.country || 'N/A'}</p>
          <p><strong>Starting Fare:</strong> £${destination?.startingFare || 'N/A'}</p>
          
          <h3 style="color: #333; margin-top: 24px;">Customer Details</h3>
          <p><strong>Full Name:</strong> ${validated.fullName}</p>
          <p><strong>Email:</strong> ${validated.email}</p>
          <p><strong>Phone:</strong> ${validated.phone}</p>
          ${validated.whatsapp ? `<p><strong>WhatsApp:</strong> ${validated.whatsapp}</p>` : ''}
          <p><strong>Travelers:</strong> ${validated.travelers}</p>
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
    console.error('Destination lead error:', error);
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
