"use server";

import { toast } from "sonner";
import { API_URL } from "../global";
import { getCookies } from "./server-cookie";
import { redirect } from "next/navigation";

export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<any> {


  try {
    const token = await getCookies("token");

    const res = await fetch(url, {
      cache: "no-store",
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
      },
    });



      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        return {
          status: false,
          message: `Server error ${res.status}`,
          data: null,
        };
      }

      if (!res.ok) {
        const data = await res.json();
        return {
          status: false,
          message: data?.message || `HTTP ${res.status}`,
          data: null,
        };
      }

    
      return await res.json();
    
  } catch (error) {

    if (error instanceof Error) {

      throw error;

    }


    return {
      status: false,
      message: "Terjadi kesalahan koneksi",
      data: null,
    };
  }


}

export async function apiGet(
  endpoint: string,
  params?: Record<string, string | number>
) {
  let url = `${API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  return authFetch(url);
}

export async function apiPost(endpoint: string, payload: any) {
  return authFetch(`${API_URL}${endpoint}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

}

export async function apiPut(endpoint: string, payload: any) {
  return authFetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function apiDelete(endpoint: string) {
  return authFetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
  });
}