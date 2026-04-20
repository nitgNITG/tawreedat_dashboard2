"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductForm } from "@/components/shared/ProductForm";
import { useCreateProduct } from "@/lib/hooks/useProducts";
import { useCategories } from "@/lib/hooks/useCategories";
import { useBrands } from "@/lib/hooks/useBrands";
import { useSuppliers } from "@/lib/hooks/useSuppliers";
import { CreateProductInput } from "@/types";

const ALL_PARAMS = { page: 1, limit: 200 };

export default function NewProductPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateProduct();
  const { data: catData } = useCategories(ALL_PARAMS);
  const { data: brandData } = useBrands(ALL_PARAMS);
  const { data: supplierData } = useSuppliers(ALL_PARAMS);

  const handleSubmit = async (values: CreateProductInput) => {
    await mutateAsync(values);
    router.push("/products");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Product" description="Create a new product in your catalog" />
      <Card className="p-6">
        <ProductForm
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
