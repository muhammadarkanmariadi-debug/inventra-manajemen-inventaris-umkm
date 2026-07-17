

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, Supplier, CreateSupplierPayload } from "../types";

export async function getSuppliers(page = 1, items = 10): Promise<ApiResponse<PaginatedData<Supplier>>> {
  return apiGet("/suppliers", { page, items });
}

export async function getAllSuppliers(): Promise<ApiResponse<PaginatedData<Supplier>>> {
  return apiGet("/suppliers", { items: 100 });
}

export async function getSupplier(id: number): Promise<ApiResponse<Supplier>> {
  return apiGet(`/suppliers/${id}`);
}

export async function createSupplier(payload: CreateSupplierPayload): Promise<ApiResponse<Supplier>> {
  return apiPost("/suppliers", payload);
}

export async function updateSupplier(id: number, payload: Partial<CreateSupplierPayload>): Promise<ApiResponse<Supplier>> {
  return apiPut(`/suppliers/${id}`, payload);
}

export async function deleteSupplier(id: number): Promise<ApiResponse<null>> {
  return apiDelete(`/suppliers/${id}`);
}
