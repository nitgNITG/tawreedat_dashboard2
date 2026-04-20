// ─── Shared ───────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

// ─── Supplier ─────────────────────────────────────────────────────────────────

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  contactPerson?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierInput {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  contactPerson?: string;
  status?: "active" | "inactive";
}

export type UpdateSupplierInput = Partial<CreateSupplierInput>;

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  parent?: Category | null;
  image?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  nameAr?: string;
  description?: string;
  parentId?: string | null;
  image?: string;
  status?: "active" | "inactive";
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

// ─── Brand ────────────────────────────────────────────────────────────────────

export interface Brand {
  id: string;
  name: string;
  nameAr?: string;
  logo?: string;
  description?: string;
  website?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandInput {
  name: string;
  nameAr?: string;
  logo?: string;
  description?: string;
  website?: string;
  status?: "active" | "inactive";
}

export type UpdateBrandInput = Partial<CreateBrandInput>;

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  sku?: string;
  description?: string;
  price: number;
  cost?: number;
  quantity?: number;
  unit?: string;
  categoryId?: string;
  category?: Category;
  brandId?: string;
  brand?: Brand;
  supplierId?: string;
  supplier?: Supplier;
  images?: string[];
  status: "active" | "inactive" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  nameAr?: string;
  sku?: string;
  description?: string;
  price: number;
  cost?: number;
  quantity?: number;
  unit?: string;
  categoryId?: string;
  brandId?: string;
  supplierId?: string;
  images?: string[];
  status?: "active" | "inactive" | "draft";
}

export type UpdateProductInput = Partial<CreateProductInput>;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Table ────────────────────────────────────────────────────────────────────

export interface TableQueryParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | number | undefined;
}
