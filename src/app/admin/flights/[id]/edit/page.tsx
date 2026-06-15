import { prisma } from "@/lib/prisma"
import EditFlightForm from "./EditFlightForm"

export const dynamic = "force-dynamic"

interface EditFlightPageProps {
  params: { id: string }
}

export default async function EditFlightPage({ params }: EditFlightPageProps) {
  const flight = await prisma.flight.findUnique({ where: { id: params.id } })

  if (!flight) {
    return <div>Flight not found</div>
  }

  return <EditFlightForm flight={flight} />
}
