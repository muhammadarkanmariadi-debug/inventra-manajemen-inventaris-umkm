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
import Alert from '@/components/ui/alert/Alert';
import { getSales, createSale, deleteSale } from '../../../../../services/sale.service';
import { getInventories } from '../../../../../services/inventory.service';
import type { Sale, Inventory, CreateSalePayload } from '../../../../../types';
import { FilterBar, FilterValues } from '@/components/common/FilterBar';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { TrashIcon } from "lucide-react";

export default function Sales() {
  const { _ } = useLingui();
  const [sales, setSales] = useState<Sale[]>([]);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSale, setDeletingSale] = useState<Sale | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateSalePayload>({
    inventory_id: 0, quantity: 1, selling_price: 0
  });

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSales(currentPage);

      if (res.status) {
        setSales(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setSales([]);
        toast.error(res.message || _(msg`Gagal memuat data penjualan`));
      }
    } catch {
      toast.error(_(msg`Gagal memuat data penjualan`));
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchInventories = useCallback(async () => {
    try {
      const res = await getInventories({ status: 'READY', items: 200 });
      if (res.status) setInventories(res.data.data || []);
    } catch { }
  }, []);

  useEffect(() => { fetchSales(); }, [fetchSales]);
  useEffect(() => { fetchInventories(); }, [fetchInventories]);

  const resetForm = () => {
    setFormData({ inventory_id: 0, quantity: 1, selling_price: 0 });
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
        toast.success(_(msg`Penjualan berhasil ditambahkan`));
        setShowFormModal(false);
        resetForm();
        fetchSales();
      } else {
        toast.error(res.message || _(msg`Gagal menyimpan penjualan`));
      }
    } catch {
      toast.error(_(msg`Terjadi kesalahan saat menyimpan`));
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
        toast.success(_(msg`Penjualan berhasil dihapus`));
        setShowDeleteModal(false);
        setDeletingSale(null);
        fetchSales();
      } else {
        toast.error(res.message || _(msg`Gagal menghapus penjualan`));
      }
    } catch {
      toast.error(_(msg`Terjadi kesalahan saat menghapus`));
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const filterConfig = {
    selects: [
      {
        label: _(msg`Urutkan`),
        key: 'sort',
        options: [
          { label: _(msg`Default (Terbaru)`), value: 'default' },
          { label: _(msg`Total Terbesar`), value: 'highest_total' }
        ]
      }
    ],
    searchPlaceholder: _(msg`Cari penjualan berdasarkan produk...`),
  };

  let filteredSales = sales.filter(sale => 
    sale.product?.name.toLowerCase().includes((filters?.search || '').toLowerCase())
  );

  if (filters?.selects?.['sort']) {
    const sortValue = filters.selects['sort'];
    filteredSales = [...filteredSales].sort((a, b) => {
      if (sortValue === 'highest_total') return b.total_price - a.total_price;
      return 0;
    });
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={_(msg`Penjualan`)} />

      
      <div className='flex flex-col gap-4 mb-4'>
        <FilterBar {...filterConfig} onFilterChange={setFilters} />
        <div className="flex justify-end">
          <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah Penjualan" /></Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Produk" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Qty</TableCell>
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
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{sale.quantity}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatCurrency(sale.selling_price)}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatCurrency(sale.total_price)}</TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openDeleteModal(sale)} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400" title="Hapus"><TrashIcon className="w-4 h-4" /></button>
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

      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
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
              options={inventories.map((inv) => ({ value: String(inv.id), label: `${inv.product?.name || 'Unknown'} - Batch: ${inv.inventory_code} (${_(msg`Stok`)}: ${inv.quantity})` }))}
              placeholder={_(msg`Pilih batch produk`)}
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
              <Input type="number" placeholder="0" defaultValue={formData.selling_price} onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })} />
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
    </div>
  );
}
