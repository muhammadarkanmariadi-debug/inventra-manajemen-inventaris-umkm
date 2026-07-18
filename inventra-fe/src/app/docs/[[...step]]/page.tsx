'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { EndpointCard } from '@/components/docs/EndpointCard';
import { CodeSnippet } from '@/components/docs/CodeSnippet';
import {
  BookOpen,
  Key,
  Terminal,
  Box,
  Layers,
  ShoppingCart,
  Webhook,
  Sparkles,
  AlertTriangle,
  CheckSquare,
  ShieldCheck,
  Building2,
  FileText,
  RotateCcw,
  GitBranch,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Trans } from "@lingui/macro";

interface StepItem {
  slug: string;
  number: number;
  title: string;
  shortTitle: string;
  icon: React.ReactNode;
  tier?: 'Starter' | 'Professional' | 'Enterprise';
}

const STEPS: StepItem[] = [
  {
    slug: '0-overview',
    number: 0,
    title: 'Overview & Arsitektur Sistem',
    shortTitle: 'Overview',
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    slug: '1-kredensial-api',
    number: 1,
    title: 'Kredensial API & Akses Developer',
    shortTitle: 'Kredensial API',
    icon: <Key className="w-4 h-4" />,
  },
  {
    slug: '2-autentikasi',
    number: 2,
    title: 'Autentikasi OAuth2 & API Key',
    shortTitle: 'Autentikasi',
    icon: <ShieldCheck className="w-4 h-4" />,
  },
  {
    slug: '3-request-pertama',
    number: 3,
    title: 'Request Pertama & Envelope Response',
    shortTitle: 'Request Pertama',
    icon: <Terminal className="w-4 h-4" />,
  },
  {
    slug: '4-referensi-endpoint',
    number: 4,
    title: 'Referensi Endpoint per Modul (7 Modul)',
    shortTitle: 'Referensi Modul',
    icon: <Box className="w-4 h-4" />,
    tier: 'Starter',
  },
  {
    slug: '5-webhook-event',
    number: 5,
    title: 'Webhook & Event Notifications',
    shortTitle: 'Webhook & Event',
    icon: <Webhook className="w-4 h-4" />,
    tier: 'Professional',
  },
  {
    slug: '6-idempotency-error',
    number: 6,
    title: 'Idempotency & Kode Error Bisnis',
    shortTitle: 'Idempotency & Error',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  {
    slug: '7-sandbox-testing',
    number: 7,
    title: 'Sandbox Testing & Checklist Go-Live',
    shortTitle: 'Sandbox & Go-Live',
    icon: <CheckSquare className="w-4 h-4" />,
  },
  {
    slug: '8-changelog-versioning',
    number: 8,
    title: 'Changelog & Kebijakan Versioning',
    shortTitle: 'Changelog & Versi',
    icon: <GitBranch className="w-4 h-4" />,
  },
];

export default function ApiDocsPage() {
  const params = useParams();
  const router = useRouter();

  const stepParam = params?.step as string[] | undefined;
  const currentSlug = stepParam && stepParam[0] ? stepParam[0] : '0-overview';

  const currentStepIndex = STEPS.findIndex((s) => s.slug === currentSlug);
  const activeStep = STEPS[currentStepIndex !== -1 ? currentStepIndex : 0];

  const prevStep = currentStepIndex > 0 ? STEPS[currentStepIndex - 1] : null;
  const nextStep = currentStepIndex < STEPS.length - 1 ? STEPS[currentStepIndex + 1] : null;

  const handleStepClick = (slug: string) => {
    router.push(`/docs/${slug}`);
  };

  const getTierBadge = (t?: string) => {
    if (!t) return null;
    if (t === 'Professional') {
      return (
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          {/* @ts-ignore */}<Trans>PRO+</Trans></span>
      );
    }
    if (t === 'Enterprise') {
      return (
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          {/* @ts-ignore */}<Trans>ENT ONLY</Trans></span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
        {/* @ts-ignore */}<Trans>STARTER+</Trans></span>
    );
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground font-outfit selection:bg-brand-500/20 selection:text-brand-500">
      <LandingHeader />

      <div className="pt-24 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 py-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-3">
                <Terminal className="w-4 h-4 text-blue-500" />
                <span>{/* @ts-ignore */}<Trans>Inventra API v1.0</Trans></span>
              </div>

              <nav className="space-y-1">
                {STEPS.map((step) => {
                  const isActive = step.slug === activeStep.slug;
                  return (
                    <button
                      key={step.slug}
                      type="button"
                      onClick={() => handleStepClick(step.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {step.number}
                        </span>
                        <span className="truncate">{step.shortTitle}</span>
                      </div>
                      {!isActive && getTierBadge(step.tier)}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 px-3">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300">
                  <p className="font-bold mb-1">{/* @ts-ignore */}<Trans>Butuh Bantuan Integrasi?</Trans></p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {/* @ts-ignore */}<Trans>Konsultasikan arsitektur sistem ERP Anda atau tanyakan error via</Trans>{' '}
                    <Link href="/faq" className="font-bold text-blue-600 dark:text-blue-400 underline">
                      {/* @ts-ignore */}<Trans>Pusat Bantuan / FAQ</Trans></Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 pb-20">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
              {/* Step Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-2 border border-blue-500/20">
                    <span>{/* @ts-ignore */}<Trans>Step</Trans>{activeStep.number} {/* @ts-ignore */}<Trans>dari</Trans>{STEPS.length - 1}</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {activeStep.title}
                  </h1>
                </div>
                {activeStep.tier && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {/* @ts-ignore */}<Trans>Batas Tier:</Trans></span>
                    {getTierBadge(activeStep.tier)}
                  </div>
                )}
              </div>

              {/* Step 0: Overview */}
              {activeStep.slug === '0-overview' && (
                <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                  <p>
                    {/* @ts-ignore */}<Trans>Selamat datang di</Trans><strong>{/* @ts-ignore */}<Trans>Dokumentasi Resmi Inventra API v1.0</Trans></strong>{/* @ts-ignore */}<Trans>. Inventra dirancang baik sebagai platform mandiri maupun sebagai</Trans><em>{/* @ts-ignore */}<Trans>side-system ERP</Trans></em> {/* @ts-ignore */}<Trans>yang bersinkronisasi ganda dengan sistem utama perusahaan Anda (seperti SAP, Odoo, Accurate, atau POS kasir).</Trans></p>

                  {/* Architecture Box */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 my-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-blue-500" />
                      {/* @ts-ignore */}<Trans>Arsitektur Side-System & Isolasi Multi-Tenant</Trans></h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                      {/* @ts-ignore */}<Trans>Seluruh request API diisolasi secara ketat menggunakan kunci</Trans><code>{/* @ts-ignore */}<Trans>bussiness_id</Trans></code> {/* @ts-ignore */}<Trans>pada tenant Anda. Data katalog produk, stok gudang, dan mutasi barang tidak akan bercampur antar cabang bisnis atau tenant lain.</Trans></p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">{/* @ts-ignore */}<Trans>Base URL Production</Trans></span>
                        <code className="text-sm font-mono text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded block">{/* @ts-ignore */}<Trans>https://api.inventra.id/v1</Trans></code>
                      </div>
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 block mb-1">{/* @ts-ignore */}<Trans>Base URL Sandbox / Testing</Trans></span>
                        <code className="text-sm font-mono text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded block">{/* @ts-ignore */}<Trans>https://sandbox-api.inventra.id/v1</Trans></code>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white pt-2">
                    {/* @ts-ignore */}<Trans>Alur Kerja Integrasi</Trans></h3>
                  <ol className="list-decimal pl-6 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <li><strong>{/* @ts-ignore */}<Trans>Dapatkan Kredensial:</Trans></strong> {/* @ts-ignore */}<Trans>Buat API Key atau Client Credentials OAuth2 melalui menu</Trans><em>{/* @ts-ignore */}<Trans>Pengaturan -&gt; Developer & Akses API</Trans></em> {/* @ts-ignore */}<Trans>di dashboard Anda.</Trans></li>
                    <li><strong>{/* @ts-ignore */}<Trans>Sinkronisasi Katalog & Supplier:</Trans></strong> {/* @ts-ignore */}<Trans>Unggah atau hubungkan master SKU dan supplier dari sistem ERP Anda ke Inventra.</Trans></li>
                    <li><strong>{/* @ts-ignore */}<Trans>Pencatatan Real-Time:</Trans></strong> {/* @ts-ignore */}<Trans>Kirim event mutasi barang masuk (Purchases) dan barang keluar (Sales) secara instan melalui API.</Trans></li>
                    <li><strong>{/* @ts-ignore */}<Trans>Terima Webhook:</Trans></strong> {/* @ts-ignore */}<Trans>Dapatkan notifikasi balik ke server Anda saat stok menyentuh batas kritis atau barang ditolak saat QC.</Trans></li>
                  </ol>
                </div>
              )}

              {/* Step 1: Kredensial API */}
              {activeStep.slug === '1-kredensial-api' && (
                <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    {/* @ts-ignore */}<Trans>Sebelum melakukan pemanggilan API, Anda perlu membuat kredensial keamanan melalui dasbor Inventra Anda. Setiap API Key terikat dengan izin (scope) tertentu dan mengidentifikasi bisnis Anda secara unik.</Trans></p>

                  <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-6 my-6">
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
                      {/* @ts-ignore */}<Trans>Langkah Generate API Key / Client Secret</Trans></h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-blue-800 dark:text-blue-300">
                      <li>{/* @ts-ignore */}<Trans>Masuk ke dasbor dengan akun berstatus</Trans><strong>{/* @ts-ignore */}<Trans>Owner</Trans></strong> {/* @ts-ignore */}<Trans>atau</Trans><strong>{/* @ts-ignore */}<Trans>Admin</Trans></strong>.</li>
                      <li>{/* @ts-ignore */}<Trans>Buka menu</Trans><strong>{/* @ts-ignore */}<Trans>Pengaturan Akun</Trans></strong> {/* @ts-ignore */}<Trans>dan pilih tab</Trans><strong>{/* @ts-ignore */}<Trans>Developer & Akses API</Trans></strong>.</li>
                      <li>{/* @ts-ignore */}<Trans>Klik tombol</Trans><strong>{/* @ts-ignore */}<Trans>&quot;Buat API Key Baru&quot;</Trans></strong>{/* @ts-ignore */}<Trans>, beri nama label aplikasi integrasi Anda (mis.</Trans><em>{/* @ts-ignore */}<Trans>&quot;SAP Integration Connector&quot;</Trans></em>).</li>
                      <li>{/* @ts-ignore */}<Trans>Salin dan simpan</Trans><code>{/* @ts-ignore */}<Trans>client_id</Trans></code>, <code>{/* @ts-ignore */}<Trans>client_secret</Trans></code>{/* @ts-ignore */}<Trans>, serta</Trans><code>{/* @ts-ignore */}<Trans>X-Inventra-Key</Trans></code> {/* @ts-ignore */}<Trans>di tempat yang aman (mis. rahasia environment `.env`). Rahasia tidak akan ditampilkan ulang setelah jendela ditutup.</Trans></li>
                    </ol>
                    <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 flex items-center gap-3">
                      <Link
                        href="/account/settings"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md inline-flex items-center gap-1.5"
                      >
                        <span>{/* @ts-ignore */}<Trans>Buka Pengaturan Developer</Trans></span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Autentikasi OAuth2 */}
              {activeStep.slug === '2-autentikasi' && (
                <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    {/* @ts-ignore */}<Trans>Inventra mendukung dua pendekatan autentikasi:</Trans><strong>{/* @ts-ignore */}<Trans>OAuth2 Client Credentials Grant</Trans></strong> {/* @ts-ignore */}<Trans>untuk otorisasi berbatas waktu via JWT Bearer Token, dan</Trans><strong>{/* @ts-ignore */}<Trans>Custom Header API Key</Trans></strong> {/* @ts-ignore */}<Trans>untuk automasi skrip sederhana.</Trans></p>

                  <EndpointCard
                    method="POST"
                    path="/oauth/token"
                    title="Dapatkan Access Token OAuth2"
                    description="Menukar client_id dan client_secret dengan JWT Bearer token berdurasi 24 jam."
                    tier="Starter"
                    bodyParams={[
                      { name: 'grant_type', type: 'string', required: true, description: 'Wajib bernilai: "client_credentials"' },
                      { name: 'client_id', type: 'string', required: true, description: 'ID Client aplikasi Anda dari dasbor' },
                      { name: 'client_secret', type: 'string', required: true, description: 'Rahasia Client (Secret) aplikasi Anda' },
                      { name: 'scope', type: 'string', required: false, description: 'Daftar scope yang diminta (mis. "read:products write:inventory")' },
                    ]}
                    snippetTabs={[
                      {
                        id: 'curl',
                        label: 'cURL',
                        code: `curl -X POST "https://api.inventra.id/v1/oauth/token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "client_credentials",
    "client_id": "client_123456789abc",
    "client_secret": "secret_987654321xyz",
    "scope": "read:products write:inventory"
  }'`
                      },
                      {
                        id: 'json',
                        label: 'JSON Response (200 OK)',
                        code: `{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "scope": "read:products write:inventory"
}`
                      }
                    ]}
                  />

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 mt-6">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{/* @ts-ignore */}<Trans>Penjelasan Scope Otorisasi per Tier</Trans></h4>
                    <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300 font-mono">
                      <li><strong className="text-blue-500">{/* @ts-ignore */}<Trans>read:products</Trans></strong> / <strong className="text-blue-500">{/* @ts-ignore */}<Trans>write:products</Trans></strong> {/* @ts-ignore */}<Trans>— Akses katalog & master SKU (Semua Tier).</Trans></li>
                      <li><strong className="text-blue-500">{/* @ts-ignore */}<Trans>read:inventory</Trans></strong> / <strong className="text-blue-500">{/* @ts-ignore */}<Trans>write:inventory</Trans></strong> {/* @ts-ignore */}<Trans>— Mutasi stok & penyesuaian gudang (Semua Tier).</Trans></li>
                      <li><strong className="text-purple-500">{/* @ts-ignore */}<Trans>webhook:manage</Trans></strong> {/* @ts-ignore */}<Trans>— Konfigurasi URL dan berlangganan event webhook (Professional & Enterprise).</Trans></li>
                      <li><strong className="text-purple-500">{/* @ts-ignore */}<Trans>ai:forecasting</Trans></strong> {/* @ts-ignore */}<Trans>— Query proyeksi machine learning 14 hari kedepan (Enterprise / Add-on AI).</Trans></li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 3: Request Pertama & Envelope */}
              {activeStep.slug === '3-request-pertama' && (
                <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    {/* @ts-ignore */}<Trans>Setelah mendapatkan token atau API Key, cobalah melakukan request pertama ke endpoint pemeriksaan status langganan atau daftar produk. Semua response Inventra dibungkus dalam **Envelope JSON** yang konsisten.</Trans></p>

                  <div className="bg-slate-900 text-slate-200 font-mono text-xs rounded-2xl p-5 border border-slate-800 overflow-x-auto my-4">
                    <p className="text-slate-500 mb-2">{`// Format Standar Envelope JSON Inventra API:`}</p>
                    <pre>{`{
  "status": true,
  "message": "Pesan deskriptif hasil request",
  "data": { ... payload objek atau array data ... },
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 142
  },
  "errors": null
}`}</pre>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">{/* @ts-ignore */}<Trans>Header Rate Limiting</Trans></h3>
                  <p className="text-sm">
                    {/* @ts-ignore */}<Trans>Setiap respons HTTP menyertakan header indikator kapasitas request yang tersisa pada sesi atau API Key Anda:</Trans></p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block">{/* @ts-ignore */}<Trans>X-RateLimit-Limit</Trans></span>
                      <strong className="text-slate-900 dark:text-white text-base">60</strong>
                      <span className="text-slate-500 block text-[11px] mt-1">{/* @ts-ignore */}<Trans>Batas request per menit</Trans></span>
                    </div>
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block">{/* @ts-ignore */}<Trans>X-RateLimit-Remaining</Trans></span>
                      <strong className="text-emerald-500 text-base">59</strong>
                      <span className="text-slate-500 block text-[11px] mt-1">{/* @ts-ignore */}<Trans>Sisa request di jendela ini</Trans></span>
                    </div>
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block">{/* @ts-ignore */}<Trans>X-RateLimit-Reset</Trans></span>
                      <strong className="text-blue-500 text-base">1721293800</strong>
                      <span className="text-slate-500 block text-[11px] mt-1">{/* @ts-ignore */}<Trans>Unix timestamp reset kuota</Trans></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Referensi Endpoint per Modul (7 Modul Lengkap) */}
              {activeStep.slug === '4-referensi-endpoint' && (
                <div className="space-y-10 text-slate-600 dark:text-slate-300">
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-sm">
                    <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">{/* @ts-ignore */}<Trans>Daftar Lengkap 7 Modul Bisnis Inventra API</Trans></p>
                    <p className="text-blue-800 dark:text-blue-400 text-xs">
                      {/* @ts-ignore */}<Trans>Berikut adalah spesifikasi endpoint utama untuk seluruh aktivitas rantai pasok dan inventaris. Gunakan header `X-Inventra-Key` pada setiap panggilan.</Trans></p>
                  </div>

                  {/* Modul 1: Produk & Kategori */}
                  <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Box className="w-5 h-5 text-blue-500" /> {/* @ts-ignore */}<Trans>1. Modul Produk & Kategori</Trans></h3>
                    <EndpointCard
                      method="GET"
                      path="/api/v1/products"
                      title="Ambil Daftar SKU Produk"
                      description="Mengembalikan katalog barang bisnis dengan informasi harga jual dan stok agregat dari seluruh gudang."
                      tier="Starter"
                      params={[
                        { name: 'page', type: 'integer', required: false, description: 'Halaman paginasi (Default: 1)' },
                        { name: 'search', type: 'string', required: false, description: 'Cari nama atau kode SKU' },
                        { name: 'category_id', type: 'integer', required: false, description: 'Filter berdasarkan ID kategori' },
                      ]}
                      snippetTabs={[
                        {
                          id: 'curl',
                          label: 'cURL',
                          code: `curl -X GET "https://api.inventra.id/v1/products?page=1&limit=10" \\
  -H "X-Inventra-Key: inv_live_abc123"`
                        },
                        {
                          id: 'json',
                          label: 'JSON Response (200 OK)',
                          code: `{
  "status": true,
  "data": {
    "data": [
      { "id": 101, "sku": "SKU-BEV-001", "name": "Kopi Susu Gula Aren 1L", "unit": "Botol", "stock": 45, "price": 85000 }
    ],
    "total": 1
  }
}`
                        }
                      ]}
                    />
                    <EndpointCard
                      method="POST"
                      path="/api/v1/products"
                      title="Buat SKU Produk Baru"
                      description="Mendaftarkan barang baru ke database inventaris Anda."
                      tier="Starter"
                      bodyParams={[
                        { name: 'name', type: 'string', required: true, description: 'Nama lengkap produk' },
                        { name: 'sku', type: 'string', required: true, description: 'Kode SKU unik barang' },
                        { name: 'unit', type: 'string', required: false, description: 'Satuan (mis. Pcs, Botol, Kg)' },
                        { name: 'price', type: 'number', required: false, description: 'Harga jual satuan' },
                      ]}
                    />
                  </div>

                  {/* Modul 2: Supplier */}
                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-indigo-500" /> {/* @ts-ignore */}<Trans>2. Modul Supplier (Pemasok)</Trans></h3>
                    <EndpointCard
                      method="GET"
                      path="/api/v1/suppliers"
                      title="Daftar Mitra Supplier"
                      description="Mengambil daftar mitra pemasok barang yang terdaftar pada sistem Anda."
                      tier="Starter"
                      params={[
                        { name: 'search', type: 'string', required: false, description: 'Cari berdasarkan nama atau kota supplier' },
                      ]}
                      snippetTabs={[
                        {
                          id: 'curl',
                          label: 'cURL',
                          code: `curl -X GET "https://api.inventra.id/v1/suppliers" \\
  -H "X-Inventra-Key: inv_live_abc123"`
                        },
                        {
                          id: 'json',
                          label: 'JSON Response (200 OK)',
                          code: `{
  "status": true,
  "data": [
    { "id": 12, "name": "PT Sumber Biji Kopi Nusantara", "phone": "081122334455", "city": "Bandung" }
  ]
}`
                        }
                      ]}
                    />
                    <EndpointCard
                      method="POST"
                      path="/api/v1/suppliers"
                      title="Daftarkan Supplier Baru"
                      description="Menambahkan data kontak dan alamat supplier ke database bisnis."
                      tier="Starter"
                      bodyParams={[
                        { name: 'name', type: 'string', required: true, description: 'Nama perusahaan supplier' },
                        { name: 'phone', type: 'string', required: false, description: 'Nomor telepon / WhatsApp kontak' },
                        { name: 'address', type: 'string', required: false, description: 'Alamat lengkap gudang/kantor supplier' },
                      ]}
                    />
                  </div>

                  {/* Modul 3: Pembelian & Batch Tracking */}
                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-emerald-500" /> {/* @ts-ignore */}<Trans>3. Modul Pembelian & Batch Tracking (IN)</Trans></h3>
                    <EndpointCard
                      method="POST"
                      path="/api/v1/purchases"
                      title="Pencatatan Pembelian Barang Masuk"
                      description="Mencatat penerimaan barang dari supplier, menambah stok gudang, dan menyimpan nomor batch serta tanggal kedaluwarsa."
                      tier="Starter"
                      bodyParams={[
                        { name: 'po_number', type: 'string', required: true, description: 'Nomor Purchase Order' },
                        { name: 'supplier_id', type: 'integer', required: true, description: 'ID Supplier pemasok' },
                        { name: 'location_id', type: 'integer', required: true, description: 'ID Gudang penerima barang' },
                        { name: 'items', type: 'array', required: true, description: 'Array item [{ product_id, quantity, cost, batch_number, expiry_date }]' },
                      ]}
                      snippetTabs={[
                        {
                          id: 'curl',
                          label: 'cURL',
                          code: `curl -X POST "https://api.inventra.id/v1/purchases" \\
  -H "X-Inventra-Key: inv_live_abc123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "po_number": "PO/2026/07/0088",
    "supplier_id": 12,
    "location_id": 1,
    "items": [
      { "product_id": 101, "quantity": 100, "cost": 65000, "batch_number": "BATCH-2026-07A", "expiry_date": "2027-07-18" }
    ]
  }'`
                        },
                        {
                          id: 'json',
                          label: 'JSON Response (201 Created)',
                          code: `{
  "status": true,
  "message": "Penerimaan barang dan batch berhasil dicatat. Stok bertambah.",
  "data": { "purchase_id": 405, "po_number": "PO/2026/07/0088" }
}`
                        }
                      ]}
                    />
                  </div>

                  {/* Modul 4: Stok & Mutasi */}
                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-amber-500" /> {/* @ts-ignore */}<Trans>4. Modul Stok & Penyesuaian Gudang</Trans></h3>
                    <EndpointCard
                      method="GET"
                      path="/api/v1/inventories"
                      title="Kuantitas Stok per Lokasi & Status QC"
                      description="Mengambil data stok barang real-time dengan pemisahan status (READY, REJECT, atau ON_HOLD)."
                      tier="Starter"
                      params={[
                        { name: 'location_id', type: 'integer', required: false, description: 'Filter gudang spesifik' },
                        { name: 'product_id', type: 'integer', required: false, description: 'Filter produk spesifik' },
                      ]}
                    />
                    <EndpointCard
                      method="POST"
                      path="/api/v1/adjustments"
                      title="Penyesuaian Stok (Stock Adjustment) - (Belum Tersedia)"
                      description="Melakukan koreksi stok opname jika terdapat selisih fisik barang di gudang. Endpoint ini masih dalam tahap pengembangan (belum tersedia)."
                      tier="Starter"
                      bodyParams={[
                        { name: 'location_id', type: 'integer', required: true, description: 'ID Gudang tempat koreksi' },
                        { name: 'product_id', type: 'integer', required: true, description: 'ID SKU yang dikoreksi' },
                        { name: 'quantity_change', type: 'integer', required: true, description: 'Selisih angka (positif untuk menambah, negatif untuk mengurangi)' },
                        { name: 'reason', type: 'string', required: true, description: 'Alasan penyesuaian (mis. Kerusakan, Selisih Opname)' },
                      ]}
                    />
                  </div>

                  {/* Modul 5: Penjualan & Surat Jalan */}
                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" /> {/* @ts-ignore */}<Trans>5. Modul Penjualan & Surat Jalan (OUT)</Trans></h3>
                    <EndpointCard
                      method="POST"
                      path="/api/v1/sales"
                      title="Catat Penjualan & Pengeluaran Barang"
                      description="Mengurangi stok barang pada gudang terkait secara langsung setelah transaksi selesai."
                      tier="Starter"
                      bodyParams={[
                        { name: 'invoice_number', type: 'string', required: true, description: 'Nomor faktur / invoice dari kasir/ERP' },
                        { name: 'location_id', type: 'integer', required: true, description: 'ID Gudang pengirim barang' },
                        { name: 'items', type: 'array', required: true, description: 'Array item [{ product_id, quantity, price }]' },
                      ]}
                    />
                    <EndpointCard
                      method="GET"
                      path="/api/v1/delivery-orders"
                      title="Ambil Data Surat Jalan Pengiriman - (Belum Tersedia)"
                      description="Mengembalikan riwayat surat jalan beserta status pengiriman barang keluar. Endpoint ini masih dalam tahap pengembangan (belum tersedia)."
                      tier="Professional"
                    />
                  </div>

                  {/* Modul 6: Laporan */}
                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-500" /> {/* @ts-ignore */}<Trans>6. Modul Laporan & Analitik Agregat</Trans></h3>
                    <EndpointCard
                      method="GET"
                      path="/api/v1/reports/stock-movement"
                      title="Laporan Pergerakan Stok (Stock Movement)"
                      description="Rekapitulasi total kuantitas masuk, keluar, dan sisa akhir per produk pada rentang tanggal tertentu."
                      tier="Starter"
                      params={[
                        { name: 'start_date', type: 'string', required: true, description: 'Tanggal awal (YYYY-MM-DD)' },
                        { name: 'end_date', type: 'string', required: true, description: 'Tanggal akhir (YYYY-MM-DD)' },
                      ]}
                    />
                    <EndpointCard
                      method="GET"
                      path="/api/v1/reports/sales-summary"
                      title="Laporan Ringkasan Penjualan"
                      description="Agregasi pendapatan dan total item terjual per lokasi gudang."
                      tier="Professional"
                    />
                  </div>

                  {/* Modul 7: Prediksi Stok AI */}
                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" /> {/* @ts-ignore */}<Trans>7. Modul Prediksi Stok Cerdas AI (Forecasting)</Trans></h3>
                    <EndpointCard
                      method="GET"
                      path="/api/v1/statistic/prediksi/{product_id}"
                      title="Proyeksi Penjualan & Restock 14 Hari Kedepan"
                      description="Mengakses model machine learning Prophet untuk memberikan saran waktu pemesanan ulang (Reorder Point)."
                      tier="Enterprise"
                      params={[
                        { name: 'product_id', type: 'integer', required: true, description: 'ID produk yang diprediksi' },
                        { name: 'days', type: 'integer', required: false, description: 'Durasi hari proyeksi (Default: 14)' },
                      ]}
                      snippetTabs={[
                        {
                          id: 'curl',
                          label: 'cURL',
                          code: `curl -X GET "https://api.inventra.id/v1/statistic/prediksi/101?days=14" \\
  -H "X-Inventra-Key: inv_live_enterprise_xyz"`
                        },
                        {
                          id: 'json',
                          label: 'JSON Response (200 OK)',
                          code: `{
  "status": true,
  "data": {
    "product_id": 101,
    "recommendation": "Lakukan pemesanan restock sebanyak 80 unit sebelum 4 hari lagi.",
    "forecast": [
      { "ds": "2026-07-19", "yhat": 6.5, "yhat_lower": 4.1, "yhat_upper": 8.9 }
    ]
  }
}`
                        }
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Webhook & Event */}
              {activeStep.slug === '5-webhook-event' && (
                <div className="space-y-6 text-slate-600 dark:text-slate-300">
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm">
                        {/* @ts-ignore */}<Trans>Fitur Tersedia di Paket Professional & Enterprise</Trans></h4>
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        {/* @ts-ignore */}<Trans>Webhook memungkinkan server ERP Anda menerima notifikasi instan saat stok menipis, barang reject saat QC, atau batch hampir kedaluwarsa.</Trans></p>
                    </div>
                  </div>

                  <p className="leading-relaxed">
                    {/* @ts-ignore */}<Trans>Daftarkan URL endpoint webhook Anda pada pengaturan dashboard untuk menerima payload event HTTP POST secara otomatis saat kejadian operasional penting berlangsung.</Trans></p>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">{/* @ts-ignore */}<Trans>Daftar Event Notification</Trans></h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li><code>{/* @ts-ignore */}<Trans>stock.critical</Trans></code> {/* @ts-ignore */}<Trans>— Stok produk menyentuh ambang batas kritis (&lt;= 5 unit).</Trans></li>
                    <li><code>{/* @ts-ignore */}<Trans>qc.rejected</Trans></code> {/* @ts-ignore */}<Trans>— Inspeksi QC penerimaan mendapati cacat barang berisiko tinggi.</Trans></li>
                    <li><code>{/* @ts-ignore */}<Trans>sales.created</Trans></code> {/* @ts-ignore */}<Trans>— Transaksi penjualan dan pengeluaran barang berhasil dicatat.</Trans></li>
                    <li><code>{/* @ts-ignore */}<Trans>batch.expired</Trans></code> {/* @ts-ignore */}<Trans>— Terdapat nomor batch barang dalam gudang yang memasuki periode 30 hari sebelum kedaluwarsa.</Trans></li>
                  </ul>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">{/* @ts-ignore */}<Trans>Verifikasi Signature HMAC (X-Inventra-Signature)</Trans></h3>
                  <p className="text-sm">
                    {/* @ts-ignore */}<Trans>Untuk memastikan keamanan bahwa payload webhook benar-benar berasal dari server Inventra, setiap request HTTP POST menyertakan header `X-Inventra-Signature` yang merupakan hash HMAC-SHA256 dari body payload dengan rahasia webhook Anda.</Trans></p>
                  <CodeSnippet
                    title="Contoh Verifikasi Signature di Node.js"
                    tabs={[
                      {
                        id: 'js',
                        label: 'Node.js / Express',
                        code: `const crypto = require('crypto');

app.post('/webhook/inventra', (req, res) => {
  const signature = req.headers['x-inventra-signature'];
  const secret = process.env.INVENTRA_WEBHOOK_SECRET;
  
  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedHash) {
    return res.status(401).send('Invalid webhook signature');
  }

  // Proses event req.body.event
  res.status(200).send('OK');
});`
                      }
                    ]}
                  />

                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300">
                    <p className="font-bold mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> {/* @ts-ignore */}<Trans>Kebijakan Retry Exponential Backoff (5x)</Trans></p>
                    <p>
                      {/* @ts-ignore */}<Trans>Jika server webhook Anda mengembalikan HTTP status error (5xx) atau mengalami timeout, Inventra akan mencoba mengirim ulang webhook hingga 5 kali dengan jeda waktu eksponensial (1m, 5m, 15m, 1 jam, 6 jam).</Trans></p>
                  </div>
                </div>
              )}

              {/* Step 6: Idempotency & Kode Error Bisnis */}
              {activeStep.slug === '6-idempotency-error' && (
                <div className="space-y-6 text-slate-600 dark:text-slate-300">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{/* @ts-ignore */}<Trans>Idempotency Header (Mencegah Transaksi Ganda)</Trans></h3>
                  <p className="leading-relaxed">
                    {/* @ts-ignore */}<Trans>Saat terjadi gangguan jaringan atau timeout, Anda mungkin mengirim ulang request mutasi stok atau penjualan. Untuk mencegah pengurangan stok ganda, sertakan header `Idempotency-Key` (UUID v4 unik) pada setiap request `POST /purchases` atau `POST /sales`. Jika request dengan kunci yang sama dikirim ulang dalam waktu 24 jam, Inventra akan mengembalikan respons sukses sebelumnya tanpa memotong ulang stok barang.</Trans></p>
                  <div className="p-3 bg-slate-900 text-blue-300 font-mono text-xs rounded-xl border border-slate-800">
                    {/* @ts-ignore */}<Trans>Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000</Trans></div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-4">{/* @ts-ignore */}<Trans>Tabel Kode Error Bisnis Standar</Trans></h3>
                  <p className="text-sm">
                    {/* @ts-ignore */}<Trans>Daftar kode `error_code` khusus yang dikembalikan dalam payload JSON apabila terjadi validasi aturan bisnis atau batasan kuota tier langganan:</Trans></p>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-4 py-3">{/* @ts-ignore */}<Trans>error_code</Trans></th>
                          <th className="px-4 py-3">{/* @ts-ignore */}<Trans>HTTP Status</Trans></th>
                          <th className="px-4 py-3">{/* @ts-ignore */}<Trans>Penyebab / Solusi</Trans></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
                        <tr>
                          <td className="px-4 py-3 font-bold text-rose-500">{/* @ts-ignore */}<Trans>WAREHOUSE_LIMIT_REACHED</Trans></td>
                          <td className="px-4 py-3">{/* @ts-ignore */}<Trans>403 Forbidden</Trans></td>
                          <td className="px-4 py-3 font-sans text-slate-500">{/* @ts-ignore */}<Trans>Batas maksimal gudang untuk paket tier Anda telah tercapai. Silakan upgrade paket ke Professional / Enterprise.</Trans></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-rose-500">{/* @ts-ignore */}<Trans>PLAN_FEATURE_RESTRICTED</Trans></td>
                          <td className="px-4 py-3">{/* @ts-ignore */}<Trans>403 Forbidden</Trans></td>
                          <td className="px-4 py-3 font-sans text-slate-500">{/* @ts-ignore */}<Trans>Fitur (mis. AI Forecasting, Webhook) tidak aktif pada paket tier saat ini atau add-on belum aktif.</Trans></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-amber-500">{/* @ts-ignore */}<Trans>OUT_OF_STOCK</Trans></td>
                          <td className="px-4 py-3">{/* @ts-ignore */}<Trans>400 Bad Request</Trans></td>
                          <td className="px-4 py-3 font-sans text-slate-500">{/* @ts-ignore */}<Trans>Kuantitas stok barang pada lokasi gudang terkait tidak mencukupi untuk melakukan transaksi penjualan OUT.</Trans></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-amber-500">{/* @ts-ignore */}<Trans>BATCH_EXPIRED</Trans></td>
                          <td className="px-4 py-3">{/* @ts-ignore */}<Trans>400 Bad Request</Trans></td>
                          <td className="px-4 py-3 font-sans text-slate-500">{/* @ts-ignore */}<Trans>Nomor batch barang yang dipilih telah melewati tanggal kedaluwarsa dan tidak dapat dikeluarkan dari gudang.</Trans></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-purple-500">{/* @ts-ignore */}<Trans>IDEMPOTENCY_CONFLICT</Trans></td>
                          <td className="px-4 py-3">{/* @ts-ignore */}<Trans>409 Conflict</Trans></td>
                          <td className="px-4 py-3 font-sans text-slate-500">{/* @ts-ignore */}<Trans>Idempotency-Key yang dikirim sedang dalam proses pengolahan oleh transaksi lain.</Trans></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Step 7: Sandbox Testing & Go-Live */}
              {activeStep.slug === '7-sandbox-testing' && (
                <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    {/* @ts-ignore */}<Trans>Sebelum menghubungkan sistem ke database produksi live, Anda sangat disarankan untuk melakukan pengujian integrasi di lingkungan</Trans><strong>{/* @ts-ignore */}<Trans>Sandbox API</Trans></strong> {/* @ts-ignore */}<Trans>(`https://sandbox-api.inventra.id/v1`).</Trans></p>

                  <EndpointCard
                    method="POST"
                    path="/api/v1/sandbox/reset"
                    title="Reset Data Sandbox ke Kondisi Awal"
                    description="Mengosongkan seluruh transaksi uji coba (Sales/Purchases) dan mereset stok ke saldo seeder awal pada environment sandbox."
                    tier="Professional"
                    snippetTabs={[
                      {
                        id: 'curl',
                        label: 'cURL',
                        code: `curl -X POST "https://sandbox-api.inventra.id/v1/sandbox/reset" \\
  -H "X-Inventra-Key: inv_sandbox_test_123"`
                      },
                      {
                        id: 'json',
                        label: 'JSON Response (200 OK)',
                        code: `{ "status": true, "message": "Sandbox environment reset to clean state successfully." }`
                      }
                    ]}
                  />

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-4">{/* @ts-ignore */}<Trans>Checklist Go-Live Production</Trans></h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 dark:text-white block">{/* @ts-ignore */}<Trans>Ganti API Key Sandbox dengan Live Key</Trans></strong>
                        <span className="text-slate-500 text-xs">{/* @ts-ignore */}<Trans>Pastikan skrip produksi Anda menggunakan prefix `inv_live_` dan mengarah ke base URL HTTPS resmi.</Trans></span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 dark:text-white block">{/* @ts-ignore */}<Trans>Aktifkan Idempotency-Key</Trans></strong>
                        <span className="text-slate-500 text-xs">{/* @ts-ignore */}<Trans>Sertakan header UUID v4 pada seluruh request mutasi barang untuk proteksi saat gangguan jaringan.</Trans></span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                      <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 dark:text-white block">{/* @ts-ignore */}<Trans>Pemeriksaan Kapasitas Gudang & Tier Langganan</Trans></strong>
                        <span className="text-slate-500 text-xs">{/* @ts-ignore */}<Trans>Pastikan tier langganan (Professional / Enterprise) telah aktif jika Anda membutuhkan lebih dari 1 lokasi gudang atau fitur webhook.</Trans></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 8: Changelog & Versioning */}
              {activeStep.slug === '8-changelog-versioning' && (
                <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{/* @ts-ignore */}<Trans>Kebijakan Versi API (`v1`)</Trans></h3>
                  <p>
                    {/* @ts-ignore */}<Trans>Inventra berkomitmen menjaga stabilitas integrasi jangka panjang. Versi API saat ini adalah `v1.0` yang tersemat pada path URL dasar (`/v1/...`).</Trans></p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                    <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm mb-2">{/* @ts-ignore */}<Trans>Non-Breaking Changes (Otomatis Diterapkan)</Trans></h4>
                      <ul className="list-disc pl-5 text-xs space-y-1 text-emerald-800 dark:text-emerald-400">
                        <li>{/* @ts-ignore */}<Trans>Penambahan field baru opsional pada JSON response.</Trans></li>
                        <li>{/* @ts-ignore */}<Trans>Penambahan endpoint atau modul API baru.</Trans></li>
                        <li>{/* @ts-ignore */}<Trans>Penambahan parameter query baru yang bersifat opsional.</Trans></li>
                      </ul>
                    </div>
                    <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60">
                      <h4 className="font-bold text-rose-900 dark:text-rose-300 text-sm mb-2">{/* @ts-ignore */}<Trans>Breaking Changes (Membutuhkan Versi Baru / `v2`)</Trans></h4>
                      <ul className="list-disc pl-5 text-xs space-y-1 text-rose-800 dark:text-rose-400">
                        <li>{/* @ts-ignore */}<Trans>Penghapusan atau penggantian nama field JSON eksisting.</Trans></li>
                        <li>{/* @ts-ignore */}<Trans>Perubahan tipe data field (mis. string angka menjadi integer murni).</Trans></li>
                        <li>{/* @ts-ignore */}<Trans>Penambahan parameter request yang bersifat wajib (`required`).</Trans></li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500">
                    <strong className="text-slate-900 dark:text-white block mb-1">{/* @ts-ignore */}<Trans>Changelog v1.0 (Juli 2026)</Trans></strong>
                    {/* @ts-ignore */}<Trans>Rilis perdana API v1.0 yang mendukung 7 modul bisnis penuh, kontrol kapasitas gudang berbasis tier, dan proteksi Idempotency-Key.</Trans></div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-8 mt-12 border-t border-slate-100 dark:border-slate-800">
                {prevStep ? (
                  <button
                    type="button"
                    onClick={() => handleStepClick(prevStep.slug)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{prevStep.shortTitle}</span>
                  </button>
                ) : <div />}

                {nextStep ? (
                  <button
                    type="button"
                    onClick={() => handleStepClick(nextStep.slug)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition-all ml-auto"
                  >
                    <span>{/* @ts-ignore */}<Trans>Lanjut:</Trans>{nextStep.shortTitle}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href="/dashboard/settings/billing"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/30 transition-all ml-auto"
                  >
                    <span>{/* @ts-ignore */}<Trans>Kelola Langganan & API Key</Trans></span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
