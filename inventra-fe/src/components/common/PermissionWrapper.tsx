"use client";

import { useAuth } from "@/context/AuthContext";
import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageBreadCrumb from "./PageBreadCrumb";

interface PermissionWrapperProps {
  permission: string;
  children: ReactNode;
  breadcrumb?: string;
}

/**
 * Wrapper component for pages to check for required permission.
 * Redirects or shows an error message if the user lacks the permission.
 */
export function PermissionWrapper({
  permission,
  children,
  breadcrumb,
}: PermissionWrapperProps) {
  const { hasPermission, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!hasPermission(permission)) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-10">
        {breadcrumb && <PageBreadCrumb pageTitle={breadcrumb} />}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 rounded-full bg-red-100 p-4 dark:bg-red-500/10">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m0 0v2m0-2h2m-2 0H10m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white/90">
            Akses Ditolak
          </h2>
          <p className="max-w-md text-gray-500 dark:text-gray-400">
            Anda tidak memiliki izin yang diperlukan untuk mengakses halaman ini ({permission}). 
            Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-8 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
