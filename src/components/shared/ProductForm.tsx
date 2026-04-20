"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextField, SelectField } from "@/components/shared/FormField";
import { Loader2 } from "lucide-react";
import { Product, CreateProductInput, Category, Brand, Supplier } from "@/types";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  nameAr: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  cost: z.string().optional(),
  quantity: z.string().optional(),
  unit: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  supplierId: z.string().optional(),
  status: z.enum(["active", "inactive", "draft"]),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<Product>;
  categories?: Category[];
  brands?: Brand[];
  suppliers?: Supplier[];
  onSubmit: (values: CreateProductInput) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ProductForm({
  defaultValues,
  categories = [],
  brands = [],
  suppliers = [],
  onSubmit,
  isLoading,
  onCancel,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      nameAr: defaultValues?.nameAr ?? "",
      sku: defaultValues?.sku ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price != null ? String(defaultValues.price) : "",
      cost: defaultValues?.cost != null ? String(defaultValues.cost) : "",
      quantity: defaultValues?.quantity != null ? String(defaultValues.quantity) : "",
      unit: defaultValues?.unit ?? "",
      categoryId: defaultValues?.categoryId ?? undefined,
      brandId: defaultValues?.brandId ?? undefined,
      supplierId: defaultValues?.supplierId ?? undefined,
      status: defaultValues?.status ?? "active",
    },
  });

  const handleSubmit = (values: ProductFormValues) => {
    return onSubmit({
      ...values,
      price: parseFloat(values.price) || 0,
      cost: values.cost ? parseFloat(values.cost) : undefined,
      quantity: values.quantity ? parseInt(values.quantity, 10) : undefined,
    });
  };

  const categoryOptions = categories.map((c) => ({ label: c.name, value: c.id }));
  const brandOptions = brands.map((b) => ({ label: b.name, value: b.id }));
  const supplierOptions = suppliers.map((s) => ({ label: s.name, value: s.id }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Basic Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField control={form.control} name="name" label="Product Name (EN)" placeholder="iPhone 15 Pro" required />
            <TextField control={form.control} name="nameAr" label="Product Name (AR)" placeholder="آيفون 15 برو" />
            <TextField control={form.control} name="sku" label="SKU" placeholder="IPH-15-PRO-128" />
            <TextField control={form.control} name="unit" label="Unit" placeholder="pcs, kg, box..." />
          </div>
          <div className="mt-4">
            <TextField control={form.control} name="description" label="Description" placeholder="Product description..." />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Pricing & Inventory
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField control={form.control} name="price" label="Selling Price" type="number" placeholder="0.00" required />
            <TextField control={form.control} name="cost" label="Cost Price" type="number" placeholder="0.00" />
            <TextField control={form.control} name="quantity" label="Quantity in Stock" type="number" placeholder="0" />
          </div>
        </div>

        {/* Relations */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Relations
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {categoryOptions.length > 0 && (
              <SelectField
                control={form.control}
                name="categoryId"
                label="Category"
                placeholder="Select category"
                options={categoryOptions}
              />
            )}
            {brandOptions.length > 0 && (
              <SelectField
                control={form.control}
                name="brandId"
                label="Brand"
                placeholder="Select brand"
                options={brandOptions}
              />
            )}
            {supplierOptions.length > 0 && (
              <SelectField
                control={form.control}
                name="supplierId"
                label="Supplier"
                placeholder="Select supplier"
                options={supplierOptions}
              />
            )}
          </div>
        </div>

        <SelectField
          control={form.control}
          name="status"
          label="Status"
          options={[
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
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
            {defaultValues?.id ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
