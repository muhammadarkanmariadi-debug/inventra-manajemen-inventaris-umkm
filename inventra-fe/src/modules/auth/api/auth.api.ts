import { API_URL } from "../../../../global";

/**
 * Mengarahkan browser pengguna langsung ke endpoint redirect Socialite backend.
 */
export function redirectToGoogleLogin() {
  if (typeof window !== "undefined") {
    window.location.href = `${API_URL}/auth/google/redirect`;
  }
}
