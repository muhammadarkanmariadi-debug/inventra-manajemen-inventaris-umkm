'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Pagination from '@/components/tables/Pagination';
import Badge from '@/components/ui/badge/Badge';
import { getLogs } from '../../../../../services/log.service';
import type { Log } from '../../../../../types';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { DownloadIcon } from "lucide-react";
import Button from '@/components/ui/button/Button';
import { exportToExcel } from '@/utils/exportExcel';

export default function Logs() {
  const { _ } = useLingui();
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLogs(currentPage);

      if (res.status) {
        setLogs(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setLogs([]);
        toast.error(res.message || _(msg`Gagal memuat data log`));
      }
    } catch {
      toast.error(_(msg`Gagal memuat data log`));
    } finally {
      setLoading(false);
    }
  }, [currentPage, _]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (category: string) => {
    const map: Record<string, "info" | "success" | "warning" | "error" | "light"> = {
      'products': 'info',
      'categories': 'success',
      'sales': 'success',
      'purchases': 'warning',
      'users': 'error',
      'locations': 'light',
    };
    return map[category] || 'light';
  };

  const handleExport = () => {
    const exportData = logs.map(log => ({
      Waktu: formatDate(log.created_at),
      Pengguna: log.user?.username || 'Unknown',
      Kategori: log.categories,
      Pesan: log.message
    }));
    exportToExcel(exportData, 'Log_Event');
  };

  return (
    <PermissionWrapper permission="Lihat Log" breadcrumb="Log Event">
      <div className="flex justify-end mb-4">
        <Button size="sm" variant="outline" onClick={handleExport} className="flex items-center gap-2">
          <DownloadIcon className="w-4 h-4" /> <Trans id="Export Excel" />
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <Trans id="Waktu" />
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <Trans id="Pengguna" />
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <Trans id="Kategori" />
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    <Trans id="Pesan" />
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={4}>
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <Trans id="Memuat data..." />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={4}>
                      <Trans id="Tidak ada data log" />
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {log.user?.username || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge size="sm" color={getCategoryColor(log.categories)}>
                          {log.categories}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                        {log.message}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </PermissionWrapper>
  );
}
