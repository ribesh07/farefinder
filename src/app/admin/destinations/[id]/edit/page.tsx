import EditDestinationForm from "./EditDestinationForm";

export default function EditDestinationPage({ params }: { params: { id: string } }) {
  return <EditDestinationForm id={params.id} />;
}
