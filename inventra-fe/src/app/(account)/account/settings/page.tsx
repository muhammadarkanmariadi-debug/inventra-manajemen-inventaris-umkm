"use client";
import { Trans } from "@lingui/macro";

import React, { useState } from "react";
import { toast } from 'sonner';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { updateProfile } from "../../../../../services/user.service";
import { useTranslate } from "@/hooks/useTranslate";
import { useTheme, COLOR_THEME_OPTIONS, type ColorTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import Select from "@/components/form/Select";
import { Key, Copy, Check, ShieldCheck, Terminal, AlertCircle } from "lucide-react";
type SettingsTab = "security" | "appearance" | "api_access";

export default function SettingsPage() {
  const { _ } = useTranslate();
  const { setValue, value } = useToast()
  const { theme, toggleTheme, colorTheme, setColorTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>("security");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State untuk API Key & OAuth2 Client Credentials
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key: string; clientId: string; clientSecret: string; createdAt: string }[]>([
    {
      id: "key-1",
      name: "Default Live API Key",
      key: "inv_live_9a8b7c6d5e4f3a2b1c0d",
      clientId: "client_live_abc123456789",
      clientSecret: "secret_live_987654321xyzabcdef",
      createdAt: "2026-07-01",
    }
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error(_("Silakan masukkan label aplikasi/konektor Anda."));
      return;
    }
    const randomSuffix = Math.random().toString(36).substring(2, 12);
    const newEntry = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      key: `inv_live_${randomSuffix}${Math.random().toString(36).substring(2, 10)}`,
      clientId: `client_live_${randomSuffix}`,
      clientSecret: `secret_live_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setApiKeys([newEntry, ...apiKeys]);
    setNewKeyName("");
    toast.success(_("API Key & Client Secret baru berhasil dibuat!"));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(_("Berhasil disalin ke clipboard"));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!password || !passwordConfirmation) {
      setMessage({ type: "error", text: _("Silakan isi password baru dan konfirmasinya.") });
      return;
    }

    if (password !== passwordConfirmation) {
      setMessage({ type: "error", text: _("Konfirmasi password tidak cocok.") });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: "error", text: _("Password harus minimal 8 karakter.") });
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile({
        password: password,
        password_confirmation: passwordConfirmation,
      } as any);

      if (result.status) {
        setMessage({ type: "success", text: _("Password berhasil diperbarui!") });
        setPassword("");
        setPasswordConfirmation("");
      } else {
        setMessage({ type: "error", text: result.message || _("Gagal memperbarui password.") });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error?.message || _("Terjadi kesalahan saat menyimpan.") });
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: "security", label: _("Keamanan") },
    { id: "appearance", label: _("Tampilan") },
    { id: "api_access", label: _("Developer & Akses API") },
  ];
  const position = [
    'top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'
  ]

  return (
    <div>
      <PageBreadcrumb pageTitle={_("Pengaturan ")} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Menu */}
        <div className="lg:col-span-1 border-r border-gray-100 dark:border-gray-800 pr-4">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans>Menu</Trans></h3>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === tab.id
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
                <Trans>Ubah Password</Trans>
              </h3>

              {message && (
                <div className="mb-6">
                  <Alert
                    variant={message.type}
                    title={message.type === "success" ? _("Berhasil") : _("Error")}
                    message={message.text}
                  />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"><Trans>Password Baru</Trans></label>
                  <input
                    type="password"
                    placeholder={_("Masukkan password baru")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"><Trans>Konfirmasi Password Baru</Trans></label>
                  <input
                    type="password"
                    placeholder={_("Konfirmasi password baru")}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-500"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button disabled={loading}>
                    {loading ? <Trans>Menyimpan...</Trans> : <Trans>Simpan Perubahan</Trans>}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 items-center justify-between">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                    <Trans>Mode Tampilan</Trans>
                  </h3>
                  <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                    <Trans>Pilih mode terang atau gelap untuk antarmuka.</Trans>
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { if (theme === 'dark') toggleTheme(); }}
                      className={`flex items-center gap-3 rounded-xl border-2 px-5 py-3.5 transition-all ${theme === "light"
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
                          <Trans>Terang</Trans>
                        </p>
                      </div>
                      {theme === "light" && (
                        <svg className="ml-auto text-brand-500" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                    </button>
                    <button
                      onClick={() => { if (theme === 'light') toggleTheme(); }}
                      className={`flex items-center gap-3 rounded-xl border-2 px-5 py-3.5 transition-all ${theme === "dark"
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
                          <Trans>Gelap</Trans>
                        </p>
                      </div>
                      {theme === "dark" && (
                        <svg className="ml-auto text-brand-500" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      )}
                    </button>
                  </div>

                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                    <Trans>Mode notifikasi</Trans>
                  </h3>
                  <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                    <Trans>Pilih posisi notifikasi yang ditampilkan di layar.</Trans>
                  </p>
                  <Select defaultValue={value} options={position.map((item) => ({ value : item, label : item }))} onChange={(e) => setValue(e)}/>
                </div>
              </div>
              {/* Color Theme */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                  <Trans>Warna Tema</Trans>
                </h3>
                <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                  <Trans>Pilih warna tema utama untuk seluruh antarmuka.</Trans>
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {COLOR_THEME_OPTIONS.map((option) => {
                    const isActive = colorTheme === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setColorTheme(option.value)}
                        className={`group relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all hover:shadow-md ${isActive
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
                              <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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

          {activeTab === "api_access" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                      <Trans>Kredensial & API Key Developer</Trans>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <Trans>Kelola kunci otentikasi (X-Inventra-Key) dan kredensial OAuth2 Client untuk integrasi ERP eksternal.</Trans>
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4 text-xs text-blue-800 dark:text-blue-300 mb-6 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>{/* @ts-ignore */}Penting:</strong> {/* @ts-ignore */}Simpan `client_secret` dan API Key Anda dengan rahasia di server backend Anda. Jangan pernah membagikan atau menanamkan kredensial ini langsung di aplikasi frontend publik atau repositori GitHub.</div>
                </div>

                {/* Generate New Key Form */}
                <form onSubmit={handleGenerateKey} className="mb-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-brand-500" /> {/* @ts-ignore */}Buat Kredensial Baru</h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder={_("Nama label aplikasi / konektor (mis. SAP Connector)")}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                    />
                    <Button type="submit">
                      <Trans>Generate Key</Trans>
                    </Button>
                  </div>
                </form>

                {/* List of Keys */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white">{/* @ts-ignore */}Daftar Kredensial Aktif</h4>
                  {apiKeys.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                        <div>
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">{item.name}</span>
                          <span className="ml-2 text-xs text-gray-400">({item.createdAt})</span>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {/* @ts-ignore */}Active</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="text-[10px] text-gray-400 block font-sans">{/* @ts-ignore */}Header X-Inventra-Key:</span>
                            <span className="text-gray-800 dark:text-gray-200 truncate block">{item.key}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.key, `${item.id}-key`)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-gray-800 dark:hover:text-white shrink-0 transition-colors"
                          >
                            {copiedId === `${item.id}-key` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="text-[10px] text-gray-400 block font-sans">{/* @ts-ignore */}OAuth2 client_id:</span>
                            <span className="text-gray-800 dark:text-gray-200 truncate block">{item.clientId}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.clientId, `${item.id}-client`)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-gray-800 dark:hover:text-white shrink-0 transition-colors"
                          >
                            {copiedId === `${item.id}-client` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="text-[10px] text-gray-400 block font-sans">{/* @ts-ignore */}OAuth2 client_secret:</span>
                            <span className="text-gray-800 dark:text-gray-200 truncate block">{item.clientSecret}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.clientSecret, `${item.id}-secret`)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500 hover:text-gray-800 dark:hover:text-white shrink-0 transition-colors"
                          >
                            {copiedId === `${item.id}-secret` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
