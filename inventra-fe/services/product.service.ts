

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, Product, CreateProductPayload } from "../types";

export async function getProducts(page = 1, items = 10): Promise<ApiResponse<PaginatedData<Product>>> {
  return apiGet("/products", { page, items, include: "category,suppliers" });
}

export async function getProduct(id: number): Promise<ApiResponse<Product>> {
  return apiGet(`/products/${id}`);
}

export async function createProduct(payload: CreateProductPayload): Promise<ApiResponse<Product>> {
  return apiPost("/products", payload);
}

export async function updateProduct(id: number, payload: Partial<CreateProductPayload>): Promise<ApiResponse<Product>> {
  return apiPut(`/products/${id}`, payload);
}

export async function deleteProduct(id: number): Promise<ApiResponse<null>> {
  return apiDelete(`/products/${id}`);
}
