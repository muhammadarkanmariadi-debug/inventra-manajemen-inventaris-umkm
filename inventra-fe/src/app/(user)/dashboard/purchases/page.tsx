"use client";
import { Trans } from "@lingui/macro";

import React, { useEffect, useState, useCallback } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Pagination from '@/components/tables/Pagination';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import CurrencyInput from '@/components/form/input/CurrencyInput';
import { showError, showSuccess } from '@/lib/toast';
import { getPurchases, createPurchase } from '../../../../../services/purchase.service';
import { getAllSuppliers } from '../../../../../services/supplier.service';
import { getProducts } from '../../../../../services/product.service';
import type {
  Purchase,
  Supplier,
  Product,
  CreatePurchasePayload,
  CreatePurchaseItemPayload,
} from '../../../../../types';
import { FilterBar, FilterValues } from '@/components/common/FilterBar';
import { useTranslate } from "@/hooks/useTranslate";
import { Plus, Trash2, ShoppingCart, DownloadIcon } from 'lucide-react';
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { Can } from '@/components/common/Can';
import { exportToExcel } from '@/utils/exportExcel';

export default function Purchases() {
  const { _ } = useTranslate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPurchase, setDetailPurchase] = useState<Purchase | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [supplierId, setSupplierId] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<CreatePurchaseItemPayload[]>([
    { product_id: 0, quantity: 1, price: 0 },
  ]);

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

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams: Record<string, any> = {};
      if (filters?.search) queryParams.search = filters.search;
      if (filters?.selects?.['supplier']) {
        queryParams.supplier_id = filters.selects['supplier'];
      }
      if (filters?.dateRanges?.['date']?.from && filters?.dateRanges?.['date']?.to) {
        queryParams.from = filters.dateRanges['date'].from;
        queryParams.to = filters.dateRanges['date'].to;
      }
      if (filters?.sorts?.['sort'] && filters.sorts['sort'].value) {
        queryParams.sort = filters.sorts['sort'].value;
        queryParams.order = filters.sorts['sort'].direction || 'desc';
      }

      const res = await getPurchases(currentPage, itemsPerPage, queryParams);
      if (res.status) {
        setPurchases(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setPurchases([]);
        showError(res.message || _("Gagal memuat data pembelian"));
      }
    } catch {
      showError(_("Gagal memuat data pembelian"));
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filters, _]);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [supRes, prodRes] = await Promise.all([getAllSuppliers(), getProducts(1, 200)]);
      if (supRes.status) setSuppliers(supRes.data.data);
      if (prodRes.status) setProducts(prodRes.data.data);
    } catch {}
  }, []);

  useEffect(() => { fetchPurchases(); }, [fetchPurchases]);
  useEffect(() => { fetchDropdownData(); }, [fetchDropdownData]);

  const resetForm = () => {
    setSupplierId(0);
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setItems([{ product_id: 0, quantity: 1, price: 0 }]);
  };

  const openCreateModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const addItem = () => {
    setItems([...items, { product_id: 0, quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof CreatePurchaseItemPayload, value: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateSubtotal = (item: CreatePurchaseItemPayload) => item.quantity * item.price;
  const calculateTotal = () => items.reduce((sum, item) => sum + calculateSubtotal(item), 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  const isFormValid = () => {
    if (!supplierId || !purchaseDate) return false;
    return items.every(item => item.product_id > 0 && item.quantity > 0 && item.price > 0);
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      showError(_("Lengkapi semua field item (produk, jumlah, harga)"));
      return;
    }
    setSubmitting(true);
    try {
      const payload: CreatePurchasePayload = {
        supplier_id: supplierId,
        purchase_date: purchaseDate,
        notes: notes || undefined,
        items,
      };
      const res = await createPurchase(payload);
      if (res.status) {
        showSuccess(_("Pembelian berhasil dan stok ditambahkan!"));
        setShowFormModal(false);
        resetForm();
        fetchPurchases();
      } else {
        showError(res.message || _("Gagal menyimpan pembelian"));
      }
    } catch {
      showError(_("Terjadi kesalahan saat menyimpan"));
    } finally {
      setSubmitting(false);
    }
  };

  const filterConfig = {
    selects: [
      {
        label: _("Supplier"),
        key: 'supplier',
        options: suppliers.map(s => ({ label: s.name, value: String(s.id) })),
      },
    ],
    dateRanges: [
      {
        label: _("Tanggal Pembelian"),
        key: 'date',
      },
    ],
    sorts: [
      {
        label: _("Urutkan"),
        key: 'sort',
        options: [
          { label: _("Tanggal Terbaru"), value: "purchase_date", direction: "desc" as const },
          { label: _("Tanggal Terlama"), value: "purchase_date", direction: "asc" as const },
          { label: _("Total Tertinggi"), value: "total_amount", direction: "desc" as const },
          { label: _("Total Terendah"), value: "total_amount", direction: "asc" as const },
          { label: _("Waktu Dibuat (Baru)"), value: "created_at", direction: "desc" as const },
          { label: _("Waktu Dibuat (Lama)"), value: "created_at", direction: "asc" as const },
        ],
      },
    ],
    searchPlaceholder: _("Cari berdasarkan supplier..."),
  };

  let filteredPurchases = purchases.filter(p => {
    const matchSearch = !filters?.search || (p.supplier?.name || '').toLowerCase().includes(filters.search.toLowerCase()) || (p.notes || '').toLowerCase().includes(filters.search.toLowerCase());
    const activeSupplier = filters?.selects?.['supplier'] ?? '';
    const matchSupplier = activeSupplier === '' || String(p.supplier_id) === activeSupplier;
    return matchSearch && matchSupplier;
  });

  const handleExport = () => {
    const exportData = filteredPurchases.map(purchase => ({
      Tanggal: new Date(purchase.purchase_date).toLocaleDateString('id-ID'),
      Supplier: purchase.supplier?.name || '-',
      "Total Item": purchase.items?.length || 0,
      "Total Harga": purchase.total_amount,
      Catatan: purchase.notes || '-'
    }));
    exportToExcel(exportData, 'Pembelian');
  };

  return (
    <PermissionWrapper permission="Lihat Pembelian" breadcrumb="Pembelian">

      <div className="flex flex-col gap-4 mb-4">
        <FilterBar {...filterConfig} onFilterChange={handleFilterChange} useUrlSync={true} />
        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" /> <Trans>Export Excel</Trans>
          </Button>
          <Can permission="Tambah Pembelian">
            <Button size="sm" onClick={openCreateModal}>
              <span className="flex items-center gap-1.5">
              + <Trans>Tambah Pembelian</Trans>
              </span>
            </Button>
          </Can>
        </div>
      </div>

      {/* Purchase List Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans>Tanggal</Trans></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{/* @ts-ignore */}<Trans>Supplier</Trans></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans>Total Item</Trans></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans>Total Harga</Trans></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans>Catatan</Trans></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans>Aksi</Trans></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={6}>
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                      <Trans>Memuat data...</Trans>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPurchases.length === 0 ? (
                <TableRow><TableCell className="px-5 py-8 text-center text-gray-500" colSpan={6}><Trans>Tidak ada data pembelian</Trans></TableCell></TableRow>
              ) : (
                filteredPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {new Date(purchase.purchase_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {purchase.supplier?.name || '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge size="sm" color="info">{purchase.items?.length || 0} {/* @ts-ignore */}<Trans>item</Trans></Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300 font-medium">
                      {formatCurrency(purchase.total_amount)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-[200px] truncate">
                      {purchase.notes || '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <button
                        onClick={() => { setDetailPurchase(purchase); setShowDetailModal(true); }}
                        className="text-brand-500 hover:text-brand-700 text-sm"
                      >
                        <Trans>Detail</Trans>
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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

      {/* Create Purchase Modal */}
      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} className="max-w-2xl p-6 lg:p-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
         
          <Trans>Tambah Pembelian</Trans>
        </h4>

        <div className="space-y-5">
          {/* Supplier & Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label><Trans>Supplier</Trans></Label>
              <Select
                options={suppliers.map(s => ({ value: String(s.id), label: s.name }))}
                placeholder={_("Pilih supplier")}
                defaultValue={supplierId ? String(supplierId) : ''}
                onChange={(v) => setSupplierId(Number(v))}
              />
            </div>
            <div>
              <Label><Trans>Tanggal Pembelian</Trans></Label>
              <Input
                type="date"
                defaultValue={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label><Trans>Catatan</Trans></Label>
            <TextArea
              placeholder={_("Catatan pembelian (opsional)")}
              value={notes}
              onChange={(val) => setNotes(val)}
              rows={2}
            />
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label><Trans>Item Pembelian</Trans></Label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-700 font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <Trans>Tambah Item</Trans>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.02]">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    {/* Product */}
                    <div className="col-span-5">
                      <label className="text-xs font-medium text-gray-500 mb-1 block"><Trans>Produk</Trans></label>
                      <Select
                        options={products.map(p => ({ value: String(p.id), label: `${p.name} (${p.sku})` }))}
                        placeholder={_("Pilih produk")}
                        defaultValue={item.product_id ? String(item.product_id) : ''}
                        onChange={(v) => updateItem(index, 'product_id', Number(v))}
                      />
                    </div>
                    {/* Quantity */}
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-500 mb-1 block"><Trans>Jumlah</Trans></label>
                      <Input
                        type="number"
                        placeholder="1"
                        defaultValue={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    {/* Price */}
                    <div className="col-span-3">
                      <label className="text-xs font-medium text-gray-500 mb-1 block"><Trans>Harga Beli</Trans></label>
                      <CurrencyInput
                        placeholder="0"
                        value={item.price}
                        onChange={(val) => updateItem(index, 'price', val)}
                      />
                    </div>
                    {/* Remove */}
                    <div className="col-span-2 flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {formatCurrency(calculateSubtotal(item))}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1.5 text-error-500 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-500/10 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Preview Card */}
          <div className="rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50/80 via-white to-brand-50/50 p-5 shadow-sm dark:border-brand-500/20 dark:from-brand-500/10 dark:via-gray-900 dark:to-brand-500/5">
            <div className="flex items-center justify-between border-b border-brand-100 pb-3 dark:border-brand-500/20">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                    <Trans>Estimasi Total Pembelian (Cost Preview)</Trans>
                  </h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <Trans>Rincian kalkulasi tagihan pembelian sebelum disimpan</Trans>
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800 dark:bg-brand-500/20 dark:text-brand-300">
                {items.length} <Trans>Jenis Produk</Trans>
              </span>
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 block"><Trans>Total Kuantitas Item</Trans></span>
                <span className="font-semibold text-gray-800 dark:text-white/90">
                  {items.reduce((sum, it) => sum + (it.quantity || 0), 0)} <Trans>unit</Trans>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 dark:text-gray-400 block"><Trans>Estimasi Biaya (Grand Total)</Trans></span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}><Trans>Batal</Trans></Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting || !isFormValid()}>
            {submitting ? <Trans>Menyimpan...</Trans> : <Trans>Simpan Pembelian</Trans>}
          </Button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} className="max-w-lg p-6 lg:p-8">
        <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans>Detail Pembelian</Trans></h4>
        {detailPurchase && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 block mb-1">{/* @ts-ignore */}<Trans>Supplier</Trans></span>
                <span className="font-medium text-gray-800 dark:text-white/90">{detailPurchase.supplier?.name || '-'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1"><Trans>Tanggal</Trans></span>
                <span className="font-medium text-gray-800 dark:text-white/90">
                  {new Date(detailPurchase.purchase_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            {detailPurchase.notes && (
              <div>
                <span className="text-xs text-gray-500 block mb-1"><Trans>Catatan</Trans></span>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{detailPurchase.notes}</span>
              </div>
            )}

            {/* Items table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-white/[0.05]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-start text-xs"><Trans>Produk</Trans></TableCell>
                    <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-start text-xs"><Trans>Jumlah</Trans></TableCell>
                    <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-start text-xs"><Trans>Harga</Trans></TableCell>
                    <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-start text-xs">{/* @ts-ignore */}<Trans>Subtotal</Trans></TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {detailPurchase.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-4 py-2 text-sm text-gray-800 dark:text-white/90">{item.product?.name || '-'}</TableCell>
                      <TableCell className="px-4 py-2 text-sm text-gray-500">{item.quantity}</TableCell>
                      <TableCell className="px-4 py-2 text-sm text-gray-500">{formatCurrency(item.price)}</TableCell>
                      <TableCell className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">{formatCurrency(item.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-brand-50 dark:bg-brand-500/10">
              <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">{/* @ts-ignore */}<Trans>Total</Trans></span>
              <span className="text-lg font-bold text-brand-700 dark:text-brand-300">{formatCurrency(detailPurchase.total_amount)}</span>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-center w-full">
          <Button size="sm" variant="outline" className="w-full" onClick={() => setShowDetailModal(false)}><Trans>Tutup</Trans></Button>
        </div>
      </Modal>
    </PermissionWrapper>
  );
}
