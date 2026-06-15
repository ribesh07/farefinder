import { prisma } from "@/lib/prisma"
import EditDestinationForm from "./EditDestinationForm"

interface EditDestinationPageProps {
  params: { id: string }
}

export default async function EditDestinationPage({ params }: EditDestinationPageProps) {
  const dest = await prisma.destination.findUnique({ where: { id: params.id } })

  if (!dest) {
    return <div>Destination not found</div>
  }

  return <EditDestinationForm dest={dest} />
}
