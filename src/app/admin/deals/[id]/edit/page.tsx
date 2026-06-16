import EditDealForm from "./EditDealForm";

export default function EditDealPage({ params }: { params: { id: string } }) {
  return <EditDealForm id={params.id} />;
}
