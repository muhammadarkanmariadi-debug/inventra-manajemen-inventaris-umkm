"use server";

import { apiGet, apiPost } from "../lib/api";


export async function getStatisticSales(startDate?: string, endDate?: string) {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  return apiGet("/statistic/sales", params);
}

export async function getStatisticProducts() {
  return apiGet("/statistic/products");
}

export async function getStatisticFinancial(startDate?: string, endDate?: string) {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  return apiGet("/statistic/financial", params);
}

// ===== Gemini AI Endpoints =====
export async function analyzeInventory() {
  return apiGet("/gemini/inventory");
}

export async function analyzeSales() {
  return apiGet("/gemini/sales");
}

export async function analyzeFinancial() {
  return apiGet("/gemini/financial");
}

export async function askGemini(question: string) {
  return apiPost("/gemini/ask", { question });
}
