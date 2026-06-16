import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [
    totalFlightLeads,
    totalPackageLeads,
    totalInquiries,
    totalSubscribers,
    totalFlights,
    totalPackages,
    totalBlogPosts,
  ] = await Promise.all([
    prisma.flightBookingLead.count(),
    prisma.packageLead.count(),
    prisma.contactInquiry.count(),
    prisma.newsletterSubscriber.count(),
    prisma.flight.count(),
    prisma.holidayPackage.count(),
    prisma.blogPost.count(),
  ]);

  return NextResponse.json({
    totalFlightLeads,
    totalPackageLeads,
    totalInquiries,
    totalSubscribers,
    totalFlights,
    totalPackages,
    totalBlogPosts,
  });
}
