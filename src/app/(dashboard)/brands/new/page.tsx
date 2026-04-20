"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { BrandForm } from "@/components/shared/BrandForm";
import { useCreateBrand } from "@/lib/hooks/useBrands";
import { CreateBrandInput } from "@/types";

export default function NewBrandPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateBrand();

  const handleSubmit = async (values: CreateBrandInput) => {
    await mutateAsync(values);
    router.push("/brands");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Brand" description="Create a new product brand" />
      <Card className="p-6">
        <BrandForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push("/brands")}
        />
      </Card>
    </div>
  );
}
