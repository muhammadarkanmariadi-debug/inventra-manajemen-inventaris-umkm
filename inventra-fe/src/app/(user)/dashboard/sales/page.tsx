'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Pagination from '@/components/tables/Pagination';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import CurrencyInput from '@/components/form/input/CurrencyInput';
import Alert from '@/components/ui/alert/Alert';
import { getSales, createSale, deleteSale } from '../../../../../services/sale.service';
import { getInventories } from '../../../../../services/inventory.service';
import type { Sale, Inventory, CreateSalePayload } from '../../../../../types';
import { FilterBar, FilterValues } from '@/components/common/FilterBar';
import { useLingui } from '@lingui/react';
import { TrashIcon, DownloadIcon, TrendingUp } from "lucide-react";
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { Can } from '@/components/common/Can';
import { exportToExcel } from '@/utils/exportExcel';

export default function Sales() {
  const { _ } = useLingui();
  const [sales, setSales] = useState<Sale[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSale, setDeletingSale] = useState<Sale | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateSalePayload>({
    inventory_id: 0, quantity: 1, selling_price: 0,
    buyer_name: '', buyer_phone: '', buyer_address: ''
  });

  const handleFilterChange = useCallback((vals: FilterValues) => {
    setFilters(vals);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("page");
      if (p && !isNaN(Number(p))) {
        setCurrentPage(Number(p));
      } else {
        setCurrentPage(1);
      }
    } else {
      setCurrentPage(1);
    }
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(page));
      window.history.pushState({}, '', url.toString());
    }
  };

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams: Record<string, any> = {};
      if (filters?.search) queryParams.search = filters.search;
      const dateFrom = filters?.dateRanges?.['date']?.from || undefined;
      const dateTo = filters?.dateRanges?.['date']?.to || undefined;
      if (filters?.sorts?.['sort'] && filters.sorts['sort'].value) {
        queryParams.sort = filters.sorts['sort'].value;
        queryParams.order = filters.sorts['sort'].direction || 'desc';
      }

      const res = await getSales(currentPage, itemsPerPage, dateFrom, dateTo, queryParams);

      if (res.status) {
        setSales(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setSales([]);
        toast.error(res.message || _("Gagal memuat data penjualan"));
      }
    } catch {
      toast.error(_("Gagal memuat data penjualan"));
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filters, _]);

  const fetchInventories = useCallback(async () => {
    try {
      const res = await getInventories({ status: 'READY', items: 200 });
      if (res.status) setInventories(res.data.data || []);
    } catch { }
  }, []);

  useEffect(() => { fetchSales(); }, [fetchSales]);
  useEffect(() => { fetchInventories(); }, [fetchInventories]);

  const resetForm = () => {
    setFormData({ inventory_id: 0, quantity: 1, selling_price: 0, buyer_name: '', buyer_phone: '', buyer_address: '' });
  };

  const openCreateModal = () => { resetForm(); setShowFormModal(true); };

  const openDeleteModal = (sale: Sale) => { setDeletingSale(sale); setShowDeleteModal(true); };

  const handleInventoryChange = (invId: string) => {
    const inv = inventories.find((i) => i.id === Number(invId));
    setFormData((prev) => ({
      ...prev,
      inventory_id: Number(invId),
      selling_price: inv?.product?.selling_price || prev.selling_price,
    }));
  };

  const handleSubmit = async () => {

    setSubmitting(true);
    try {
      const res = await createSale(formData);

      if (res.status) {
        toast.success(_("Penjualan berhasil ditambahkan"));
        setShowFormModal(false);
        resetForm();
        fetchSales();
      } else {
        toast.error(res.message || _("Gagal menyimpan penjualan"));
      }
    } catch {
      toast.error(_("Terjadi kesalahan saat menyimpan"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSale) return;
    setSubmitting(true);
    try {
      const res = await deleteSale(deletingSale.id);
      if (res.status) {
        toast.success(_("Penjualan berhasil dihapus"));
        setShowDeleteModal(false);
        setDeletingSale(null);
        fetchSales();
      } else {
        toast.error(res.message || _("Gagal menghapus penjualan"));
      }
    } catch {
      toast.error(_("Terjadi kesalahan saat menghapus"));
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const filterConfig = {
    dateRanges: [
      {
        label: _("Tanggal Penjualan"),
        key: 'date',
      },
    ],
    sorts: [
      {
        label: _("Urutkan"),
        key: 'sort',
        options: [
          { label: _("Tanggal Terbaru"), value: "created_at", direction: "desc" as const },
          { label: _("Tanggal Terlama"), value: "created_at", direction: "asc" as const },
          { label: _("Jumlah Terbanyak"), value: "quantity", direction: "desc" as const },
          { label: _("Jumlah Sedikit"), value: "quantity", direction: "asc" as const },
          { label: _("Total Tertinggi"), value: "total_price", direction: "desc" as const },
          { label: _("Total Terendah"), value: "total_price", direction: "asc" as const },
        ],
      },
    ],
    searchPlaceholder: _("Cari penjualan berdasarkan produk atau pembeli..."),
  };

  let filteredSales = sales.filter(sale => 
    !filters?.search || (sale.product?.name || '').toLowerCase().includes(filters.search.toLowerCase()) || (sale.buyer_name || '').toLowerCase().includes(filters.search.toLowerCase())
  );

  const handleExport = () => {
    const exportData = filteredSales.map(sale => ({
      Produk: sale.product?.name || "-",
      Pembeli: sale.buyer_name || "-",
      "No. Telepon": sale.buyer_phone || "-",
      Qty: sale.quantity,
      "Harga Jual": sale.selling_price,
      "Total Harga": sale.total_price
    }));
    exportToExcel(exportData, 'Penjualan');
  };

  return (
    <PermissionWrapper permission="Lihat Penjualan" breadcrumb="Penjualan">

      
      <div className='flex flex-col gap-4 mb-4'>
        <FilterBar {...filterConfig} onFilterChange={handleFilterChange} useUrlSync={true} />
        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" /> <Trans id="Export Excel" />
          </Button>
          <Can permission="Tambah Penjualan">
            <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah Penjualan" /></Button>
          </Can>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Produk" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Pembeli" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{/* @ts-ignore */}<Trans>Qty</Trans></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Harga Jual" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Total Harga" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Aksi" /></TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={7}>
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                        <Trans id="Memuat data..." />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSales.length === 0 ? (
                  <TableRow><TableCell className="px-5 py-8 text-center text-gray-500"><Trans id="Tidak ada data penjualan" /></TableCell></TableRow>
                ) : (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{sale.product?.name || '-'}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <span className="text-gray-800 text-theme-sm dark:text-white/90">{sale.buyer_name || '-'}</span>
                        {sale.buyer_phone && <span className="block text-xs text-gray-400">{sale.buyer_phone}</span>}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{sale.quantity}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatCurrency(sale.selling_price)}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatCurrency(sale.total_price)}</TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div className="flex items-center gap-2">
                          <Can permission="Hapus Penjualan">
                            <button onClick={() => openDeleteModal(sale)} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400" title="Hapus"><TrashIcon className="w-4 h-4" /></button>
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

      {(totalPages > 1 || itemsPerPage !== 10) && (
        <div className="mt-4 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(limit) => {
              setItemsPerPage(limit);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} className="max-w-md p-6 lg:p-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          <Trans id="Tambah Penjualan" />
        </h4>
        <div className="space-y-4">
          <div>
            <Label><Trans id="Batch Produk" /></Label>
            <Select
              options={inventories.map((inv) => ({ value: String(inv.id), label: `${inv.product?.name || 'Unknown'} - Batch: ${inv.inventory_code} (${_("Stok")}: ${inv.quantity})` }))}
              placeholder={_("Pilih batch produk")}
              defaultValue={formData.inventory_id ? String(formData.inventory_id) : ''}
              onChange={handleInventoryChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label><Trans id="Jumlah" /></Label>
              <Input type="number" placeholder="1" defaultValue={formData.quantity} min="1" onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} />
            </div>
            <div>
              <Label><Trans id="Harga Jual" /></Label>
              <CurrencyInput
                placeholder="0"
                value={formData.selling_price}
                onChange={(val) => setFormData({ ...formData, selling_price: val })}
              />
            </div>
          </div>

          {/* Revenue Preview Card */}
          {(formData.quantity > 0 && formData.selling_price > 0) && (
            <div className="rounded-xl border border-success-200 bg-gradient-to-r from-success-50/80 via-white to-success-50/50 p-5 shadow-sm dark:border-success-500/20 dark:from-success-500/10 dark:via-gray-900 dark:to-success-500/5">
              <div className="flex items-center justify-between border-b border-success-100 pb-3 dark:border-success-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-500 text-white shadow-sm">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                      <Trans id="Estimasi Pendapatan (Revenue Preview)" />
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <Trans id="Kalkulasi estimasi pendapatan sebelum disimpan" />
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block"><Trans id="Kuantitas" /></span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">
                    {formData.quantity} <Trans id="unit" />
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block"><Trans id="Harga Satuan" /></span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">
                    {formatCurrency(formData.selling_price)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block"><Trans id="Total Pendapatan" /></span>
                  <span className="text-xl font-bold text-success-600 dark:text-success-400">
                    {formatCurrency(formData.quantity * formData.selling_price)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-white/10 pt-4 mt-2">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"><Trans id="Data Pembeli (Opsional)" /></h5>
            <div className="space-y-3">
              <div>
                <Label><Trans id="Nama Pembeli" /></Label>
                <Input type="text" placeholder={_("Nama pembeli")} defaultValue={formData.buyer_name} onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label><Trans id="No. Telepon" /></Label>
                  <Input type="text" placeholder={_("No. telepon")} defaultValue={formData.buyer_phone} onChange={(e) => setFormData({ ...formData, buyer_phone: e.target.value })} />
                </div>
                <div>
                  <Label><Trans id="Alamat" /></Label>
                  <Input type="text" placeholder={_("Alamat pembeli")} defaultValue={formData.buyer_address} onChange={(e) => setFormData({ ...formData, buyer_address: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}><Trans id="Batal" /></Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? <Trans id="Menyimpan..." /> : <Trans id="Simpan" />}</Button>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Hapus Penjualan" /></h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Trans id="Apakah Anda yakin ingin menghapus penjualan ini?" />
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(false)}><Trans id="Batal" /></Button>
          <Button size="sm" onClick={handleDelete} disabled={submitting} className="bg-error-500 hover:bg-error-600">
            {submitting ? <Trans id="Menghapus..." /> : <Trans id="Hapus" />}
          </Button>
        </div>
      </Modal>
    </PermissionWrapper>
  );
}
