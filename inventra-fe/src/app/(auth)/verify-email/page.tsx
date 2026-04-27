"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/button/Button";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const url = searchParams.get("url");

    if (!url) {
      setStatus("error");
      setMessage("Link verifikasi tidak valid atau tidak ditemukan.");
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(decodeURIComponent(url), {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });

        const data = await response.json();       

        if (response.ok && data.status) {
          setStatus("success");
          setMessage(data.message || "Email berhasil diverifikasi.");
        } else {
          setStatus("error");
          setMessage(data.message || "Gagal memverifikasi email.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Terjadi kesalahan jaringan.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Memverifikasi...</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Harap tunggu sebentar, kami sedang memvalidasi kredensial Anda.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center space-y-4">
             <div className="w-16 h-16 bg-success-50 dark:bg-success-900/30 text-success-500 dark:text-success-400 rounded-full flex items-center justify-center mb-2">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
             </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Email Terverifikasi!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
            <Button onClick={() => router.push("/dashboard")} className="w-full mt-4">Lanjut ke Dashboard</Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-4">
             <div className="w-16 h-16 bg-error-50 dark:bg-error-900/30 text-error-500 dark:text-error-400 rounded-full flex items-center justify-center mb-2">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Verifikasi Bermasalah</h2>
            <p className="text-sm text-error-500 dark:text-error-400">{message}</p>
            <Button onClick={() => router.push("/auth/signin")} className="w-full mt-4">Kembali ke Sign In</Button>
          </div>
        )}
      </div>
    </div>
  );
}
