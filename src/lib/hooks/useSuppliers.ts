import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { suppliersApi } from "@/lib/api/suppliers";
import { TableQueryParams, CreateSupplierInput, UpdateSupplierInput } from "@/types";
import { toast } from "sonner";

export const SUPPLIERS_KEY = "suppliers";

export function useSuppliers(params: TableQueryParams) {
  return useQuery({
    queryKey: [SUPPLIERS_KEY, params],
    queryFn: () => suppliersApi.getAll(params),
    placeholderData: (prev) => prev,
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: [SUPPLIERS_KEY, id],
    queryFn: () => suppliersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSupplierInput) => suppliersApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SUPPLIERS_KEY] });
      toast.success("Supplier created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateSupplier(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSupplierInput) => suppliersApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SUPPLIERS_KEY] });
      toast.success("Supplier updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteSupplier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suppliersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SUPPLIERS_KEY] });
      toast.success("Supplier deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
