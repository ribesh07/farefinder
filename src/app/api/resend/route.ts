import { resend } from "@/lib/resend";

export async function GET() {


// const addd = await resend.domains.create({ name: 'info.farefinderuk.co.uk' });
const domains = await resend.domains.list();
//   const result = await resend.emails.send({
//   from: "FareFinderUK <no-reply@info.farefinderuk.co.uk>",
//   to: "sahr8074@gmail.com",
//   subject: "Test",
//   html: "<p>Hello</p>",
// });

  return Response.json({domains});
}