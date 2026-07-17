

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, StockTransaction, CreateStockTransactionPayload } from "../types";

export async function getStockTransactions(page = 1, items = 10, date_from?: string, date_to?: string): Promise<ApiResponse<PaginatedData<StockTransaction>>> {
  const params: Record<string, any> = { page, items };
  if (date_from) params.date_from = date_from;
  if (date_to) params.date_to = date_to;
  return apiGet("/stock-transactions", params);
}

export async function getStockTransaction(id: number): Promise<ApiResponse<StockTransaction>> {
  return apiGet(`/stock-transactions/${id}`);
}

export async function createStockTransaction(payload: CreateStockTransactionPayload): Promise<ApiResponse<null>> {
  return apiPost("/stock-transactions", payload);
}

export async function updateStockTransaction(id: number, payload: CreateStockTransactionPayload): Promise<ApiResponse<null>> {
  return apiPut(`/stock-transactions/${id}`, payload);
}

export async function deleteStockTransaction(id: number): Promise<ApiResponse<null>> {
  return apiDelete(`/stock-transactions/${id}`);
}
