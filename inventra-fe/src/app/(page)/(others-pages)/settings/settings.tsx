"use client";

import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { updateProfile } from "../../../../../services/user.service";
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';

export default function SettingsPage() {
  const { _ } = useLingui();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!password || !passwordConfirmation) {
      setMessage({ type: "error", text: _(msg`Silakan isi password baru dan konfirmasinya.`) });
      return;
    }

    if (password !== passwordConfirmation) {
      setMessage({ type: "error", text: _(msg`Konfirmasi password tidak cocok.`) });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: "error", text: _(msg`Password harus minimal 8 karakter.`) });
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile({
        password: password,
        password_confirmation: passwordConfirmation,
      } as any);

      if (result.status) {
        setMessage({ type: "success", text: _(msg`Password berhasil diperbarui!`) });
        setPassword("");
        setPasswordConfirmation("");
      } else {
        setMessage({ type: "error", text: result.message || _(msg`Gagal memperbarui password.`) });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error?.message || _(msg`Terjadi kesalahan saat menyimpan.`) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle={_(msg`Pengaturan Akun`)} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border-r border-gray-100 dark:border-gray-800 pr-4">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Menu" /></h3>
          <ul className="space-y-2">
            <li>
              <button className="w-full text-left px-4 py-2 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 font-medium text-sm">
                <Trans id="Keamanan" />
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 font-medium text-sm transition transition-colors">
                <Trans id="Preferensi Notifikasi" />
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 font-medium text-sm transition transition-colors">
                <Trans id="Tampilan" />
              </button>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
              <Trans id="Ubah Password" />
            </h3>
            
            {message && (
              <div className="mb-6">
                <Alert 
                  variant={message.type} 
                  title={message.type === "success" ? _(msg`Berhasil`) : _(msg`Error`)} 
                  message={message.text} 
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"><Trans id="Password Baru" /></label>
                <input 
                  type="password" 
                  placeholder={_(msg`Masukkan password baru`)} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-500" 
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"><Trans id="Konfirmasi Password Baru" /></label>
                <input 
                  type="password" 
                  placeholder={_(msg`Konfirmasi password baru`)} 
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-500" 
                />
              </div>
              <div className="pt-4 flex justify-end">
                <Button disabled={loading}>
                  {loading ? <Trans id="Menyimpan..." /> : <Trans id="Simpan Perubahan" />}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
