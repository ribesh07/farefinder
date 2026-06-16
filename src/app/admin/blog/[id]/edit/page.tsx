import EditBlogForm from "./EditBlogForm";

export default function EditBlogPage({ params }: { params: { id: string } }) {
  return <EditBlogForm id={params.id} />;
}
