import apiClient from "./client";
import {
  Supplier,
  CreateSupplierInput,
  UpdateSupplierInput,
  PaginatedResponse,
  ApiResponse,
  TableQueryParams,
} from "@/types";

export const suppliersApi = {
  getAll: async (params: TableQueryParams): Promise<PaginatedResponse<Supplier>> => {
    const { data } = await apiClient.get("/suppliers", { params });
    // Normalize in case API returns flat array
    if (Array.isArray(data)) {
      return { data, meta: { page: 1, limit: params.limit, total: data.length, totalPages: 1 } };
    }
    return data;
  },

  getById: async (id: string): Promise<Supplier> => {
    const { data } = await apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
    return (data as ApiResponse<Supplier>).data ?? (data as unknown as Supplier);
  },

  create: async (payload: CreateSupplierInput): Promise<Supplier> => {
    const { data } = await apiClient.post<ApiResponse<Supplier>>("/suppliers", payload);
    return (data as ApiResponse<Supplier>).data ?? (data as unknown as Supplier);
  },

  update: async (id: string, payload: UpdateSupplierInput): Promise<Supplier> => {
    const { data } = await apiClient.put<ApiResponse<Supplier>>(`/suppliers/${id}`, payload);
    return (data as ApiResponse<Supplier>).data ?? (data as unknown as Supplier);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/suppliers/${id}`);
  },
};
