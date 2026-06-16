import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { contactInquirySchema } from '@/types';
import { resend } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactInquirySchema.parse(body);

    // Save to database
    const inquiry = await prisma.contactInquiry.create({
      data: validated,
    });

    // Send email to customer service
    await resend.emails.send({
      from: "FareFinderUK <no-reply@info.farefinderuk.co.uk>",
      to: 'customerservice@farefinderuk.co.uk',
      subject: 'New Contact Inquiry from FareFinderUK',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F4C81;">New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${validated.name}</p>
          <p><strong>Email:</strong> ${validated.email}</p>
          <p><strong>Phone:</strong> ${validated.phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: #f5f5f5; padding: 16px; border-radius: 8px;">
            ${validated.message}
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
