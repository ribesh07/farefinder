import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const settings = await prisma.websiteSettings.findUnique({
    where: { id: "default" },
  });

  return NextResponse.json(
    settings ?? {
      id: "default",
      companyName: "FareFinderUK",
      supportEmail: "customerservice@farefinderuk.co.uk",
      supportPhone: "+44 7599 064917",
      whatsappNumber: "+44 7599 064917",
      facebook: null,
      instagram: null,
      twitter: null,
      linkedin: null,
      officeAddress: "Glassgow, UK",
      smtpHost: null,
      smtpPort: null,
      smtpUser: null,
      smtpPassword: null,
    }
  );
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const data = await request.json();

  try {
    const settings = await prisma.websiteSettings.upsert({
      where: { id: "default" },
      update: {
        companyName: data.companyName,
        supportEmail: data.supportEmail,
        supportPhone: data.supportPhone,
        whatsappNumber: data.whatsappNumber,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        twitter: data.twitter || null,
        linkedin: data.linkedin || null,
        officeAddress: data.officeAddress,
        smtpHost: data.smtpHost || null,
        smtpPort: data.smtpPort ? Number(data.smtpPort) : null,
        smtpUser: data.smtpUser || null,
        smtpPassword: data.smtpPassword || null,
      },
      create: {
        id: "default",
        companyName: data.companyName,
        supportEmail: data.supportEmail,
        supportPhone: data.supportPhone,
        whatsappNumber: data.whatsappNumber,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        twitter: data.twitter || null,
        linkedin: data.linkedin || null,
        officeAddress: data.officeAddress,
        smtpHost: data.smtpHost || null,
        smtpPort: data.smtpPort ? Number(data.smtpPort) : null,
        smtpUser: data.smtpUser || null,
        smtpPassword: data.smtpPassword || null,
      },
    });

    revalidatePath("/admin/settings");
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
