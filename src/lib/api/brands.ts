import apiClient from "./client";
import {
  Brand,
  CreateBrandInput,
  UpdateBrandInput,
  PaginatedResponse,
  ApiResponse,
  TableQueryParams,
} from "@/types";

export const brandsApi = {
  getAll: async (params: TableQueryParams): Promise<PaginatedResponse<Brand>> => {
    const { data } = await apiClient.get("/brands", { params });
    if (Array.isArray(data)) {
      return { data, meta: { page: 1, limit: params.limit, total: data.length, totalPages: 1 } };
    }
    return data;
  },

  getById: async (id: string): Promise<Brand> => {
    const { data } = await apiClient.get<ApiResponse<Brand>>(`/brands/${id}`);
    return (data as ApiResponse<Brand>).data ?? (data as unknown as Brand);
  },

  create: async (payload: CreateBrandInput): Promise<Brand> => {
    const { data } = await apiClient.post<ApiResponse<Brand>>("/brands", payload);
    return (data as ApiResponse<Brand>).data ?? (data as unknown as Brand);
  },

  update: async (id: string, payload: UpdateBrandInput): Promise<Brand> => {
    const { data } = await apiClient.put<ApiResponse<Brand>>(`/brands/${id}`, payload);
    return (data as ApiResponse<Brand>).data ?? (data as unknown as Brand);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/brands/${id}`);
  },
};
