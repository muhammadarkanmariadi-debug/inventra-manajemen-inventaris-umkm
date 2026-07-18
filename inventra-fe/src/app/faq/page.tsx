'use client';

import React, { useState, useMemo } from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';
import { FAQAccordion, FAQItem } from '@/components/faq/FAQAccordion';
import { Search, HelpCircle, MessageSquareText, BookOpen, X, Sparkles, Filter } from 'lucide-react';
import Link from 'next/link';
import { Trans } from "@lingui/macro";

const FAQ_DATA: FAQItem[] = [
  // 1. Umum & Produk
  {
    id: 'general-1',
    category: 'general',
    categoryLabel: 'Umum & Produk',
    question: 'Apa itu Inventra dan siapa yang cocok menggunakannya?',
    answer: (
      <p>
        <strong>{/* @ts-ignore */}<Trans>Inventra</Trans></strong> {/* @ts-ignore */}<Trans>adalah platform sistem informasi manajemen inventaris dan Enterprise Resource Planning (ERP) mini berbasis cloud yang didesain khusus untuk UMKM, distributor, dan bisnis ritel di Indonesia. Inventra sangat cocok digunakan baik oleh toko tunggal maupun perusahaan dengan puluhan cabang gudang operasional.</Trans></p>
    ),
  },
  {
    id: 'general-2',
    category: 'general',
    categoryLabel: 'Umum & Produk',
    question: 'Apakah saya perlu menginstal software khusus di komputer atau server?',
    answer: (
      <p>
        {/* @ts-ignore */}<Trans>Tidak perlu. Inventra berbasis</Trans><em>{/* @ts-ignore */}<Trans>Software as a Service (SaaS)</Trans></em> {/* @ts-ignore */}<Trans>modern yang sepenuhnya diakses melalui web browser dari laptop, tablet, maupun smartphone (Safari, Chrome, Firefox) tanpa instalasi rumit ataupun perawatan server lokal.</Trans></p>
    ),
  },
  {
    id: 'general-3',
    category: 'general',
    categoryLabel: 'Umum & Produk',
    question: 'Bisakah Inventra digunakan oleh tim dengan peran dan tugas yang berbeda?',
    answer: (
      <p>
        {/* @ts-ignore */}<Trans>Tentu. Inventra dilengkapi sistem</Trans><strong>{/* @ts-ignore */}<Trans>Role-Based Access Control (RBAC)</Trans></strong> {/* @ts-ignore */}<Trans>yang sangat granular. Anda dapat mengatur hak akses spesifik untuk posisi Owner, Admin Gudang, Kasir, hingga staf Quality Control (QC) agar setiap tim hanya mengakses fitur yang relevan dengan tanggung jawabnya.</Trans></p>
    ),
  },

  // 2. Pricing & Billing
  {
    id: 'billing-1',
    category: 'billing',
    categoryLabel: 'Pricing & Billing',
    question: 'Bagaimana cara kerja sistem pricing tier di Inventra?',
    answer: (
      <div>
        <p className="mb-2">
          {/* @ts-ignore */}<Trans>Pricing Inventra didasarkan pada skala operasional dan kapasitas jumlah gudang Anda:</Trans></p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>{/* @ts-ignore */}<Trans>Starter (Rp 199.000/bln):</Trans></strong> {/* @ts-ignore */}<Trans>Untuk toko tunggal dengan batas maksimal 1 lokasi gudang.</Trans></li>
          <li><strong>{/* @ts-ignore */}<Trans>Professional (Rp 499.000/bln):</Trans></strong> {/* @ts-ignore */}<Trans>Untuk bisnis berkembang dengan dukungan hingga 5 lokasi gudang serta alur QC lengkap.</Trans></li>
          <li><strong>{/* @ts-ignore */}<Trans>Enterprise:</Trans></strong> {/* @ts-ignore */}<Trans>Kapasitas gudang kustom tanpa batas beserta seluruh fitur analitik AI & integrasi ERP.</Trans></li>
        </ul>
      </div>
    ),
  },
  {
    id: 'billing-2',
    category: 'billing',
    categoryLabel: 'Pricing & Billing',
    question: 'Apakah ada biaya tambahan atau batasan untuk penambahan SKU produk?',
    answer: (
      <p>
        <strong>{/* @ts-ignore */}<Trans>Tidak ada biaya tersembunyi.</Trans></strong> {/* @ts-ignore */}<Trans>Semua tier paket Inventra (termasuk Starter) mendukung penambahan data SKU produk dan pencatatan transaksi mutasi barang tanpa batas kuota item.</Trans></p>
    ),
  },
  {
    id: 'billing-3',
    category: 'billing',
    categoryLabel: 'Pricing & Billing',
    question: 'Bagaimana jika bisnis saya berkembang dan butuh lebih dari 5 gudang?',
    answer: (
      <p>
        {/* @ts-ignore */}<Trans>Anda dapat melakukan upgrade kapan saja ke paket</Trans><strong>{/* @ts-ignore */}<Trans>Enterprise</Trans></strong> {/* @ts-ignore */}<Trans>untuk kuota gudang tanpa batas serta integrasi ERP tingkat lanjut langsung melalui halaman</Trans><Link href="/pricing" className="text-blue-500 font-semibold underline">{/* @ts-ignore */}<Trans>/pricing</Trans></Link> {/* @ts-ignore */}<Trans>atau menu</Trans><Link href="/dashboard/settings/billing" className="text-blue-500 font-semibold underline">{/* @ts-ignore */}<Trans>Langganan (/dashboard/settings/billing)</Trans></Link> {/* @ts-ignore */}<Trans>di dashboard.</Trans></p>
    ),
  },
  {
    id: 'billing-4',
    category: 'billing',
    categoryLabel: 'Pricing & Billing',
    question: 'Metode pembayaran apa saja yang didukung oleh Inventra?',
    answer: (
      <p>
        {/* @ts-ignore */}<Trans>Kami menerima pembayaran otomatis dan instan melalui transfer Virtual Account (BCA, Mandiri, BNI, BRI), e-Wallet (QRIS, GoPay, OVO), serta kartu kredit/debit jaringan Visa & Mastercard.</Trans></p>
    ),
  },

  // 3. Integrasi API & ERP
  {
    id: 'api-1',
    category: 'api',
    categoryLabel: 'Integrasi API & ERP',
    question: 'Apakah Inventra menyediakan REST API untuk integrasi sistem eksternal?',
    answer: (
      <p>
        {/* @ts-ignore */}<Trans>Ya! Untuk paket Enterprise atau pengguna yang mengaktifkan Add-on</Trans><strong>{/* @ts-ignore */}<Trans>ERP Integration API</Trans></strong>{/* @ts-ignore */}<Trans>, Inventra menyediakan RESTful API lengkap (Katalog Produk, Stok Real-time, Mutasi, dan Webhook) yang terdokumentasi bertahap di</Trans><Link href="/docs/0-overview" className="text-blue-500 font-semibold underline">{/* @ts-ignore */}<Trans>Overview & Arsitektur (/docs/0-overview)</Trans></Link> {/* @ts-ignore */}<Trans>serta</Trans><Link href="/docs/4-referensi-endpoint" className="text-blue-500 font-semibold underline">{/* @ts-ignore */}<Trans>Referensi Endpoint (/docs/4-referensi-endpoint)</Trans></Link>.
      </p>
    ),
  },
  {
    id: 'api-2',
    category: 'api',
    categoryLabel: 'Integrasi API & ERP',
    question: 'Bagaimana cara mendapatkan dan mengelola API Key?',
    answer: (
      <p>
        {/* @ts-ignore */}<Trans>Setelah paket atau add-on API aktif, Anda dapat membuat rahasia API Key langsung di dashboard pada menu</Trans><Link href="/account/settings" className="text-blue-500 font-semibold underline">{/* @ts-ignore */}<Trans>Pengaturan -&gt; Developer & Akses API</Trans></Link>{/* @ts-ignore */}<Trans>. Gunakan header</Trans><code>{/* @ts-ignore */}<Trans>X-Inventra-Key</Trans></code> {/* @ts-ignore */}<Trans>saat melakukan request. Pelajari panduan lengkapnya di</Trans><Link href="/docs/1-kredensial-api" className="text-blue-500 font-semibold underline">{/* @ts-ignore */}<Trans>Step 1: Kredensial API</Trans></Link>.
      </p>
    ),
  },
  {
    id: 'api-3',
    category: 'api',
    categoryLabel: 'Integrasi API & ERP',
    question: 'Apakah webhook Inventra mendukung otomatisasi pengiriman ulang (retry) jika server down?',
    answer: (
      <p>
        {/* @ts-ignore */}<Trans>Ya. Sistem webhook kami dilengkapi mekanisme</Trans><strong>{/* @ts-ignore */}<Trans>Exponential Backoff Retry</Trans></strong> {/* @ts-ignore */}<Trans>hingga 5 kali percobaan apabila endpoint webhook yang Anda daftarkan mengembalikan status HTTP error (5xx atau timeout). Lihat detail event dan HMAC verification di</Trans><Link href="/docs/5-webhook-event" className="text-blue-500 font-semibold underline">{/* @ts-ignore */}<Trans>Step 5: Webhook & Event Notifications</Trans></Link>.
      </p>
    ),
  },

  // 4. Keamanan & Kepatuhan
  {
    id: 'security-1',
    category: 'security',
    categoryLabel: 'Keamanan & Kepatuhan',
    question: 'Bagaimana jaminan keamanan data inventaris dan kepatuhan standar sistem?',
    answer: (
      <p>
        {/* @ts-ignore */}<Trans>Inventra menerapkan standar keamanan kelas enterprise. Transmisi data diamankan dengan protokol enkripsi SSL/TLS 1.3, penyimpanan database dienkripsi menggunakan AES-256, serta dilakukan isolasi data multi-tenant secara logis untuk mencegah kebocoran antar bisnis.</Trans></p>
    ),
  },
  {
    id: 'security-2',
    category: 'security',
    categoryLabel: 'Keamanan & Kepatuhan',
    question: 'Bisakah saya melakukan ekspor dan mencadangkan (backup) data bisnis secara mandiri?',
    answer: (
      <p>
        {/* @ts-ignore */}<Trans>Tentu saja. Anda memiliki kendali penuh atas data bisnis Anda. Seluruh riwayat mutasi stok, laporan penjualan, pembelian, serta katalog produk dapat diekspor ke format Excel (</Trans><code>{/* @ts-ignore */}<Trans>.xlsx</Trans></code>{/* @ts-ignore */}<Trans>) dan PDF kapan pun melalui dashboard.</Trans></p>
    ),
  },

  // 5. Troubleshooting & Solusi
  {
    id: 'troubleshooting-1',
    category: 'troubleshooting',
    categoryLabel: 'Troubleshooting & Solusi',
    question: 'Mengapa QR/Barcode Scanner tidak dapat memindai kamera di perangkat saya?',
    answer: (
      <div>
        <p className="mb-2">{/* @ts-ignore */}<Trans>Jika kamera scanner tidak aktif, lakukan langkah pengecekan berikut:</Trans></p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>{/* @ts-ignore */}<Trans>Pastikan browser Anda (Safari / Chrome) telah diberikan izin (permission) untuk mengakses kamera di pengaturan perangkat.</Trans></li>
          <li>{/* @ts-ignore */}<Trans>Pastikan Anda mengakses portal Inventra melalui protokol aman</Trans><code>{/* @ts-ignore */}<Trans>https://</Trans></code>.</li>
          <li>{/* @ts-ignore */}<Trans>Pastikan pencahayaan sekitar cukup terang untuk membaca detail kode QR produk.</Trans></li>
        </ol>
      </div>
    ),
  },
  {
    id: 'troubleshooting-2',
    category: 'troubleshooting',
    categoryLabel: 'Troubleshooting & Solusi',
    question: 'Bagaimana cara menangani selisih antara stok sistem dengan fisik gudang (stock discrepancy)?',
    answer: (
      <p>
        {/* @ts-ignore */}<Trans>Jika terjadi selisih saat stock opname, gunakan fitur</Trans><strong>{/* @ts-ignore */}<Trans>Penyesuaian Stok (Stock Adjustment)</Trans></strong> {/* @ts-ignore */}<Trans>di dashboard. Anda dapat mencatat penyesuaian kuantitas beserta alasan, catatan opname, dan bukti hasil Quality Control (QC) agar riwayat audit inventaris tetap akurat.</Trans></p>
    ),
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Semua Pertanyaan' },
  { id: 'general', label: 'Umum & Produk' },
  { id: 'billing', label: 'Pricing & Billing' },
  { id: 'api', label: 'Integrasi API & ERP' },
  { id: 'security', label: 'Keamanan & Kepatuhan' },
  { id: 'troubleshooting', label: 'Troubleshooting & Solusi' },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>(['general-1']);
  const [isMultiOpen, setIsMultiOpen] = useState<boolean>(true);

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return FAQ_DATA.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.categoryLabel.toLowerCase().includes(query) ||
        (typeof item.answer === 'string' && item.answer.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleToggle = (id: string) => {
    if (isMultiOpen) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  const handleOpenChatbot = () => {
    window.dispatchEvent(new Event('open-chatbot'));
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground font-outfit selection:bg-brand-500/20 selection:text-brand-500">
      <LandingHeader />
      <ChatbotWidget />

      <main className="pt-28 pb-24 px-6 lg:px-8 max-w-screen-xl mx-auto">
        {/* Hero & Search Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-semibold uppercase tracking-wider mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            {/* @ts-ignore */}<Trans>Pusat Bantuan & Tanya Jawab</Trans></div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-6">
            {/* @ts-ignore */}<Trans>Frequently Asked</Trans><span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent italic">{/* @ts-ignore */}<Trans>Questions</Trans></span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
            {/* @ts-ignore */}<Trans>Temukan jawaban cepat seputar fitur Inventra, paket langganan, integrasi API ekstensif, hingga panduan pemecahan masalah operasional.</Trans></p>

          {/* Real-time Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan, topik (mis. pricing, gudang, API, scanner)..."
              className="w-full pl-12 pr-11 py-4 rounded-2xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-base shadow-xl transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Tabs & Accordion Options */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 flex items-center gap-2 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                      : 'bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
            <span className="text-xs text-slate-400">{/* @ts-ignore */}<Trans>Buka Banyak Sekaligus:</Trans></span>
            <button
              type="button"
              onClick={() => setIsMultiOpen(!isMultiOpen)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isMultiOpen ? 'bg-brand-600' : 'bg-muted'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isMultiOpen ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto mb-20">
          <FAQAccordion
            items={filteredItems}
            openIds={openIds}
            onToggle={handleToggle}
            showCategoryLabel={searchQuery.trim().length > 0 || selectedCategory === 'all'}
          />
        </div>

        {/* FAQ Support Footer Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-background border border-border p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 max-w-xl mx-auto">
            <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-500 mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
              {/* @ts-ignore */}<Trans>Tidak Menemukan Jawaban yang Anda Cari?</Trans></h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
              {/* @ts-ignore */}<Trans>Tim support teknis dan asisten AI Inventra siap membantu Anda 24/7. Anda juga dapat menelusuri panduan integrasi sistem langsung di portal dokumentasi teknis kami.</Trans></p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleOpenChatbot}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 transition-all active:scale-95"
              >
                <MessageSquareText className="w-4 h-4" />
                <span>{/* @ts-ignore */}<Trans>Chat AI Support 24/7</Trans></span>
              </button>
              <Link
                href="/docs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent hover:bg-accent/80 border border-border text-foreground font-semibold text-sm transition-all"
              >
                <BookOpen className="w-4 h-4 text-brand-500" />
                <span>{/* @ts-ignore */}<Trans>Dokumentasi API (/docs)</Trans></span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
