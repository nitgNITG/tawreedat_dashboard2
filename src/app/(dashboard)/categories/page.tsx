"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { ErrorState } from "@/components/shared/ErrorState";
import { useCategories, useDeleteCategory } from "@/lib/hooks/useCategories";
import { Category, TableQueryParams } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function CategoriesPage() {
  const router = useRouter();
  const [params, setParams] = useState<TableQueryParams>({ page: 1, limit: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useCategories(params);
  const deleteMutation = useDeleteCategory();

  const columns: ColumnDef<Category>[] = [
    {
      key: "name",
      header: "Name (EN)",
      sortable: true,
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "nameAr",
      header: "Name (AR)",
      render: (row) => <span dir="rtl">{row.nameAr ?? "—"}</span>,
    },
    {
      key: "parent",
      header: "Parent",
      render: (row) => row.parent?.name ?? "—",
    },
    {
      key: "description",
      header: "Description",
      render: (row) => (
        <span className="max-w-xs truncate block text-muted-foreground text-sm">
          {row.description ?? "—"}
        </span>
      ),
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
            <DropdownMenuItem onClick={() => router.push(`/categories/${row.id}/edit`)}>
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
        title="Categories"
        description="Organize products by category"
        createHref="/categories/new"
        createLabel="Add Category"
      />

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        meta={data?.meta}
        params={params}
        onParamsChange={(updates) => setParams((prev) => ({ ...prev, ...updates }))}
        isLoading={isLoading}
        emptyMessage="No categories yet. Create your first category."
      />

      <ConfirmModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Category"
        description="Deleting this category may affect products assigned to it."
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
