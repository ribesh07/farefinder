import EditFlightForm from "./EditFlightForm";

export default function EditFlightPage({ params }: { params: { id: string } }) {
  return <EditFlightForm id={params.id} />;
}
