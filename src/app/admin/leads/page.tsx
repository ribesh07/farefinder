import { prisma } from "@/lib/prisma"
import LeadsList from "./LeadsList"

export default async function LeadsPage() {
  const flightLeads = await prisma.flightBookingLead.findMany({
    include: { flight: true },
    orderBy: { createdAt: "desc" },
  })
  const packageLeads = await prisma.packageLead.findMany({
    include: { holidayPackage: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Leads</h1>
      <LeadsList flightLeads={flightLeads} packageLeads={packageLeads} />
    </div>
  )
}
