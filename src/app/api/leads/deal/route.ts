import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { dealLeadSchema } from '@/types';
import { resend } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = dealLeadSchema.parse(body);

    const lead = await prisma.dealLead.create({
      data: validated,
    });

    // Fetch deal details for email
    const deal = await prisma.deal.findUnique({
      where: { id: validated.dealId },
    });

    // Send email to customer service
    await resend.emails.send({
      from: "FareFinderUK <no-reply@info.farefinderuk.co.uk>",
      to: 'customerservice@farefinderuk.co.uk',
      subject: 'New Deal Interest Request from FareFinderUK',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F4C81;">New Deal Interest Request</h2>
          <h3 style="color: #333;">Deal Details</h3>
          <p><strong>Title:</strong> ${deal?.title || 'N/A'}</p>
          <p><strong>New Price:</strong> £${deal?.newPrice || 'N/A'}</p>
          ${deal?.oldPrice ? `<p><strong>Old Price:</strong> £${deal.oldPrice}</p>` : ''}
          
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
    console.error('Deal lead error:', error);
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
