"use server";

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, StockTransaction, CreateStockTransactionPayload } from "../types";

export async function getStockTransactions(page = 1, items = 10): Promise<ApiResponse<PaginatedData<StockTransaction>>> {
  return apiGet("/stock-transactions", { page, items });
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
