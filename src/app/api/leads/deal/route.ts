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
      //  to: validated.email,
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

      try {
        await resend.emails.send({
          from: "FareFinderUK <no-reply@info.farefinderuk.co.uk>",
          to: validated.email,
          subject: `Deal Inquiry Received - ${deal?.title || "FareFinderUK"} ✈️`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <div style="text-align:center; padding:20px 0;">
                <h1 style="color:#0F4C81;">
                  Thank You for Your Interest
                </h1>
              </div>

              <p>Dear ${validated.fullName},</p>

              <p>
                Thank you for your interest in one of our exclusive travel deals.
                We have successfully received your request and our travel team will
                review availability and pricing for you shortly.
              </p>

              <div style="background:#f7f9fc;padding:20px;border-radius:8px;margin:20px 0;">
                <h3 style="margin-top:0;color:#0F4C81;">Selected Deal</h3>

                <p><strong>Deal:</strong> ${deal?.title || "N/A"}</p>

                ${
                  deal?.oldPrice
                    ? `<p><strong>Original Price:</strong> £${deal.oldPrice}</p>`
                    : ""
                }

                <p><strong>Special Offer Price:</strong> £${deal?.newPrice || "N/A"}</p>
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
                A member of our team will contact you soon to discuss your travel
                requirements and help secure the best available option for your trip.
              </p>

              <p>
                Please note that promotional fares and offers are subject to
                availability and may change without notice.
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
        console.error("Deal confirmation email failed:", error);
      }


    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Deal lead error:', error);
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
