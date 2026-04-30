

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import type { ApiResponse, PaginatedData, User, CreateUserPayload, Business } from "../types";

export async function getUsersByBusiness(page = 1, items = 10): Promise<ApiResponse<PaginatedData<User>>> {
  return apiGet("/user", { page, items });
}

export async function getUser(id: number): Promise<ApiResponse<User>> {
  return apiGet(`/user/${id}`);
}

export async function createUser(payload: CreateUserPayload): Promise<ApiResponse<User>> {
  return apiPost("/user", payload);
}

export async function updateUser(id: number, payload: Partial<CreateUserPayload>): Promise<ApiResponse<User>> {
  return apiPut(`/user/${id}`, payload);
}

export async function deleteUser(id: number): Promise<ApiResponse<null>> {
  return apiDelete(`/user/${id}`);
}

// ========== SUPERADMIN USER ROUTES ==========

export async function getAllUsers(page = 1, items = 10): Promise<ApiResponse<PaginatedData<User>>> {
  return apiGet("/superadmin/users", { page, items });
}

export async function getAdminUser(id: number): Promise<ApiResponse<User>> {
  return apiGet(`/superadmin/users/${id}`);
}

export async function updateAdminUser(id: number, payload: Partial<CreateUserPayload>): Promise<ApiResponse<User>> {
  return apiPut(`/superadmin/users/${id}`, payload);
}

export async function deleteAdminUser(id: number): Promise<ApiResponse<null>> {
  return apiDelete(`/superadmin/users/${id}`);
}

export async function getProfile(): Promise<ApiResponse<{ user: User, roles: string[], permissions: string[] }>> {
  return apiGet("/profile");
}

export async function updateProfile(payload: Partial<User>): Promise<ApiResponse<User>> {
  return apiPut("/update-profile", payload);
}

export async function updateBusiness(id: number, payload: Partial<Business>): Promise<ApiResponse<Business>> {
  return apiPut(`/bussiness/${id}`, payload);
}
