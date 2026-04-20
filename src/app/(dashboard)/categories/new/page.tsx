"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { CategoryForm } from "@/components/shared/CategoryForm";
import { useCreateCategory, useCategories } from "@/lib/hooks/useCategories";
import { CreateCategoryInput } from "@/types";

export default function NewCategoryPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateCategory();
  const { data: allCategories } = useCategories({ page: 1, limit: 100 });

  const parentOptions = (allCategories?.data ?? []).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const handleSubmit = async (values: CreateCategoryInput) => {
    await mutateAsync(values);
    router.push("/categories");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Category" description="Create a new product category" />
      <Card className="p-6">
        <CategoryForm
          parentOptions={parentOptions}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push("/categories")}
        />
      </Card>
    </div>
  );
}
