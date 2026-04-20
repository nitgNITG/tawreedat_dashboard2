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

/** Normalised frontend shape — all camelCase, id coerced to string */
export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug?: string;
  description?: string;
  descriptionAr?: string;
  parentId?: string | null;
  parent?: Category | null;
  image?: string;   // mapped from image_url
  iconUrl?: string; // mapped from icon_url
  synonyms?: string[];
  sortId?: number;
  status: "active" | "inactive"; // mapped from is_active (boolean)
  createdAt: string;
  updatedAt: string;
}

/** Payload sent to the API — snake_case to match backend */
export interface CreateCategoryInput {
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  parent_id?: number | null;
  image_url?: string;
  icon_url?: string;
  synonyms?: string[];
  is_active?: boolean;
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
