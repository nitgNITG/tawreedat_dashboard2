"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorState } from "@/components/shared/ErrorState";
import { useProduct } from "@/lib/hooks/useProducts";
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

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(id);

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

  const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "EGP" }).format(product.price);
  const cost = product.cost != null
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "EGP" }).format(product.cost)
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={product.name}
        description={product.sku ? `SKU: ${product.sku}` : "Product details"}
        action={
          <Button asChild size="sm" variant="outline">
            <Link href={`/products/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold">Details</h2>
          <DetailRow label="Name (EN)" value={product.name} />
          <DetailRow label="Name (AR)" value={product.nameAr} />
          <DetailRow label="SKU" value={product.sku} />
          <DetailRow label="Description" value={product.description} />
          <DetailRow label="Unit" value={product.unit} />
          <DetailRow label="Category" value={product.category?.name} />
          <DetailRow label="Brand" value={product.brand?.name} />
          <DetailRow label="Supplier" value={product.supplier?.name} />
          <DetailRow label="Status" value={<StatusBadge status={product.status} />} />
          <DetailRow label="Created" value={format(new Date(product.createdAt), "PPP")} />
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selling Price</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{price}</p>
          </Card>
          {cost && (
            <Card className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cost Price</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-muted-foreground">{cost}</p>
            </Card>
          )}
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${(product.quantity ?? 0) === 0 ? "text-destructive" : ""}`}>
              {product.quantity ?? 0} {product.unit ?? "units"}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
