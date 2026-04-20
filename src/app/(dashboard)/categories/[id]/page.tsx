"use client";

import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ErrorState } from "@/components/shared/ErrorState";
import { useCategory } from "@/lib/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowLeft, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-border last:border-0">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export default function CategoryDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: category, isLoading, error, refetch } = useCategory(id);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !category) {
    return <ErrorState message="Category not found" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={category.name}
        description={category.slug ? `Slug: ${category.slug}` : "Category details"}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/categories")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button size="sm" onClick={() => router.push(`/categories/${id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold mb-4">Basic Information</h2>
          <div>
            <DetailRow label="Name (EN)" value={category.name} />
            <DetailRow label="Name (AR)" value={category.nameAr ? <span dir="rtl">{category.nameAr}</span> : undefined} />
            <DetailRow label="Slug" value={category.slug} />
            <DetailRow label="Status" value={<StatusBadge status={category.status} />} />
            <DetailRow label="Parent Category" value={category.parent?.name} />
            <DetailRow label="Sort Order" value={category.sortId != null ? String(category.sortId) : undefined} />
          </div>
        </Card>

        {/* Descriptions */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold mb-4">Descriptions</h2>
          <div>
            <DetailRow label="Description (EN)" value={category.description} />
            <DetailRow label="Description (AR)" value={category.descriptionAr ? <span dir="rtl">{category.descriptionAr}</span> : undefined} />
            {category.synonyms && category.synonyms.length > 0 && (
              <DetailRow
                label="Synonyms"
                value={
                  <div className="flex flex-wrap gap-1">
                    {category.synonyms.map((s, i) => (
                      <span key={i} className="rounded bg-muted px-2 py-0.5 text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                }
              />
            )}
          </div>
        </Card>

        {/* Media */}
        {(category.image || category.iconUrl) && (
          <Card className="p-6">
            <h2 className="text-sm font-semibold mb-4">Media</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {category.image && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Image</p>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-32 w-full rounded-md object-cover border"
                  />
                  <a
                    href={category.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open URL
                  </a>
                </div>
              )}
              {category.iconUrl && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Icon</p>
                  <img
                    src={category.iconUrl}
                    alt={`${category.name} icon`}
                    className="h-32 w-full rounded-md object-contain border bg-muted/30"
                  />
                  <a
                    href={category.iconUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open URL
                  </a>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Timestamps */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold mb-4">Timestamps</h2>
          <div>
            <DetailRow
              label="Created At"
              value={(() => {
                try { return format(new Date(category.createdAt), "PPP p"); } catch { return category.createdAt; }
              })()}
            />
            <DetailRow
              label="Updated At"
              value={(() => {
                try { return format(new Date(category.updatedAt), "PPP p"); } catch { return category.updatedAt; }
              })()}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
