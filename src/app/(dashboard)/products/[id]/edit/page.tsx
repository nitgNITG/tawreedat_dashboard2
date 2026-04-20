"use client";

import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductForm } from "@/components/shared/ProductForm";
import { ErrorState } from "@/components/shared/ErrorState";
import { useProduct, useUpdateProduct } from "@/lib/hooks/useProducts";
import { useCategories } from "@/lib/hooks/useCategories";
import { useBrands } from "@/lib/hooks/useBrands";
import { useSuppliers } from "@/lib/hooks/useSuppliers";
import { UpdateProductInput } from "@/types";
import { Loader2 } from "lucide-react";

const ALL_PARAMS = { page: 1, limit: 200 };

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, error } = useProduct(id);
  const { mutateAsync, isPending } = useUpdateProduct(id);
  const { data: catData } = useCategories(ALL_PARAMS);
  const { data: brandData } = useBrands(ALL_PARAMS);
  const { data: supplierData } = useSuppliers(ALL_PARAMS);

  const handleSubmit = async (values: UpdateProductInput) => {
    await mutateAsync(values);
    router.push("/products");
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !product) {
    return <ErrorState message="Product not found" onRetry={() => router.push("/products")} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Product" description={`Editing: ${product.name}`} />
      <Card className="p-6">
        <ProductForm
          defaultValues={product}
          categories={catData?.data}
          brands={brandData?.data}
          suppliers={supplierData?.data}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push("/products")}
        />
      </Card>
    </div>
  );
}
