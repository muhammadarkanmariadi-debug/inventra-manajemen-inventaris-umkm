export const API_URL = typeof window === "undefined" ? "http://backend:8000/api" : process.env.NEXT_PUBLIC_BASE_API_URL;


export const ENCRYPT_SECRET = process.env.NEXT_PUBLIC_ENCRYPT_SECRET || "";