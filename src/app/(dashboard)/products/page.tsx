"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { ErrorState } from "@/components/shared/ErrorState";
import { useProducts, useDeleteProduct } from "@/lib/hooks/useProducts";
import { Product, TableQueryParams } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

export default function ProductsPage() {
  const router = useRouter();
  const [params, setParams] = useState<TableQueryParams>({ page: 1, limit: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useProducts(params);
  const deleteMutation = useDeleteProduct();

  const columns: ColumnDef<Product>[] = [
    {
      key: "name",
      header: "Product",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          {row.sku && <p className="text-xs text-muted-foreground">SKU: {row.sku}</p>}
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (row) => (
        <span className="font-semibold tabular-nums">
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "EGP" }).format(row.price)}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Stock",
      render: (row) => (
        <span
          className={
            (row.quantity ?? 0) === 0
              ? "text-destructive"
              : (row.quantity ?? 0) < 10
              ? "text-amber-600"
              : "text-foreground"
          }
        >
          {row.quantity ?? "—"} {row.unit ?? ""}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => row.category?.name ?? "—",
    },
    {
      key: "brand",
      header: "Brand",
      render: (row) => row.brand?.name ?? "—",
    },
    {
      key: "supplier",
      header: "Supplier",
      render: (row) => row.supplier?.name ?? "—",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row) => format(new Date(row.createdAt), "MMM d, yyyy"),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/products/${row.id}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/products/${row.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(row.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (error) {
    return <ErrorState message={(error as Error).message} onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        createHref="/products/new"
        createLabel="Add Product"
      />

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        meta={data?.meta}
        params={params}
        onParamsChange={(updates) => setParams((prev) => ({ ...prev, ...updates }))}
        isLoading={isLoading}
        emptyMessage="No products yet. Add your first product."
      />

      <ConfirmModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deleteId) {
            await deleteMutation.mutateAsync(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}
