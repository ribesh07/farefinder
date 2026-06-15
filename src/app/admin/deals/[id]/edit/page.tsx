import { prisma } from "@/lib/prisma"
import EditDealForm from "./EditDealForm"

export const dynamic = "force-dynamic"

interface EditDealPageProps {
  params: { id: string }
}

export default async function EditDealPage({ params }: EditDealPageProps) {
  const deal = await prisma.deal.findUnique({ where: { id: params.id } })

  if (!deal) {
    return <div>Deal not found</div>
  }

  return <EditDealForm deal={deal} />
}
