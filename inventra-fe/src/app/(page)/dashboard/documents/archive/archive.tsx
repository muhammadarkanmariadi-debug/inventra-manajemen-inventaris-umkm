'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getDocuments,
  deleteDocument,
  DocumentRecord,
} from '../../../../../../services/document.service';
import { API_URL } from '../../../../../../global';
import {
  FileTextIcon,
  DownloadIcon,
  TrashIcon,
  Loader2Icon,
  FilterIcon,
  CalendarIcon,
} from 'lucide-react';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Pagination from '@/components/tables/Pagination';

const typeLabels: Record<string, string> = {
  LPB: 'Laporan Pergerakan Barang',
  BAR: 'Berita Acara Reject',
  SJ: 'Surat Jalan',
  LBB: 'Laporan Barang Bermasalah',
  LRS: 'Laporan Rekap Stok',
};

const typeColors: Record<string, "info" | "error" | "success" | "warning" | "primary"> = {
  LPB: 'info',
  BAR: 'error',
  SJ: 'success',
  LBB: 'warning',
  LRS: 'primary',
};

export default function DocumentArchivePage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getDocuments(page, 10, filterType || undefined);
      if (res.status && res.data) {
        setDocuments(res.data.data || []);
        setLastPage(res.data.last_page);
        setTotal(res.data.total);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat dokumen');
    } finally {
      setIsLoading(false);
    }
  }, [page, filterType]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus dokumen ini? File PDF akan dihapus dari server.')) return;
    setDeletingId(id);
    try {
      const res = await deleteDocument(id);
      if (res.status) {
        toast.success('Dokumen berhasil dihapus');
        fetchDocuments();
      } else {
        toast.error(res.message || 'Gagal menghapus');
      }
    } catch {
      toast.error('Gagal menghapus dokumen');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (doc: DocumentRecord) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    const url = `${API_URL}/documents/${doc.id}/download`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.click();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <PageBreadcrumb pageTitle="Arsip Dokumen" />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200
              focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none
              appearance-none cursor-pointer"
          >
            <option value="">Semua Tipe</option>
            <option value="LPB">Laporan Pergerakan Barang</option>
            <option value="BAR">Berita Acara Reject</option>
            <option value="SJ">Surat Jalan</option>
            <option value="LBB">Laporan Barang Bermasalah</option>
            <option value="LRS">Laporan Rekap Stok</option>
          </select>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <FileTextIcon className="w-4 h-4" />
          Total: {total} dokumen
        </div>
      </div>

      {/* Table */}
      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">No. Dokumen</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Tipe</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Judul</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Dibuat</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">Aksi</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center" colSpan={5}>
                      <div className="flex justify-center">
                        <Loader2Icon className="w-8 h-8 text-brand-500 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : documents.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-12 text-center text-gray-400 dark:text-gray-500" colSpan={5}>
                      <div className="flex flex-col items-center justify-center">
                        <FileTextIcon className="w-12 h-12 mb-3" />
                        <p className="text-sm">Belum ada dokumen yang dibuat</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="px-5 py-4 text-start font-mono text-sm font-semibold text-gray-900 dark:text-white">
                        {doc.document_number}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge variant="light" color={typeColors[doc.type] as any || 'light'}>
                          {typeLabels[doc.type] || doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-sm text-gray-700 dark:text-gray-300">
                        {doc.title}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {new Date(doc.created_at).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-2 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                            title="Download"
                          >
                            <DownloadIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={deletingId === doc.id}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                            title="Hapus"
                          >
                            {deletingId === doc.id ? (
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                              <TrashIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {lastPage > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination currentPage={page} totalPages={lastPage} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
