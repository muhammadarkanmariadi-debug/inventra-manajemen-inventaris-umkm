

import { apiGet, apiPost } from "../lib/api";
import type { ApiResponse, PaginatedData, Purchase, CreatePurchasePayload } from "../types";

export async function getPurchases(page = 1, items = 10, extraParams: Record<string, any> = {}): Promise<ApiResponse<PaginatedData<Purchase>>> {
  const params: Record<string, any> = { page, items, ...extraParams };
  Object.keys(params).forEach((k) => {
    if (params[k] === "" || params[k] === undefined || params[k] === null) delete params[k];
  });
  return apiGet("/purchases", params);
}

export async function getPurchase(id: number): Promise<ApiResponse<Purchase>> {
  return apiGet(`/purchases/${id}`);
}

export async function createPurchase(payload: CreatePurchasePayload): Promise<ApiResponse<Purchase>> {
  return apiPost("/purchases", payload);
}
