"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextField, SelectField } from "@/components/shared/FormField";
import { Loader2 } from "lucide-react";
import { Category, CreateCategoryInput } from "@/types";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
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

export function CategoryForm({ defaultValues, parentOptions = [], onSubmit, isLoading, onCancel }: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      nameAr: defaultValues?.nameAr ?? "",
      description: defaultValues?.description ?? "",
      parentId: defaultValues?.parentId ?? undefined,
      status: defaultValues?.status ?? "active",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField control={form.control} name="name" label="Category Name (EN)" placeholder="Electronics" required />
          <TextField control={form.control} name="nameAr" label="Category Name (AR)" placeholder="إلكترونيات" />
          <TextField control={form.control} name="description" label="Description" placeholder="Short description" />
          {parentOptions.length > 0 && (
            <SelectField
              control={form.control}
              name="parentId"
              label="Parent Category"
              placeholder="None (Top level)"
              options={[{ label: "None", value: "" }, ...parentOptions]}
            />
          )}
        </div>

        <SelectField
          control={form.control}
          name="status"
          label="Status"
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />

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
