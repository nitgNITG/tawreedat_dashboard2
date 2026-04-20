import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/categories";
import { TableQueryParams, CreateCategoryInput, UpdateCategoryInput } from "@/types";
import { toast } from "sonner";

export const CATEGORIES_KEY = "categories";

export function useCategories(params: TableQueryParams) {
  return useQuery({
    queryKey: [CATEGORIES_KEY, params],
    queryFn: () => categoriesApi.getAll(params),
    placeholderData: (prev) => prev,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: [CATEGORIES_KEY, id],
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryInput) => categoriesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Category created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCategoryInput) => categoriesApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Category updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Category deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
