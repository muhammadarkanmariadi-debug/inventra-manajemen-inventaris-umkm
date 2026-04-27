"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const pathname = usePathname();

  const refreshProfile = async () => {

    setIsLoading(true);
    try {
      const response = await getProfile();
      if (response.status && response.data) {
        const fetchedRoles = response.data.roles || [];
        setUser(response.data.user);
        setBusiness(response.data.user.business || null);
        setRoles(fetchedRoles);
        setPermissions(response.data.permissions);

        const isSuperadmin = response.data.user.role === 'SUPERADMIN';


        if (isSuperadmin && pathname.startsWith('/dashboard')) {
          router.replace('/businesses');
        } else if (!isSuperadmin && pathname.startsWith('/businesses')) {
          router.replace('/dashboard');
        }

      } else {

        setUser(null);
        setBusiness(null);
        setRoles([]);
        setPermissions([]);
      }


      if (!response.status) {
        router.push("/auth/signin");
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setUser(null);
      setRoles([]);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    if (!pathname.startsWith("/auth")) {
      refreshProfile();
    } else {
      setIsLoading(false);
    }
  }, [pathname]);

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
