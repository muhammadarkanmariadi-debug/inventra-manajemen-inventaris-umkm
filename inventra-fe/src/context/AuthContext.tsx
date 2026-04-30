"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { getProfile } from "../../services/user.service";
import { User, Business } from "../../types";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  business: Business | null;
  roles: string[];
  permissions: string[];
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Daftar halaman yang bisa diakses tanpa login
const PUBLIC_ROUTES = ["/", "/about", "/contact"]; 

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(() => {
    setUser(null);
    setBusiness(null);
    setRoles([]);
    setPermissions([]);
    // Hanya redirect ke signin jika bukan di halaman publik
    if (!PUBLIC_ROUTES.includes(pathname)) {
      router.push("/auth/signin");
    }
  }, [pathname, router]);

  const refreshProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProfile();

      if (response.status && response.data) {
        setUser(response.data.user);
        setBusiness(response.data.user.business || null);
        setRoles(response.data.roles || []);
        setPermissions(response.data.permissions || []);
      } else {
        // Token expired atau invalid
        logout();
        if (!PUBLIC_ROUTES.includes(pathname)) {
          toast.error(response.message || "Sesi telah berakhir");
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [pathname, logout]);

  useEffect(() => {
    // 1. Abaikan jika sedang di halaman auth (login/register)
    if (pathname.startsWith("/auth")) {
      setIsLoading(false);
      return;
    }

    // 2. Jalankan refresh profile
    refreshProfile();
  }, [pathname, refreshProfile]);

  const hasPermission = (permission: string) => {
    if (user?.role === 'SUPERADMIN') return true;
    if (roles.includes("OWNER")) return true;
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        roles,
        permissions,
        isLoading,
        refreshProfile,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
