"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminListSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { adminFetch } from "@/lib/admin-fetch";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  author: string;
  slug: string;
  published: boolean;
};

export default function BlogAdminList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminFetch<BlogPost[]>("/blog");
    if (result.ok) {
      setPosts(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog Posts"
        description="Manage blog content and articles."
        actionHref="/admin/blog/new"
        actionLabel="Add Post"
      />

      {error && <AdminAlert type="error" message={error} />}

      {loading ? (
        <AdminListSkeleton />
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No blog posts yet. Write your first article.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/blog/${post.id}/edit`}>
                      <Button variant="ghost" size="sm" aria-label="Edit post">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <DeleteButton
                      endpoint={`/blog/${post.id}`}
                      itemName={post.title}
                      onDeleted={loadPosts}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <span className="text-gray-500">Category:</span>{" "}
                    {post.category}
                  </div>
                  <div>
                    <span className="text-gray-500">Author:</span> {post.author}
                  </div>
                  <div>
                    <span className="text-gray-500">Slug:</span> {post.slug}
                  </div>
                  <div>
                    {post.published ? (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
