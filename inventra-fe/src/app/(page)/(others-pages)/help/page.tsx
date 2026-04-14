"use client";

import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';

const faqs = [
  {
    question: "Bagaimana cara menambahkan stok baru?",
    answer: "Anda bisa menambahkan stok melalui menu Produk. Buka produk yang dimaksud, pilih Tambah Stok, lalu masukkan jumlah dan lokasi. Qr Code akan otomatis tercetak dari data tersebut."
  },
  {
    question: "Apa fungsi dari Status Inventaris (Ready, On Hold, Unreleased)?",
    answer: "Unreleased berarti stok belum disetujui (biasanya baru dibuat/discan). On Hold berarti stok sedang ditahan atau direview. Ready berarti stok siap digunakan atau ditransaksikan."
  },
  {
    question: "Bagaimana cara mengubah profil atau password?",
    answer: "Klik ikon foto profil Anda di pojok kanan atas, lalu pilih opsi 'Account settings'. Di sana Anda dapat memperbarui password."
  },
  {
    question: "Apakah bisa melakukan retur barang dari supplier?",
    answer: "Bisa, Anda bisa masuk ke halaman Transaksi, lalu mencatat pengeluaran barang dengan tipe OUT atau Retur dengan memberikan referensi pada catatan transaksi."
  }
];

export default function HelpPage() {
  const { _ } = useLingui();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle={_(msg`Bantuan & FAQ`)} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8 max-w-4xl mx-auto">
        <h3 className="mb-6 text-xl font-bold text-gray-800 dark:text-white/90 text-center">
          <Trans id="Pertanyaan yang Sering Diajukan" />
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8 text-sm">
          <Trans id="Temukan jawaban atas pertanyaan umum terkait manajemen Inventra UMKM." />
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex justify-between items-center"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-brand-50 dark:bg-brand-500/10 rounded-xl text-center border border-brand-100 dark:border-brand-500/20">
          <h4 className="text-brand-800 dark:text-brand-300 font-semibold mb-2"><Trans id="Masih butuh bantuan?" /></h4>
          <p className="text-brand-600 dark:text-brand-400 text-sm mb-4"><Trans id="Tim support kami siap membantu Anda menyelesaikan masalah apa pun." /></p>
          <button className="px-5 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition"><Trans id="Hubungi Support" /></button>
        </div>
      </div>
    </div>
  );
}
