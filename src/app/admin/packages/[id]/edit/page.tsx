import EditPackageForm from "./EditPackageForm";

export default function EditPackagePage({ params }: { params: { id: string } }) {
  return <EditPackageForm id={params.id} />;
}
