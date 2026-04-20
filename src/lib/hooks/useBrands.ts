import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandsApi } from "@/lib/api/brands";
import { TableQueryParams, CreateBrandInput, UpdateBrandInput } from "@/types";
import { toast } from "sonner";

export const BRANDS_KEY = "brands";

export function useBrands(params: TableQueryParams) {
  return useQuery({
    queryKey: [BRANDS_KEY, params],
    queryFn: () => brandsApi.getAll(params),
    placeholderData: (prev) => prev,
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: [BRANDS_KEY, id],
    queryFn: () => brandsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBrandInput) => brandsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BRANDS_KEY] });
      toast.success("Brand created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateBrand(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateBrandInput) => brandsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BRANDS_KEY] });
      toast.success("Brand updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => brandsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BRANDS_KEY] });
      toast.success("Brand deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
