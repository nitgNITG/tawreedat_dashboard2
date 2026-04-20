"use client";

import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { CategoryForm } from "@/components/shared/CategoryForm";
import { ErrorState } from "@/components/shared/ErrorState";
import { useCategory, useUpdateCategory, useCategories } from "@/lib/hooks/useCategories";
import { UpdateCategoryInput } from "@/types";
import { Loader2 } from "lucide-react";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: category, isLoading, error } = useCategory(id);
  const { mutateAsync, isPending } = useUpdateCategory(id);
  const { data: allCategories } = useCategories({ page: 1, limit: 100 });

  const parentOptions = (allCategories?.data ?? [])
    .filter((c) => c.id !== id)
    .map((c) => ({ label: c.name, value: c.id }));

  const handleSubmit = async (values: UpdateCategoryInput) => {
    await mutateAsync(values);
    router.push("/categories");
  };

  // parentOptions uses normalized id (string) — already correct

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !category) {
    return <ErrorState message="Category not found" onRetry={() => router.push("/categories")} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Category" description={`Editing: ${category.name}`} />
      <Card className="p-6">
        <CategoryForm
          defaultValues={category}
          parentOptions={parentOptions}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push("/categories")}
        />
      </Card>
    </div>
  );
}
