"use server";

import { apiGet, apiPost } from "../lib/api";
import type { ApiResponse, PaginatedData, Purchase, CreatePurchasePayload } from "../types";

export async function getPurchases(page = 1, items = 10): Promise<ApiResponse<PaginatedData<Purchase>>> {
  return apiGet("/purchases", { page, items });
}

export async function getPurchase(id: number): Promise<ApiResponse<Purchase>> {
  return apiGet(`/purchases/${id}`);
}

export async function createPurchase(payload: CreatePurchasePayload): Promise<ApiResponse<Purchase>> {
  return apiPost("/purchases", payload);
}
