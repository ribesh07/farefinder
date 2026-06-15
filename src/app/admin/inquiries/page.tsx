import { prisma } from "@/lib/prisma"
import InquiryList from "./InquiryList"

export const dynamic = "force-dynamic"

export default async function InquiriesPage() {
  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contact Inquiries</h1>
      <InquiryList inquiries={inquiries} />
    </div>
  )
}
