"use client";

import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { BrandForm } from "@/components/shared/BrandForm";
import { ErrorState } from "@/components/shared/ErrorState";
import { useBrand, useUpdateBrand } from "@/lib/hooks/useBrands";
import { UpdateBrandInput } from "@/types";
import { Loader2 } from "lucide-react";

export default function EditBrandPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: brand, isLoading, error } = useBrand(id);
  const { mutateAsync, isPending } = useUpdateBrand(id);

  const handleSubmit = async (values: UpdateBrandInput) => {
    await mutateAsync(values);
    router.push("/brands");
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !brand) {
    return <ErrorState message="Brand not found" onRetry={() => router.push("/brands")} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Brand" description={`Editing: ${brand.name}`} />
      <Card className="p-6">
        <BrandForm
          defaultValues={brand}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push("/brands")}
        />
      </Card>
    </div>
  );
}
