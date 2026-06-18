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

    try{

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
    }catch(emailError){
      console.error('Error sending email:', emailError);
    }
    try{      
        // Send confirmation email to customer
        await resend.emails.send({
          from: "FareFinderUK <no-reply@info.farefinderuk.co.uk>",
          to: validated.email,
          subject: "We've Received Your Flight Booking Request ✈️",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <div style="text-align: center; padding: 20px 0;">
                <h1 style="color: #0F4C81; margin-bottom: 10px;">
                  Thank You for Your Booking Request
                </h1>
              </div>

              <p>Dear ${validated.fullName},</p>

              <p>
                Thank you for choosing FareFinderUK. We have successfully received your
                flight booking request and one of our travel specialists will review it shortly.
              </p>

              <div style="background:#f7f9fc;padding:20px;border-radius:8px;margin:20px 0;">
                <h3 style="margin-top:0;color:#0F4C81;">Your Requested Flight</h3>

                <p><strong>Airline:</strong> ${flight?.airline || "N/A"}</p>
                <p><strong>Flight Number:</strong> ${flight?.flightNumber || "N/A"}</p>
                <p><strong>Route:</strong> ${flight?.fromAirport || "N/A"} → ${flight?.toAirport || "N/A"}</p>
                <p><strong>Departure Date:</strong> ${validated.departureDate}</p>

                ${
                  validated.returnDate
                    ? `<p><strong>Return Date:</strong> ${validated.returnDate}</p>`
                    : ""
                }

                <p><strong>Passengers:</strong> ${validated.adults} Adult(s), ${validated.children} Child(ren)</p>
                <p><strong>Indicative Fare:</strong> £${flight?.farePrice || "N/A"}</p>
              </div>

              <p>
                Our team will contact you soon to confirm availability, pricing, and any
                additional travel requirements.
              </p>

              <p>
                If you need immediate assistance, please reply to this email or contact us on WhatsApp.
              </p>

              <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;">
                <p><strong>FareFinderUK</strong></p>
                <p>Email: customerservice@farefinderuk.co.uk</p>
                <p>Phone: +44 7415 026444</p>
                <p>WhatsApp: +44 7415 026444</p>
              </div>
            </div>
          `,
        });

    }catch(emailError){
      console.error('Error sending confirmation email:', emailError);
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Flight lead error:', error);
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
