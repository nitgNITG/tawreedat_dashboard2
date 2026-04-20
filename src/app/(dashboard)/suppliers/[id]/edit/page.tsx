"use client";

import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { SupplierForm } from "@/components/shared/SupplierForm";
import { ErrorState } from "@/components/shared/ErrorState";
import { useSupplier, useUpdateSupplier } from "@/lib/hooks/useSuppliers";
import { UpdateSupplierInput } from "@/types";
import { Loader2 } from "lucide-react";

export default function EditSupplierPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: supplier, isLoading, error } = useSupplier(id);
  const { mutateAsync, isPending } = useUpdateSupplier(id);

  const handleSubmit = async (values: UpdateSupplierInput) => {
    await mutateAsync(values);
    router.push("/suppliers");
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !supplier) {
    return <ErrorState message="Supplier not found" onRetry={() => router.push("/suppliers")} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Supplier" description={`Editing: ${supplier.name}`} />
      <Card className="p-6">
        <SupplierForm
          defaultValues={supplier}
          onSubmit={handleSubmit}
          isLoading={isPending}
          onCancel={() => router.push("/suppliers")}
        />
      </Card>
    </div>
  );
}
