"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";
import AdminLayout from "@/components/layouts/AdminLayout";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { toast } from "sonner";
import { Metadata } from "next";
import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import { useTranslate } from "@/hooks/useTranslate";

function AdminRouteGuardInner({ children }: { children: React.ReactNode }) {
  const { isSuperAdmin, isLoading } = usePermission();
  const router = useRouter();
  const { _ } = useTranslate();

  useEffect(() => {
    if (!isLoading && !isSuperAdmin) {
      toast.error(_("Tidak ada akses. Khusus Superadmin."));
      router.replace("/dashboard");
    }
  }, [isSuperAdmin, isLoading, router, _]);

  if (isLoading || !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}

export default function AdminRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AdminRouteGuardInner>{children}</AdminRouteGuardInner>
      </SidebarProvider>
    </AuthProvider>
  );
}
