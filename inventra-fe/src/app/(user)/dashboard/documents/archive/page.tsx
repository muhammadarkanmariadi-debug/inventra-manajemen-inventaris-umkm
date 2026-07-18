'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getDocuments,
  deleteDocument,
  downloadDocument,
  DocumentRecord,
} from '../../../../../../services/document.service';

import {
  FileTextIcon,
  DownloadIcon,
  TrashIcon,
  Loader2Icon,
  FilterIcon,
  CalendarIcon,
} from 'lucide-react';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { Can } from '@/components/common/Can';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import { useTranslate } from '@/hooks/useTranslate';
import Pagination from '@/components/tables/Pagination';
import { exportToExcel } from '@/utils/exportExcel';
import { FilterBar, FilterValues, FilterBarProps } from '@/components/common/FilterBar';
import { Trans } from '@lingui/react';

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
  const { _ } = useTranslate();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const filterConfig: Required<Pick<FilterBarProps, "tabs" | "selects" | "dateRanges" | "sorts" | "searchPlaceholder">> = {
    tabs: [
      { label: _("Semua Tipe"), value: "" },
      { label: _("Laporan Pergerakan Barang (LPB)"), value: "LPB" },
      { label: _("Berita Acara Reject (BAR)"), value: "BAR" },
      { label: _("Surat Jalan (SJ)"), value: "SJ" },
      { label: _("Laporan Barang Bermasalah (LBB)"), value: "LBB" },
      { label: _("Laporan Rekap Stok (LRS)"), value: "LRS" },
    ],
    selects: [],
    dateRanges: [
      { label: _("Tanggal Dibuat"), key: "date" }
    ],
    sorts: [
      {
        label: _("Urutkan"),
        key: "sort",
        options: [
          { label: _("Waktu Dibuat (Baru)"), value: "created_at", direction: "desc" },
          { label: _("Waktu Dibuat (Lama)"), value: "created_at", direction: "asc" },
          { label: _("Nomor Dokumen (A-Z)"), value: "document_number", direction: "asc" },
          { label: _("Nomor Dokumen (Z-A)"), value: "document_number", direction: "desc" },
        ],
      },
    ],
    searchPlaceholder: _("Cari nomor atau judul dokumen..."),
  };

  const handleFilterChange = useCallback((vals: FilterValues) => {
    setFilters(vals);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("page");
      if (p && !isNaN(Number(p))) {
        setPage(Number(p));
      } else {
        setPage(1);
      }
    } else {
      setPage(1);
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(newPage));
      window.history.pushState({}, '', url.toString());
    }
  };

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const extraParams: Record<string, any> = {};
      if (filters?.search) extraParams.search = filters.search;
      if (filters?.dateRanges?.['date']?.from && filters?.dateRanges?.['date']?.to) {
        extraParams.from = filters.dateRanges['date'].from;
        extraParams.to = filters.dateRanges['date'].to;
      }
      if (filters?.sorts?.['sort'] && filters.sorts['sort'].value) {
        extraParams.sort = filters.sorts['sort'].value;
        extraParams.order = filters.sorts['sort'].direction || 'desc';
      }

      const typeParam = filters?.tab ? filters.tab : undefined;
      const res = await getDocuments(page, itemsPerPage, typeParam, extraParams);
      if (res.status && res.data) {
        setDocuments(res.data.data || []);
        setLastPage(res.data.last_page);
        setTotal(res.data.total);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error(err);
      toast.error(_('Gagal memuat dokumen'));
    } finally {
      setIsLoading(false);
    }
  }, [page, itemsPerPage, filters, _]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: number) => {
    if (!confirm(_('Hapus dokumen ini? File PDF akan dihapus dari server.'))) return;
    setDeletingId(id);
    try {
      const res = await deleteDocument(id);
      if (res.status) {
        toast.success(_('Dokumen berhasil dihapus'));
        fetchDocuments();
      } else {
        toast.error(res.message || _('Gagal menghapus'));
      }
    } catch {
      toast.error(_('Gagal menghapus dokumen'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (doc: DocumentRecord) => {
    setDownloadingId(doc.id);
    try {
      const blob = await downloadDocument(doc.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.document_number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(_('Dokumen berhasil diunduh'));
    } catch {
      toast.error(_('Gagal mengunduh dokumen'));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleExport = () => {
    const exportData = documents.map(doc => ({
      "No. Dokumen": doc.document_number,
      Tipe: typeLabels[doc.type] || doc.type,
      Judul: doc.title,
      Dibuat: new Date(doc.created_at).toLocaleString('id-ID')
    }));
    exportToExcel(exportData, 'Arsip_Dokumen');
  };

  return (
    <PermissionWrapper permission="Lihat Dokumen" breadcrumb="Arsip Dokumen">
    <div className="min-h-screen">
      {/* Header */}
      <PageBreadcrumb pageTitle="Arsip Dokumen" />

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <FilterBar {...filterConfig} onFilterChange={handleFilterChange} useUrlSync={true} />
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <FileTextIcon className="w-4 h-4" />
            <Trans id="Total:" /> {total} <Trans id="dokumen" />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            title="Export ke Excel"
          >
            <DownloadIcon className="w-4 h-4" /> <Trans id="Export Excel" />
          </button>
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
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="No. Dokumen" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Tipe" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Judul" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Dibuat" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"><Trans id="Aksi" /></TableCell>
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
                        <p className="text-sm"><Trans id="Belum ada dokumen yang dibuat" /></p>
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
                          {_(typeLabels[doc.type] || doc.type)}
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
                            disabled={downloadingId === doc.id}
                            className="p-2 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors disabled:opacity-50"
                            title="Download"
                          >
                            {downloadingId === doc.id ? (
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                              <DownloadIcon className="w-4 h-4" />
                            )}
                          </button>
                          <Can permission="Hapus Dokumen">
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
                          </Can>
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
          <Pagination currentPage={page} totalPages={lastPage} onPageChange={handlePageChange} itemsPerPage={itemsPerPage} onItemsPerPageChange={(limit) => { setItemsPerPage(limit); setPage(1); }} />
        </div>
      )}
    </div>
    </PermissionWrapper>
  );
}
