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
import Alert from '@/components/ui/alert/Alert';
import { getSales, createSale, updateSale, deleteSale } from '../../../../../services/sale.service';
import { getProducts } from '../../../../../services/product.service';
import type { Sale, Product, CreateSalePayload } from '../../../../../types';

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [deletingSale, setDeletingSale] = useState<Sale | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateSalePayload>({
    product_id: 0, quantity: 1, selling_price: 0
  });

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getSales(currentPage);

      if (res.status) {
        setSales(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setSales([]);
        setError(res.message || 'Gagal memuat data penjualan');
      }
    } catch {
      setError('Gagal memuat data penjualan');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await getProducts(1, 100);
      if (res.status) setProducts(res.data.data);
    } catch { }
  }, []);

  useEffect(() => { fetchSales(); }, [fetchSales]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const resetForm = () => {
    setFormData({ product_id: 0, quantity: 1, selling_price: 0 });
    setEditingSale(null);
  };

  const openCreateModal = () => { resetForm(); setShowFormModal(true); };

  const openEditModal = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      product_id: sale.product_id,
      quantity: sale.quantity,
      selling_price: sale.selling_price,

    });
    setShowFormModal(true);
  };

  const openDeleteModal = (sale: Sale) => { setDeletingSale(sale); setShowDeleteModal(true); };

  const handleProductChange = (productId: string) => {
    const product = products.find((p) => p.id === Number(productId));
    setFormData((prev) => ({
      ...prev,
      product_id: Number(productId),
      selling_price: product?.selling_price || prev.selling_price,
    }));
  };

  const handleSubmit = async () => {

    setSubmitting(true);
    setError('');
    try {
      const res = editingSale
        ? await updateSale(editingSale.id, formData)
        : await createSale(formData);

      console.log(res)
      if (res.status) {
        setSuccessMsg(editingSale ? 'Penjualan berhasil diperbarui' : 'Penjualan berhasil ditambahkan');
        setShowFormModal(false);
        resetForm();
        fetchSales();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || 'Gagal menyimpan penjualan');
      }
    } catch {
      setError('Terjadi kesalahan saat menyimpan');
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
        setSuccessMsg('Penjualan berhasil dihapus');
        setShowDeleteModal(false);
        setDeletingSale(null);
        fetchSales();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || 'Gagal menghapus penjualan');
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Penjualan" />

      {successMsg && <div className="mb-4"><Alert variant="success" title="Berhasil" message={successMsg} /></div>}
      {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}

      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={openCreateModal}>+ Tambah Penjualan</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {['Produk', 'Qty', 'Harga Jual', 'Total', 'HPP', 'Profit', 'Aksi'].map((h) => (
                    <TableCell key={h} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{h}</TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={7}>
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                        Memuat data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sales.length === 0 ? (
                  <TableRow><TableCell className="px-5 py-8 text-center text-gray-500">Tidak ada data penjualan</TableCell></TableRow>
                ) : (
                  sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{sale.product?.name || '-'}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{sale.quantity}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatCurrency(sale.selling_price)}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatCurrency(sale.total_price)}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatCurrency(sale.hpp)}</TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge size="sm" color={sale.profit >= 0 ? 'success' : 'error'}>
                          {formatCurrency(sale.profit)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(sale)} className="text-brand-500 hover:text-brand-700 text-sm">Edit</button>
                          <button onClick={() => openDeleteModal(sale)} className="text-error-500 hover:text-error-700 text-sm">Hapus</button>
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
          {editingSale ? 'Edit Penjualan' : 'Tambah Penjualan'}
        </h4>
        <div className="space-y-4">
          <div>
            <Label>Produk</Label>
            <Select
              options={products.map((p) => ({ value: String(p.id), label: `${p.name} (Stok: ${p.stock})` }))}
              placeholder="Pilih produk"
              defaultValue={formData.product_id ? String(formData.product_id) : ''}
              onChange={handleProductChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Jumlah</Label>
              <Input type="number" placeholder="1" defaultValue={formData.quantity} min="1" onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Harga Jual</Label>
              <Input type="number" placeholder="0" defaultValue={formData.selling_price} onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })} />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}>Batal</Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</Button>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">Hapus Penjualan</h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Apakah Anda yakin ingin menghapus penjualan ini?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(false)}>Batal</Button>
          <Button size="sm" onClick={handleDelete} disabled={submitting} className="bg-error-500 hover:bg-error-600">
            {submitting ? 'Menghapus...' : 'Hapus'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
