import { prisma } from "@/lib/prisma"
import EditPackageForm from "./EditPackageForm"

interface EditPackagePageProps {
  params: { id: string }
}

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const pkg = await prisma.holidayPackage.findUnique({ where: { id: params.id } })

  if (!pkg) {
    return <div>Package not found</div>
  }

  return <EditPackageForm pkg={pkg} />
}
