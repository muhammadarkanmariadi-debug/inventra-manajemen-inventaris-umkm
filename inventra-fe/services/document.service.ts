"use server";

import { API_URL } from "../global";
import { getCookies } from "../lib/server-cookie";
import type { ApiResponse, PaginatedData } from "../types";

export interface DocumentRecord {
  id: number;
  document_number: string;
  type: string;
  title: string;
  file_path: string;
  generated_by: number;
  bussiness_id: number;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  generated_by_user?: {
    id: number;
    username: string;
  };
}

export async function getDocuments(
  page = 1,
  items = 10,
  type?: string
): Promise<ApiResponse<PaginatedData<DocumentRecord>>> {
  const token = await getCookies("token");
  let url = `${API_URL}/documents?page=${page}&items=${items}`;
  if (type) url += `&type=${type}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return res.json();
}

export async function getDocument(id: number): Promise<ApiResponse<DocumentRecord>> {
  const token = await getCookies("token");
  const res = await fetch(`${API_URL}/documents/${id}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return res.json();
}

export async function uploadDocument(formData: FormData): Promise<ApiResponse<DocumentRecord>> {
  const token = await getCookies("token");
  const res = await fetch(`${API_URL}/documents`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  return res.json();
}

export async function deleteDocument(id: number): Promise<ApiResponse<null>> {
  const token = await getCookies("token");
  const res = await fetch(`${API_URL}/documents/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return res.json();
}

export async function getDocumentDownloadUrl(id: number): Promise<string> {
  return await `${API_URL}/documents/${id}/download`;
}

export async function downloadDocument(id: number): Promise<Blob> {
  const token = await getCookies("token");
  const res = await fetch(`${API_URL}/documents/${id}/download`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    throw new Error("Download failed");
  }

  return res.blob();
}
