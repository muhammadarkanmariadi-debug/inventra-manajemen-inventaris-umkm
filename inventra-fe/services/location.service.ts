"use server";

import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";

export async function getLocations(params?: { search?: string; page?: number; items?: number }) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.page) query.set("page", String(params.page));
  if (params?.items) query.set("items", String(params.items));
  const qs = query.toString();
  return apiGet(`/locations${qs ? `?${qs}` : ""}`);
}

export async function getLocation(id: number) {
  return apiGet(`/locations/${id}`);
}

export async function createLocation(name: string) {
  return apiPost("/locations", { name });
}

export async function updateLocation(id: number, name: string) {
  return apiPut(`/locations/${id}`, { name });
}

export async function deleteLocation(id: number) {
  return apiDelete(`/locations/${id}`);
}
