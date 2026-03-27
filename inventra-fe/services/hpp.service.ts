"use server";

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, HppComponent, CreateHppComponentPayload } from "../types";

export async function getHppComponents(page = 1, items = 10, productId?: number): Promise<ApiResponse<PaginatedData<HppComponent>>> {
  const params: any = { page, items };
  if (productId) params.product_id = productId;
  return apiGet("/hpp-components", params);
}

export async function getHppComponent(id: number): Promise<ApiResponse<HppComponent>> {
  return apiGet(`/hpp-components/${id}`);
}

export async function createHppComponent(payload: CreateHppComponentPayload): Promise<ApiResponse<HppComponent>> {
  return apiPost("/hpp-components", payload);
}

export async function updateHppComponent(id: number, payload: Partial<CreateHppComponentPayload>): Promise<ApiResponse<HppComponent>> {
  return apiPut(`/hpp-components/${id}`, payload);
}

export async function deleteHppComponent(id: number): Promise<ApiResponse<null>> {
  return apiDelete(`/hpp-components/${id}`);
}
