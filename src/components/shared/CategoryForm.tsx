"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextField, SelectField } from "@/components/shared/FormField";
import { Loader2 } from "lucide-react";
import { Category, CreateCategoryInput } from "@/types";

// FIX BUG-013: correct validation messages
// FIX BUG-015: trim whitespace-only names
const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .refine((v) => v.trim().length >= 2, "Name must be at least 2 characters"),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  parentId: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  iconUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  defaultValues?: Partial<Category>;
  parentOptions?: { label: string; value: string }[];
  onSubmit: (values: CreateCategoryInput) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function CategoryForm({
  defaultValues,
  parentOptions = [],
  onSubmit,
  isLoading,
  onCancel,
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      nameAr: defaultValues?.nameAr ?? "",
      description: defaultValues?.description ?? "",
      descriptionAr: defaultValues?.descriptionAr ?? "",
      parentId: defaultValues?.parentId ?? "",
      imageUrl: defaultValues?.image ?? "",
      iconUrl: defaultValues?.iconUrl ?? "",
      status: defaultValues?.status ?? "active",
    },
  });

  // FIX BUG-006: Map camelCase form values → snake_case API payload
  const handleSubmit = async (values: CategoryFormValues) => {
    const payload: CreateCategoryInput = {
      name: values.name.trim(),
      name_ar: values.nameAr?.trim() || undefined,
      description: values.description?.trim() || undefined,
      description_ar: values.descriptionAr?.trim() || undefined,
      parent_id: values.parentId ? Number(values.parentId) : null,
      image_url: values.imageUrl?.trim() || undefined,
      icon_url: values.iconUrl?.trim() || undefined,
      is_active: values.status === "active",
    };
    await onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Names */}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            control={form.control}
            name="name"
            label="Category Name (EN)"
            placeholder="Electronics"
            required
          />
          <TextField
            control={form.control}
            name="nameAr"
            label="Category Name (AR)"
            placeholder="إلكترونيات"
          />
        </div>

        {/* Descriptions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            control={form.control}
            name="description"
            label="Description (EN)"
            placeholder="Short description"
          />
          <TextField
            control={form.control}
            name="descriptionAr"
            label="Description (AR)"
            placeholder="وصف قصير"
          />
        </div>

        {/* Parent + Status */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* FIX BUG-016: always render parent dropdown, not only when options exist */}
          <SelectField
            control={form.control}
            name="parentId"
            label="Parent Category"
            placeholder="None (Top level)"
            options={[{ label: "None (Top level)", value: "" }, ...parentOptions]}
          />
          <SelectField
            control={form.control}
            name="status"
            label="Status"
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </div>

        {/* FIX BUG-010 + BUG-017: Image and Icon URL fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            control={form.control}
            name="imageUrl"
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            type="url"
          />
          <TextField
            control={form.control}
            name="iconUrl"
            label="Icon URL"
            placeholder="https://example.com/icon.svg"
            type="url"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {defaultValues?.id ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
