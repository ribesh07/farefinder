import { prisma } from "@/lib/prisma"
import SettingsForm from "./SettingsForm"

export const dynamic = "force-dynamic"

interface Settings {
  id: string
  companyName: string
  supportEmail: string
  supportPhone: string
  whatsappNumber: string
  facebook: string | null
  instagram: string | null
  twitter: string | null
  linkedin: string | null
  officeAddress: string
  smtpHost: string | null
  smtpPort: number | null
  smtpUser: string | null
  smtpPassword: string | null
}

export default async function SettingsPage() {
  const settings = await prisma.websiteSettings.findUnique({
    where: { id: "default" },
  }) || {
    id: "default",
    companyName: "FareFinderUK",
    supportEmail: "support@farefinderuk.com",
    supportPhone: "+44 20 7123 4567",
    whatsappNumber: "+9779862551025",
    facebook: null,
    instagram: null,
    twitter: null,
    linkedin: null,
    officeAddress: "123 Travel Street, London, UK",
    smtpHost: null,
    smtpPort: null,
    smtpUser: null,
    smtpPassword: null,
  }

  return <SettingsForm initialSettings={settings} />
}
