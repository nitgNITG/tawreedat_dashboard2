"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { ErrorState } from "@/components/shared/ErrorState";
import { useSuppliers, useDeleteSupplier } from "@/lib/hooks/useSuppliers";
import { Supplier, TableQueryParams } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

export default function SuppliersPage() {
  const router = useRouter();
  const [params, setParams] = useState<TableQueryParams>({ page: 1, limit: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useSuppliers(params);
  const deleteMutation = useDeleteSupplier();

  const columns: ColumnDef<Supplier>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    {
      key: "contactPerson",
      header: "Contact Person",
      render: (row) => row.contactPerson ?? "—",
    },
    {
      key: "city",
      header: "City",
      render: (row) => row.city ?? "—",
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
            <DropdownMenuItem onClick={() => router.push(`/suppliers/${row.id}`)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/suppliers/${row.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(row.id)}
            >
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
        title="Suppliers"
        description="Manage your supply partners and vendors"
        createHref="/suppliers/new"
        createLabel="Add Supplier"
      />

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        meta={data?.meta}
        params={params}
        onParamsChange={(updates) => setParams((prev) => ({ ...prev, ...updates }))}
        isLoading={isLoading}
        emptyMessage="No suppliers found. Add your first supplier to get started."
      />

      <ConfirmModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Supplier"
        description="Are you sure you want to delete this supplier? This action cannot be undone."
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
