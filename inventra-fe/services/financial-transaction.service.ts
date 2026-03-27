"use server";

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, FinancialTransaction, CreateFinancialTransactionPayload } from "../types";

export async function getFinancialTransactions(page = 1, items = 10): Promise<ApiResponse<PaginatedData<FinancialTransaction>>> {
  return apiGet("/financial-transactions", { page, items });
}

export async function getFinancialTransaction(id: number): Promise<ApiResponse<FinancialTransaction>> {
  return apiGet(`/financial-transactions/${id}`);
}

export async function createFinancialTransaction(payload: CreateFinancialTransactionPayload): Promise<ApiResponse<FinancialTransaction>> {
  return apiPost("/financial-transactions", payload);
}

export async function updateFinancialTransaction(id: number, payload: Partial<CreateFinancialTransactionPayload>): Promise<ApiResponse<FinancialTransaction>> {
  return apiPut(`/financial-transactions/${id}`, payload);
}

export async function deleteFinancialTransaction(id: number): Promise<ApiResponse<null>> {
  return apiDelete(`/financial-transactions/${id}`);
}
