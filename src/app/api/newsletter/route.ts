import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { newsletterSchema } from '@/types';
import { resend } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = newsletterSchema.parse(body);

    // Save to database
    await prisma.newsletterSubscriber.create({
      data: validated,
    });

    // Send welcome email
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'FareFinderUK <no-reply@farefinderuk.co.uk>',
      to: validated.email,
      subject: 'Welcome to FareFinderUK Newsletter! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0F4C81;">Welcome to FareFinderUK!</h2>
          <p>Hi there,</p>
          <p>Thank you for subscribing to the FareFinderUK newsletter! We're excited to bring you the best travel deals, tips, and exclusive offers directly to your inbox.</p>
          <p>Stay tuned for amazing discounts on flights, holiday packages, and more!</p>
          <p>Warm regards,<br>The FareFinderUK Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Ignore duplicates
    console.error('Newsletter error:', error);
    return NextResponse.json({ success: true });
  }
}
