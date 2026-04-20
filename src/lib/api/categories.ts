import apiClient from "./client";
import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  PaginatedResponse,
  ApiResponse,
  TableQueryParams,
} from "@/types";

export const categoriesApi = {
  getAll: async (params: TableQueryParams): Promise<PaginatedResponse<Category>> => {
    const { data } = await apiClient.get("/categories", { params });
    if (Array.isArray(data)) {
      return { data, meta: { page: 1, limit: params.limit, total: data.length, totalPages: 1 } };
    }
    return data;
  },

  getById: async (id: string): Promise<Category> => {
    const { data } = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return (data as ApiResponse<Category>).data ?? (data as unknown as Category);
  },

  create: async (payload: CreateCategoryInput): Promise<Category> => {
    const { data } = await apiClient.post<ApiResponse<Category>>("/categories", payload);
    return (data as ApiResponse<Category>).data ?? (data as unknown as Category);
  },

  update: async (id: string, payload: UpdateCategoryInput): Promise<Category> => {
    const { data } = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, payload);
    return (data as ApiResponse<Category>).data ?? (data as unknown as Category);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
