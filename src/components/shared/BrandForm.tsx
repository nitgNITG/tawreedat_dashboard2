"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextField, SelectField } from "@/components/shared/FormField";
import { Loader2 } from "lucide-react";
import { Brand, CreateBrandInput } from "@/types";

const brandSchema = z.object({
  name: z.string().min(2, "Name is required"),
  nameAr: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandFormProps {
  defaultValues?: Partial<Brand>;
  onSubmit: (values: CreateBrandInput) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function BrandForm({ defaultValues, onSubmit, isLoading, onCancel }: BrandFormProps) {
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      nameAr: defaultValues?.nameAr ?? "",
      description: defaultValues?.description ?? "",
      website: defaultValues?.website ?? "",
      logo: defaultValues?.logo ?? "",
      status: defaultValues?.status ?? "active",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField control={form.control} name="name" label="Brand Name (EN)" placeholder="Samsung" required />
          <TextField control={form.control} name="nameAr" label="Brand Name (AR)" placeholder="سامسونج" />
          <TextField control={form.control} name="description" label="Description" placeholder="Brief description" />
          <TextField control={form.control} name="website" label="Website" type="url" placeholder="https://brand.com" />
          <TextField control={form.control} name="logo" label="Logo URL" type="url" placeholder="https://cdn.com/logo.png" />
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
            {defaultValues?.id ? "Update Brand" : "Create Brand"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
