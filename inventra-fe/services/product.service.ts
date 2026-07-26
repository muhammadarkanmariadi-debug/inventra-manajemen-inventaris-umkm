

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, Product, CreateProductPayload } from "../types";

export interface ProductQueryParams {
  page?: number;
  items?: number;
  include?: string;
  search?: string;
  category_id?: string | number;
  product_type?: string;
  stock_status?: string;
  sort?: string;
  order?: string;
  [key: string]: any;
}

export async function getProducts(page = 1, items = 10, extraParams: ProductQueryParams = {}): Promise<ApiResponse<PaginatedData<Product>>> {
  const params: Record<string, any> = { page, items, include: "category,suppliers", ...extraParams };
  Object.keys(params).forEach((k) => {
    if (params[k] === "" || params[k] === undefined || params[k] === null) delete params[k];
  });
  return apiGet("/products", params);
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
