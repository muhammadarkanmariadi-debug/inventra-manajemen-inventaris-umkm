"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";

export default function VerifyEmailPendingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="flex flex-col items-center space-y-5">
          <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/30 text-brand-500 dark:text-brand-400 rounded-full flex items-center justify-center mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Pendaftaran Berhasil!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Kami telah mengirimkan email verifikasi ke alamat email Anda. 
            Silakan periksa kotak masuk (atau folder spam) dan klik link di dalamnya untuk memverifikasi akun Anda.
          </p>
          <div className="pt-4 w-full border-t border-gray-100 dark:border-gray-700">
             <Link href="/auth/signin">
               <Button className="w-full text-sm font-medium" size="sm">
                  Ke Halaman Login
               </Button>
             </Link>
          </div>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mt-4"
          >
            <ChevronLeftIcon />
            Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
