import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [flightLeads, packageLeads, destinationLeads, dealLeads] = await Promise.all([
    prisma.flightBookingLead.findMany({
      include: { flight: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.packageLead.findMany({
      include: { holidayPackage: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.destinationLead.findMany({
      include: { destination: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.dealLead.findMany({
      include: { deal: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({ flightLeads, packageLeads, destinationLeads, dealLeads });
}
