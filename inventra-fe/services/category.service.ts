

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, Category, CreateCategoryPayload } from "../types";

export async function getCategories(page = 1, items = 10): Promise<ApiResponse<PaginatedData<Category>>> {
  return apiGet("/categories", { page, items });
}

export async function getAllCategories(): Promise<ApiResponse<PaginatedData<Category>>> {
  return apiGet("/categories", { items: 100 });
}

export async function getCategory(id: number): Promise<ApiResponse<Category>> {
  return apiGet(`/categories/${id}`);
}

export async function createCategory(payload: CreateCategoryPayload): Promise<ApiResponse<Category>> {
  return apiPost("/categories", payload);
}

export async function updateCategory(id: number, payload: Partial<CreateCategoryPayload>): Promise<ApiResponse<Category>> {
  return apiPut(`/categories/${id}`, payload);
}

export async function deleteCategory(id: number): Promise<ApiResponse<null>> {
  return apiDelete(`/categories/${id}`);
}
