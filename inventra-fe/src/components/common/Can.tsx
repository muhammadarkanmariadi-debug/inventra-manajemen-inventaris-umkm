"use client";

import { useAuth } from "@/context/AuthContext";
import React, { ReactNode } from "react";

interface CanProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component to conditionally render children based on user permissions.
 */
export function Can({ permission, children, fallback = null }: CanProps) {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
