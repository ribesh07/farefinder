import { prisma } from "@/lib/prisma"
import EditTestimonialForm from "./EditTestimonialForm"

interface EditTestimonialPageProps {
  params: { id: string }
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const testimonial = await prisma.testimonial.findUnique({ where: { id: params.id } })

  if (!testimonial) {
    return <div>Testimonial not found</div>
  }

  return <EditTestimonialForm testimonial={testimonial} />
}
