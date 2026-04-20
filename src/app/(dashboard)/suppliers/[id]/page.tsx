"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorState } from "@/components/shared/ErrorState";
import { useSupplier } from "@/lib/hooks/useSuppliers";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-border last:border-0">
      <span className="w-40 shrink-0 text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? "—"}</span>
    </div>
  );
}

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: supplier, isLoading, error } = useSupplier(id);

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
      <PageHeader
        title={supplier.name}
        description="Supplier details"
        action={
          <Button asChild size="sm" variant="outline">
            <Link href={`/suppliers/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        }
      />

      <Card className="p-6">
        <DetailRow label="Name" value={supplier.name} />
        <DetailRow label="Email" value={supplier.email} />
        <DetailRow label="Phone" value={supplier.phone} />
        <DetailRow label="Contact Person" value={supplier.contactPerson} />
        <DetailRow label="Address" value={supplier.address} />
        <DetailRow label="City" value={supplier.city} />
        <DetailRow label="Country" value={supplier.country} />
        <DetailRow label="Status" value={<StatusBadge status={supplier.status} />} />
        <DetailRow label="Created" value={format(new Date(supplier.createdAt), "PPP")} />
        <DetailRow label="Updated" value={format(new Date(supplier.updatedAt), "PPP")} />
      </Card>
    </div>
  );
}
