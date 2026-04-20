import apiClient from "./client";
import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  PaginatedResponse,
  TableQueryParams,
} from "@/types";

// ─── Raw API shapes ────────────────────────────────────────────────────────────

interface RawCategory {
  id: number;
  name: string;
  name_ar?: string;
  slug?: string;
  description?: string;
  description_ar?: string;
  image_url?: string;
  icon_url?: string;
  parent_id?: number | null;
  parent?: RawCategory | null;
  is_active: boolean;
  synonyms?: string[];
  sort_id?: number;
  created_at: string;
  updated_at: string;
}

interface RawListResponse {
  totalCount: number;
  totalPages: number;
  categories: RawCategory[];
}

interface RawSingleResponse {
  category: RawCategory;
}

interface RawMutationResponse {
  message?: string;
  category: RawCategory;
}

// ─── Normaliser (API → frontend) ──────────────────────────────────────────────

function normalizeCategory(raw: RawCategory): Category {
  return {
    id: String(raw.id),
    name: raw.name,
    nameAr: raw.name_ar,
    slug: raw.slug,
    description: raw.description,
    descriptionAr: raw.description_ar,
    image: raw.image_url,
    iconUrl: raw.icon_url,
    parentId: raw.parent_id != null ? String(raw.parent_id) : null,
    parent: raw.parent ? normalizeCategory(raw.parent) : null,
    status: raw.is_active ? "active" : "inactive",
    synonyms: raw.synonyms,
    sortId: raw.sort_id,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

// ─── API methods ──────────────────────────────────────────────────────────────

export const categoriesApi = {
  // FIX BUG-001: map { totalCount, totalPages, categories:[] } → PaginatedResponse
  getAll: async (params: TableQueryParams): Promise<PaginatedResponse<Category>> => {
    const { data } = await apiClient.get<RawListResponse>("/categories", { params });

    // Handle unexpected array shape (defensive)
    if (Array.isArray(data)) {
      const arr = data as unknown as RawCategory[];
      return {
        data: arr.map(normalizeCategory),
        meta: { page: 1, limit: params.limit, total: arr.length, totalPages: 1 },
      };
    }

    const list = data as RawListResponse;
    return {
      data: (list.categories ?? []).map(normalizeCategory),
      meta: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        total: list.totalCount ?? 0,
        totalPages: list.totalPages ?? 1,
      },
    };
  },

  // FIX BUG-002: map { category:{} } → Category
  getById: async (id: string): Promise<Category> => {
    const { data } = await apiClient.get<RawSingleResponse>(`/categories/${id}`);
    const raw = (data as RawSingleResponse).category ?? (data as unknown as RawCategory);
    return normalizeCategory(raw);
  },

  // FIX BUG-011: map { message, category:{} } → Category
  create: async (payload: CreateCategoryInput): Promise<Category> => {
    const { data } = await apiClient.post<RawMutationResponse>("/categories", payload);
    const raw = (data as RawMutationResponse).category ?? (data as unknown as RawCategory);
    return normalizeCategory(raw);
  },

  update: async (id: string, payload: UpdateCategoryInput): Promise<Category> => {
    const { data } = await apiClient.put<RawMutationResponse>(`/categories/${id}`, payload);
    const raw = (data as RawMutationResponse).category ?? (data as unknown as RawCategory);
    return normalizeCategory(raw);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
