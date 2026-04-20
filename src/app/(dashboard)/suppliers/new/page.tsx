"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { SupplierForm } from "@/components/shared/SupplierForm";
import { useCreateSupplier } from "@/lib/hooks/useSuppliers";
import { CreateSupplierInput } from "@/types";

export default function NewSupplierPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateSupplier();

  const handleSubmit = async (values: CreateSupplierInput) => {
    await mutateAsync(values);
    router.push("/suppliers");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Supplier" description="Create a new supply partner" />
      <Card className="p-6">
        <SupplierForm
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push("/suppliers")}
        />
      </Card>
    </div>
  );
}
