"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, ColumnDef } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { ErrorState } from "@/components/shared/ErrorState";
import { useBrands, useDeleteBrand } from "@/lib/hooks/useBrands";
import { Brand, TableQueryParams } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Globe } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

export default function BrandsPage() {
  const router = useRouter();
  const [params, setParams] = useState<TableQueryParams>({ page: 1, limit: 10 });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useBrands(params);
  const deleteMutation = useDeleteBrand();

  const columns: ColumnDef<Brand>[] = [
    {
      key: "logo",
      header: "",
      className: "w-12",
      render: (row) =>
        row.logo ? (
          <Image
            src={row.logo}
            alt={row.name}
            width={32}
            height={32}
            className="h-8 w-8 rounded object-contain"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
            {row.name[0]}
          </div>
        ),
    },
    {
      key: "name",
      header: "Brand Name",
      sortable: true,
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "nameAr",
      header: "Name (AR)",
      render: (row) => <span dir="rtl">{row.nameAr ?? "—"}</span>,
    },
    {
      key: "website",
      header: "Website",
      render: (row) =>
        row.website ? (
          <a
            href={row.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <Globe className="h-3 w-3" />
            <span className="text-xs">Visit</span>
          </a>
        ) : (
          "—"
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
            <DropdownMenuItem onClick={() => router.push(`/brands/${row.id}/edit`)}>
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
        title="Brands"
        description="Manage product brands and manufacturers"
        createHref="/brands/new"
        createLabel="Add Brand"
      />

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        meta={data?.meta}
        params={params}
        onParamsChange={(updates) => setParams((prev) => ({ ...prev, ...updates }))}
        isLoading={isLoading}
        emptyMessage="No brands yet. Add your first brand."
      />

      <ConfirmModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Brand"
        description="Are you sure you want to delete this brand?"
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
