import { API_URL } from "../global"
import { encryptClient, get, post } from "../lib/action"
import { apiDelete, apiGet, apiPost, apiPut } from "../lib/api";
import { getCookies } from "../lib/server-cookie"
import { ApiResponse, Business, PaginatedData, User } from "../types";

interface CreateBusinessPayload {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    description?: string;
}

export async function createBusiness(payload: CreateBusinessPayload): Promise<ApiResponse<Business>> {

    return apiPost('/bussiness', payload)
}


export async function getBusinesses(page = 1, items = 10): Promise<ApiResponse<PaginatedData<Business>>> {
    return apiGet(`/superadmin/businesses`, { page, items });
}

export async function getBusiness(id: number): Promise<ApiResponse<Business>> {
    return apiGet(`/superadmin/businesses/${id}`);
}

export async function updateAdminBusiness(id: number, payload: Partial<Business>): Promise<ApiResponse<Business>> {
    return apiPut(`/superadmin/businesses/${id}`, payload);
}

export async function deleteAdminBusiness(id: number): Promise<ApiResponse<null>> {
    return apiDelete(`/superadmin/businesses/${id}`);
}


