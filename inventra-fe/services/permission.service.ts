"use server";

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, Permission, CreatePermissionPayload } from "../types";

export async function getPermissions(page = 1, items = 10): Promise<ApiResponse<PaginatedData<Permission>>> {
  return apiGet("/permissions", { page, items });
}

export async function getAllPermissions(): Promise<ApiResponse<Permission[]>> {
  return apiGet("/permissions");
}

export async function getPermission(id: number): Promise<ApiResponse<Permission>> {
  return apiGet(`/permissions/${id}`);
}

export async function createPermission(payload: CreatePermissionPayload): Promise<ApiResponse<Permission>> {
  return apiPost("/permissions", payload);
}

export async function updatePermission(id: number, payload: Partial<CreatePermissionPayload>): Promise<ApiResponse<Permission>> {
  return apiPut(`/permissions/${id}`, payload);
}

export async function deletePermission(id: number): Promise<ApiResponse<null>> {
  return apiDelete(`/permissions/${id}`);
}
