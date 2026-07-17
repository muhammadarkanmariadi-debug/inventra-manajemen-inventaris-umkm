import { apiGet } from "../lib/api";
import type { ApiResponse, PaginatedData, Log } from "../types";

export async function getLogs(page = 1, items = 10): Promise<ApiResponse<PaginatedData<Log>>> {
  return apiGet("/logs", { page, items });
}
