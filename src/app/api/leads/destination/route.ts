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
      //  to: validated.email,
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

    
      try {
        await resend.emails.send({
          from: "FareFinderUK <no-reply@info.farefinderuk.co.uk>",
          to: validated.email,
          subject: `Destination Inquiry Received - ${destination?.name || "FareFinderUK"} 🌍`,
          
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <div style="text-align:center; padding:20px 0;">
                <h1 style="color:#0F4C81;">
                  Thank You for Your Inquiry
                </h1>
              </div>

              <p>Dear ${validated.fullName},</p>

              <p>
                Thank you for your interest in travelling with FareFinderUK.
                We have successfully received your destination inquiry and one of our
                travel specialists will contact you shortly with personalised options
                and travel recommendations.
              </p>

              <div style="background:#f7f9fc;padding:20px;border-radius:8px;margin:20px 0;">
                <h3 style="margin-top:0;color:#0F4C81;">Destination Details</h3>

                <p><strong>Destination:</strong> ${destination?.name || "N/A"}</p>
                <p><strong>Country:</strong> ${destination?.country || "N/A"}</p>
                <p><strong>Starting Fare:</strong> £${destination?.startingFare || "N/A"}</p>
                <p><strong>Travellers:</strong> ${validated.travelers}</p>
              </div>

              ${
                validated.notes
                  ? `
                <div style="background:#fafafa;padding:15px;border-left:4px solid #0F4C81;margin:20px 0;">
                  <strong>Your Travel Preferences:</strong>
                  <p style="margin-top:10px;">${validated.notes}</p>
                </div>
              `
                  : ""
              }

              <p>
                Our team will review your request and provide suitable flight,
                holiday package, and travel options based on your requirements.
              </p>

              <p>
                We aim to respond as quickly as possible, usually within a few hours
                during business hours.
              </p>

              <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e5e5e5;">
                <p><strong>FareFinderUK</strong></p>
                <p>Email: customerservice@farefinderuk.co.uk</p>
                <p>Phone: +44 7415 026444</p>
                <p>Website: https://farefinderuk.co.uk</p>
              </div>
            </div>
          `,
        });
      } catch (error) {
        console.error("Destination confirmation email failed:", error);
      }


    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Destination lead error:', error);
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
