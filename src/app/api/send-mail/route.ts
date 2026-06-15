import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  const body = await req.json();

//   await resend.emails.send({
//     from: process.env.EMAIL_FROM!,
//     to: body.email!,
//     subject: `New Flight Inquiry`,
//     html: `
//       <h2>New Flight Inquiry</h2>
//       <p>Name: ${body.name}</p>
//       <p>Email: ${body.email}</p>
//       <p>Phone: ${body.phone}</p>
//       <p>Message: ${body.message}</p>
//     `,
//   });

  return NextResponse.json({
    success: true,
  });
}