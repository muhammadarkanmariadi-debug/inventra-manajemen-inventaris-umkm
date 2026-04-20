'use client';

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
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';

export default function Purchases() {
  const { _ } = useLingui();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPurchases(currentPage);
      if (res.status) {
        setPurchases(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setPurchases([]);
        showError(res.message || _(msg`Gagal memuat data pembelian`));
      }
    } catch {
      showError(_(msg`Gagal memuat data pembelian`));
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

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
      showError(_(msg`Lengkapi semua field item (produk, jumlah, harga)`));
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
        showSuccess(_(msg`Pembelian berhasil dan stok ditambahkan!`));
        setShowFormModal(false);
        resetForm();
        fetchPurchases();
      } else {
        showError(res.message || _(msg`Gagal menyimpan pembelian`));
      }
    } catch {
      showError(_(msg`Terjadi kesalahan saat menyimpan`));
    } finally {
      setSubmitting(false);
    }
  };

  const filterConfig = {
    selects: [
      {
        label: _(msg`Supplier`),
        key: 'supplier',
        options: suppliers.map(s => ({ label: s.name, value: String(s.id) })),
      },
    ],
    searchPlaceholder: _(msg`Cari berdasarkan supplier...`),
  };

  let filteredPurchases = purchases.filter(p => {
    const matchSearch = (p.supplier?.name || '').toLowerCase().includes((filters?.search || '').toLowerCase());
    const activeSupplier = filters?.selects?.['supplier'] ?? '';
    const matchSupplier = activeSupplier === '' || String(p.supplier_id) === activeSupplier;
    return matchSearch && matchSupplier;
  });

  return (
    <div>
      <PageBreadcrumb pageTitle={_(msg`Pembelian`)} />

      <div className="flex flex-col gap-4 mb-4">
        <FilterBar {...filterConfig} onFilterChange={setFilters} />
        <div className="flex justify-end">
          <Button size="sm" onClick={openCreateModal}>
            <span className="flex items-center gap-1.5">
            + <Trans id="Tambah Pembelian" />
            </span>
          </Button>
        </div>
      </div>

      {/* Purchase List Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Tanggal" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Supplier</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Total Item" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Total Harga" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Catatan" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Aksi" /></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={6}>
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                      <Trans id="Memuat data..." />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPurchases.length === 0 ? (
                <TableRow><TableCell className="px-5 py-8 text-center text-gray-500" colSpan={6}><Trans id="Tidak ada data pembelian" /></TableCell></TableRow>
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
                      <Badge size="sm" color="info">{purchase.items?.length || 0} item</Badge>
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
                        <Trans id="Detail" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {/* Create Purchase Modal */}
      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} className="max-w-2xl p-6 lg:p-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
         
          <Trans id="Tambah Pembelian" />
        </h4>

        <div className="space-y-5">
          {/* Supplier & Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label><Trans id="Supplier" /></Label>
              <Select
                options={suppliers.map(s => ({ value: String(s.id), label: s.name }))}
                placeholder={_(msg`Pilih supplier`)}
                defaultValue={supplierId ? String(supplierId) : ''}
                onChange={(v) => setSupplierId(Number(v))}
              />
            </div>
            <div>
              <Label><Trans id="Tanggal Pembelian" /></Label>
              <Input
                type="date"
                defaultValue={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label><Trans id="Catatan" /></Label>
            <TextArea
              placeholder={_(msg`Catatan pembelian (opsional)`)}
              value={notes}
              onChange={(val) => setNotes(val)}
              rows={2}
            />
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label><Trans id="Item Pembelian" /></Label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-700 font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <Trans id="Tambah Item" />
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.02]">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    {/* Product */}
                    <div className="col-span-5">
                      <label className="text-xs font-medium text-gray-500 mb-1 block"><Trans id="Produk" /></label>
                      <Select
                        options={products.map(p => ({ value: String(p.id), label: `${p.name} (${p.sku})` }))}
                        placeholder={_(msg`Pilih produk`)}
                        defaultValue={item.product_id ? String(item.product_id) : ''}
                        onChange={(v) => updateItem(index, 'product_id', Number(v))}
                      />
                    </div>
                    {/* Quantity */}
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-500 mb-1 block"><Trans id="Jumlah" /></label>
                      <Input
                        type="number"
                        placeholder="1"
                        defaultValue={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    {/* Price */}
                    <div className="col-span-3">
                      <label className="text-xs font-medium text-gray-500 mb-1 block"><Trans id="Harga Beli" /></label>
                      <Input
                        type="number"
                        placeholder="0"
                        defaultValue={item.price}
                        onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
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

          {/* Grand Total */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20">
            <span className="text-sm font-semibold text-brand-700 dark:text-brand-300"><Trans id="Total Pembelian" /></span>
            <span className="text-lg font-bold text-brand-700 dark:text-brand-300">{formatCurrency(calculateTotal())}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}><Trans id="Batal" /></Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting || !isFormValid()}>
            {submitting ? <Trans id="Menyimpan..." /> : <Trans id="Simpan Pembelian" />}
          </Button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} className="max-w-lg p-6 lg:p-8">
        <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Detail Pembelian" /></h4>
        {detailPurchase && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 block mb-1">Supplier</span>
                <span className="font-medium text-gray-800 dark:text-white/90">{detailPurchase.supplier?.name || '-'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1"><Trans id="Tanggal" /></span>
                <span className="font-medium text-gray-800 dark:text-white/90">
                  {new Date(detailPurchase.purchase_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            {detailPurchase.notes && (
              <div>
                <span className="text-xs text-gray-500 block mb-1"><Trans id="Catatan" /></span>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{detailPurchase.notes}</span>
              </div>
            )}

            {/* Items table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-white/[0.05]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-start text-xs"><Trans id="Produk" /></TableCell>
                    <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-start text-xs"><Trans id="Jumlah" /></TableCell>
                    <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-start text-xs"><Trans id="Harga" /></TableCell>
                    <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-start text-xs">Subtotal</TableCell>
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
              <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">Total</span>
              <span className="text-lg font-bold text-brand-700 dark:text-brand-300">{formatCurrency(detailPurchase.total_amount)}</span>
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-center w-full">
          <Button size="sm" variant="outline" className="w-full" onClick={() => setShowDetailModal(false)}><Trans id="Tutup" /></Button>
        </div>
      </Modal>
    </div>
  );
}
