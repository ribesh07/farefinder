import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { packageLeadSchema } from '@/types';
import { resend } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = packageLeadSchema.parse(body);

    const lead = await prisma.packageLead.create({
      data: validated,
    });

    // Fetch package details for email
    const holidayPackage = await prisma.holidayPackage.findUnique({
      where: { id: validated.packageId },
    });

    // Send email to customer service
    await resend.emails.send({
      from: "FareFinderUK <no-reply@info.farefinderuk.co.uk>",
      to: 'customerservice@farefinderuk.co.uk',
      //  to: validated.email,
      subject: 'New Holiday Package Booking Request from FareFinderUK',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F4C81;">New Holiday Package Booking Request</h2>
      <h3 style="color: #333;">Package Details</h3>
          <p><strong>Title:</strong> ${holidayPackage?.title || 'N/A'}</p>
          <p><strong>Destination:</strong> ${holidayPackage?.destination || 'N/A'}</p>
          <p><strong>Duration:</strong> ${holidayPackage?.duration || 'N/A'}</p>
          <p><strong>Starting Price:</strong> £${holidayPackage?.startingPrice || 'N/A'}</p>
          
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
          subject: `Holiday Package Inquiry Received - ${holidayPackage?.destination || "FareFinderUK"} 🌍`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <div style="text-align:center; padding:20px 0;">
                <h1 style="color:#0F4C81;">
                  Thank You for Your Holiday Inquiry
                </h1>
              </div>

              <p>Dear ${validated.fullName},</p>

              <p>
                Thank you for contacting FareFinderUK. We have successfully received
                your holiday package request and one of our travel consultants will
                review it shortly.
              </p>

              <div style="background:#f7f9fc;padding:20px;border-radius:8px;margin:20px 0;">
                <h3 style="margin-top:0;color:#0F4C81;">Requested Holiday Package</h3>

                <p><strong>Package:</strong> ${holidayPackage?.title || "N/A"}</p>
                <p><strong>Destination:</strong> ${holidayPackage?.destination || "N/A"}</p>
                <p><strong>Duration:</strong> ${holidayPackage?.duration || "N/A"}</p>
                <p><strong>Starting From:</strong> £${holidayPackage?.startingPrice || "N/A"}</p>
                <p><strong>Travellers:</strong> ${validated.travelers}</p>
              </div>

              ${
                validated.notes
                  ? `
                <div style="background:#fafafa;padding:15px;border-left:4px solid #0F4C81;margin:20px 0;">
                  <strong>Your Notes:</strong>
                  <p style="margin-top:10px;">${validated.notes}</p>
                </div>
              `
                  : ""
              }

              <p>
                Our team will contact you shortly with availability, pricing options,
                and any special offers that may apply to your chosen destination.
              </p>

              <p>
                If you require immediate assistance, simply reply to this email or
                contact our team directly.
              </p>

              <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e5e5e5;">
                <p><strong>FareFinderUK</strong></p>
                <p>Email: customerservice@farefinderuk.co.uk</p>
                <p>Phone: +44 7599 064917</p>
                <p>Website: https://farefinderuk.co.uk</p>
              </div>
            </div>
          `,
        });
      } catch (error) {
        console.error("Package confirmation email failed:", error);
      }

    

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Package lead error:', error);
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
