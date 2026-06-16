import EditTestimonialForm from "./EditTestimonialForm";

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  return <EditTestimonialForm id={params.id} />;
}
