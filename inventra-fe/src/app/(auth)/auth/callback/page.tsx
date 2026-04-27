"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { setCookies } from "../../../../../lib/server-cookie";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    const processAuth = async () => {
      if (error) {
        toast.error("Autentikasi Gagal", {
          description: decodeURIComponent(error),
        });
        router.push("/auth/signin");
        return;
      }

      if (token) {
        await setCookies("token", token);
        toast.success("Login Berhasil", {
          description: "Anda berhasil masuk dengan Google.",
        });
        router.push("/dashboard");
      } else {
        router.push("/auth/signin");
      }
    };

    processAuth();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Memproses Autentikasi...</h2>
      </div>
    </div>
  );
}
