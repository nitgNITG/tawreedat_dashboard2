"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextField, SelectField } from "@/components/shared/FormField";
import { Loader2 } from "lucide-react";
import { Supplier, CreateSupplierInput } from "@/types";

const supplierSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  contactPerson: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  defaultValues?: Partial<Supplier>;
  onSubmit: (values: CreateSupplierInput) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function SupplierForm({ defaultValues, onSubmit, isLoading, onCancel }: SupplierFormProps) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      address: defaultValues?.address ?? "",
      city: defaultValues?.city ?? "",
      country: defaultValues?.country ?? "",
      contactPerson: defaultValues?.contactPerson ?? "",
      status: defaultValues?.status ?? "active",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField control={form.control} name="name" label="Supplier Name" placeholder="e.g. ACME Corp" required />
          <TextField control={form.control} name="email" label="Email" type="email" placeholder="contact@supplier.com" required />
          <TextField control={form.control} name="phone" label="Phone" placeholder="+1 234 567 8900" required />
          <TextField control={form.control} name="contactPerson" label="Contact Person" placeholder="John Doe" />
          <TextField control={form.control} name="city" label="City" placeholder="Cairo" />
          <TextField control={form.control} name="country" label="Country" placeholder="Egypt" />
        </div>

        <TextField control={form.control} name="address" label="Address" placeholder="123 Main St, District" />

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
            {defaultValues?.id ? "Update Supplier" : "Create Supplier"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
