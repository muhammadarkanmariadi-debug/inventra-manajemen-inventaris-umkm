"use server";

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, FinancialCategory, CreateFinancialCategoryPayload } from "../types";

export async function getFinancialCategories(page = 1, items = 10): Promise<ApiResponse<PaginatedData<FinancialCategory>>> {
  return apiGet("/financial-categories", { page, items });
}

export async function getAllFinancialCategories(): Promise<ApiResponse<PaginatedData<FinancialCategory>>> {
  return apiGet("/financial-categories", { items: 100 });
}

export async function getFinancialCategory(id: number): Promise<ApiResponse<FinancialCategory>> {
  return apiGet(`/financial-categories/${id}`);
}

export async function createFinancialCategory(payload: CreateFinancialCategoryPayload): Promise<ApiResponse<FinancialCategory>> {
  return apiPost("/financial-categories", payload);
}

export async function updateFinancialCategory(id: number, payload: Partial<CreateFinancialCategoryPayload>): Promise<ApiResponse<FinancialCategory>> {
  return apiPut(`/financial-categories/${id}`, payload);
}

export async function deleteFinancialCategory(id: number): Promise<ApiResponse<null>> {
  return apiDelete(`/financial-categories/${id}`);
}
