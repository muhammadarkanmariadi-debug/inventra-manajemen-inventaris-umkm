"use client";

import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { updateProfile } from "../../../../../services/user.service";
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { useTheme, COLOR_THEME_OPTIONS, type ColorTheme } from "@/context/ThemeContext";

type SettingsTab = "security" | "appearance";

export default function SettingsPage() {
  const { _ } = useLingui();
  const { theme, toggleTheme, colorTheme, setColorTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>("security");
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

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: "security", label: _(msg`Keamanan`) },
    { id: "appearance", label: _(msg`Tampilan`) },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle={_(msg`Pengaturan Akun`)} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Menu */}
        <div className="lg:col-span-1 border-r border-gray-100 dark:border-gray-800 pr-4">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Menu" /></h3>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                      : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-2">
          {activeTab === "security" && (
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
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                  <Trans id="Mode Tampilan" />
                </h3>
                <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                  <Trans id="Pilih mode terang atau gelap untuk antarmuka." />
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { if (theme === 'dark') toggleTheme(); }}
                    className={`flex items-center gap-3 rounded-xl border-2 px-5 py-3.5 transition-all ${
                      theme === "light"
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="4" fill="#f59e0b" />
                        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-semibold ${theme === "light" ? "text-brand-600 dark:text-brand-400" : "text-gray-700 dark:text-gray-300"}`}>
                        <Trans id="Terang" />
                      </p>
                    </div>
                    {theme === "light" && (
                      <svg className="ml-auto text-brand-500" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </button>
                  <button
                    onClick={() => { if (theme === 'light') toggleTheme(); }}
                    className={`flex items-center gap-3 rounded-xl border-2 px-5 py-3.5 transition-all ${
                      theme === "dark"
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.455 11.97c-.786 2.982-3.502 5.18-6.729 5.18a6.958 6.958 0 01-6.958-6.959c0-3.227 2.198-5.943 5.18-6.729a5.96 5.96 0 004.885 9.434 5.93 5.93 0 003.622-1.076z" fill="#6366f1" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-semibold ${theme === "dark" ? "text-brand-600 dark:text-brand-400" : "text-gray-700 dark:text-gray-300"}`}>
                        <Trans id="Gelap" />
                      </p>
                    </div>
                    {theme === "dark" && (
                      <svg className="ml-auto text-brand-500" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Color Theme */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                  <Trans id="Warna Tema" />
                </h3>
                <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                  <Trans id="Pilih warna tema utama untuk seluruh antarmuka." />
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {COLOR_THEME_OPTIONS.map((option) => {
                    const isActive = colorTheme === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setColorTheme(option.value)}
                        className={`group relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all hover:shadow-md ${
                          isActive
                            ? "border-brand-500 bg-brand-50 shadow-sm dark:bg-brand-500/10"
                            : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
                        }`}
                      >
                        {/* Color Circle */}
                        <div
                          className="h-12 w-12 rounded-full shadow-inner ring-2 ring-white dark:ring-gray-800 transition-transform group-hover:scale-110"
                          style={{ backgroundColor: option.hex }}
                        />
                        {/* Label */}
                        <span className={`text-xs font-semibold ${isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                          {option.label}
                        </span>
                        {/* Check Indicator */}
                        {isActive && (
                          <div
                            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm"
                            style={{ backgroundColor: option.hex }}
                          >
                            <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                              <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
