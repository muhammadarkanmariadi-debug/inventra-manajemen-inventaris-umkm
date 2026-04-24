"use client";

import React, { useEffect, useState } from "react";
import { t } from "@lingui/macro";
import { toast } from "sonner";
import { Plus, PencilIcon, TrashIcon, Building2 } from "lucide-react";

interface Business {
  id: string;
  name: string;
  owner: string;
  status: "ACTIVE" | "INACTIVE";
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate an API fetch
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Dummy data for example
        const data: Business[] = [
          { id: "1", name: "Toko Sembako Anugrah", owner: "Budi Santoso", status: "ACTIVE" },
          { id: "2", name: "Warung Kopi Senja", owner: "Siti Aminah", status: "ACTIVE" },
          { id: "3", name: "Depot Elektronik Maju", owner: "Agus Salim", status: "INACTIVE" },
        ];
        
        setBusinesses(data);
      } catch (err) {
        setError(t`Gagal memuat data bisnis`);
        toast.error(t`Gagal memuat data bisnis`);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const handleDelete = (id: string) => {
    setBusinesses(businesses.filter((b) => b.id !== id));
    toast.success(t`Bisnis berhasil dihapus`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {t`Manajemen Bisnis`}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t`Kelola semua penyewa SaaS dan bisnis yang terdaftar.`}
          </p>
        </div>
        <button className="flex items-center px-4 py-2 font-medium text-white transition-colors rounded-lg bg-brand-500 hover:bg-brand-600 gap-2">
          <Plus className="w-5 h-5" />
          {t`Tambah Bisnis`}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Building2 className="w-8 h-8 mx-auto mb-4 animate-pulse opacity-50" />
            <p>{t`Memuat data bisnis...`}</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-4 font-medium">{t`Nama Bisnis`}</th>
                  <th className="px-6 py-4 font-medium">{t`Pemilik`}</th>
                  <th className="px-6 py-4 font-medium">{t`Status`}</th>
                  <th className="px-6 py-4 font-medium text-right">{t`Aksi`}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {businesses.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                      {business.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {business.owner}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        business.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {business.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-gray-400 hover:text-brand-500 transition-colors">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(business.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {businesses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      {t`Belum ada bisnis yang terdaftar.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
