"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";
import AdminLayout from "@/components/layouts/AdminLayout";
import { toast } from "sonner";

export default function AdminRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSuperAdmin, isLoading } = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isSuperAdmin) {
      toast.error("Tidak ada akses. Khusus Superadmin.");
      router.replace("/dashboard");
    }
  }, [isSuperAdmin, isLoading, router]);

  if (isLoading || !isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
