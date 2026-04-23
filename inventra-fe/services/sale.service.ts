"use server";

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, Sale, CreateSalePayload } from "../types";

export async function getSales(page = 1, items = 10, date_from?: string, date_to?: string): Promise<ApiResponse<PaginatedData<Sale>>> {
  const params: Record<string, any> = { page, items };
  if (date_from) params.date_from = date_from;
  if (date_to) params.date_to = date_to;
  return apiGet("/sales", params);
}

export async function getSale(id: number): Promise<ApiResponse<Sale>> {
  return apiGet(`/sales/${id}`);
}

export async function createSale(payload: CreateSalePayload): Promise<ApiResponse<Sale>> {
  return apiPost("/sales", payload);
}

export async function updateSale(id: number, payload: Partial<CreateSalePayload>): Promise<ApiResponse<Sale>> {
  return apiPut(`/sales/${id}`, payload);
}

export async function deleteSale(id: number): Promise<ApiResponse<null>> {
  return apiDelete(`/sales/${id}`);
}
