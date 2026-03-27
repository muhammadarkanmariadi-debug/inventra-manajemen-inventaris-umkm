"use server";

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, Role, CreateRolePayload, Permission } from "../types";

export async function getRoles(page = 1, items = 10): Promise<ApiResponse<PaginatedData<Role>>> {
  return apiGet("/roles", { page, items });
}

export async function getAllRoles(): Promise<ApiResponse<PaginatedData<Role>>> {
  return apiGet("/roles", { items: 100 });
}

export async function getRole(id: number): Promise<ApiResponse<Role>> {
  return apiGet(`/roles/${id}`);
}

export async function createRole(payload: CreateRolePayload): Promise<ApiResponse<Role>> {
  return apiPost("/roles", payload);
}

export async function updateRole(id: number, payload: Partial<CreateRolePayload>): Promise<ApiResponse<Role>> {
  return apiPut(`/roles/${id}`, payload);
}

export async function deleteRole(id: number): Promise<ApiResponse<null>> {
  return apiDelete(`/roles/${id}`);
}

export async function getPermissions(): Promise<ApiResponse<Permission[]>> {
  return apiGet("/permissions");
}