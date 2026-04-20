import apiClient from "./client";
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  PaginatedResponse,
  ApiResponse,
  TableQueryParams,
} from "@/types";

export const productsApi = {
  getAll: async (params: TableQueryParams): Promise<PaginatedResponse<Product>> => {
    const { data } = await apiClient.get("/products", { params });
    if (Array.isArray(data)) {
      return { data, meta: { page: 1, limit: params.limit, total: data.length, totalPages: 1 } };
    }
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return (data as ApiResponse<Product>).data ?? (data as unknown as Product);
  },

  create: async (payload: CreateProductInput): Promise<Product> => {
    const { data } = await apiClient.post<ApiResponse<Product>>("/products", payload);
    return (data as ApiResponse<Product>).data ?? (data as unknown as Product);
  },

  update: async (id: string, payload: UpdateProductInput): Promise<Product> => {
    const { data } = await apiClient.put<ApiResponse<Product>>(`/products/${id}`, payload);
    return (data as ApiResponse<Product>).data ?? (data as unknown as Product);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
