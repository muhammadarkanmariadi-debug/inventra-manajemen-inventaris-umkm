"use server";

import { apiGet, apiPost, apiPut } from "../lib/api";

export async function getInventories(params?: { search?: string; status?: string; page?: number; items?: number; date_from?: string; date_to?: string }) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));
  if (params?.items) query.set("items", String(params.items));
  if (params?.date_from) query.set("date_from", params.date_from);
  if (params?.date_to) query.set("date_to", params.date_to);
  const qs = query.toString();
  return apiGet(`/inventories${qs ? `?${qs}` : ""}`);
}

export async function getInventory(id: number) {
  return apiGet(`/inventories/${id}`);
}

export async function scanInventory(inventory_code: string) {
  return apiPost("/scan", { inventory_code });
}

export async function updateInventoryStatus(id: number, new_status_code?: string, notes?: string, location_id?: number) {
  return apiPut(`/inventory/${id}/status`, { new_status_code, notes, location_id });
}

export async function processTransactions(payload: { 
  type: 'ADJUSTMENT_ADD' | 'ADJUSTMENT_SUB'; 
  items: { location_id? : number; product_id?: number; quantity: number }[]; 
  notes?: string 
}) {
  return apiPost("/transactions", payload);
}
