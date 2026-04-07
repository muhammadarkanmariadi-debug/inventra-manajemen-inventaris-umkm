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
import Alert from '@/components/ui/alert/Alert';
import { getStockTransactions, createStockTransaction, deleteStockTransaction } from '../../../../../services/stock-transaction.service';
import { getProducts } from '../../../../../services/product.service';
import type { StockTransaction, Product, StockTransactionItem } from '../../../../../types';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';

export default function StockTransactions() {
  const { _ } = useLingui();
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTx, setDeletingTx] = useState<StockTransaction | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formItems, setFormItems] = useState<StockTransactionItem[]>([
    { product_id: 0, quantity: 1, type: 'IN', note: '' },
  ]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getStockTransactions(currentPage);
      if (res.status) {
        setTransactions(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setTransactions([]);
        setError(res.message || _(msg`Gagal memuat data transaksi stok`));
      }
    } catch {
      setError(_(msg`Gagal memuat data transaksi stok`));
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await getProducts(1, 100);
      if (res.status) setProducts(res.data.data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const resetForm = () => {
    setFormItems([{ product_id: 0, quantity: 1, type: 'IN', note: '' }]);
  };

  const addItem = () => {
    setFormItems([...formItems, { product_id: 0, quantity: 1, type: 'IN', note: '' }]);
  };

  const removeItem = (index: number) => {
    setFormItems(formItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof StockTransactionItem, value: any) => {
    const updated = [...formItems];
    (updated[index] as any)[field] = value;
    setFormItems(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await createStockTransaction({ transactions: formItems });
      if (res.status) {
        setSuccessMsg(_(msg`Transaksi stok berhasil dibuat`));
        setShowFormModal(false);
        resetForm();
        fetchTransactions();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menyimpan transaksi stok`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menyimpan`));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTx) return;
    setSubmitting(true);
    try {
      const res = await deleteStockTransaction(deletingTx.id);
      if (res.status) {
        setSuccessMsg(_(msg`Transaksi stok berhasil dihapus`));
        setShowDeleteModal(false);
        setDeletingTx(null);
        fetchTransactions();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menghapus transaksi stok`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menghapus`));
    } finally {
      setSubmitting(false);
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case 'IN': return 'success';
      case 'OUT': return 'error';
      case 'ADJUST': return 'warning';
      default: return 'light';
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle={_(msg`Transaksi Stok`)} />

      {successMsg && <div className="mb-4"><Alert variant="success" title={_(msg`Berhasil`)} message={successMsg} /></div>}
      {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}

      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => { resetForm(); setShowFormModal(true); }}>+ <Trans id="Tambah Transaksi" /></Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Produk" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Tipe" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Jumlah" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Catatan" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Tanggal" /></TableCell>
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
              ) : transactions.length === 0 ? (
                <TableRow><TableCell className="px-5 py-8 text-center text-gray-500"><Trans id="Tidak ada data transaksi stok" /></TableCell></TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{tx.product?.name || '-'}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge size="sm" color={typeColor(tx.type)}>{tx.type}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{tx.quantity}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{tx.note || '-'}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {new Date(tx.created_at).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <button onClick={() => { setDeletingTx(tx); setShowDeleteModal(true); }} className="text-error-500 hover:text-error-700 text-sm"><Trans id="Hapus" /></button>
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

      {/* Create Modal with multiple items */}
      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} className="max-w-2xl p-6 lg:p-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Tambah Transaksi Stok" /></h4>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {formItems.map((item, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Item #{index + 1}</span>
                {formItems.length > 1 && (
                  <button onClick={() => removeItem(index)} className="text-error-500 hover:text-error-700 text-xs"><Trans id="Hapus" /></button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label><Trans id="Produk" /></Label>
                  <Select
                    options={products.map((p) => ({ value: String(p.id), label: `${p.name} (${p.stock})` }))}
                    placeholder={_(msg`Pilih produk`)}
                    defaultValue={item.product_id ? String(item.product_id) : ''}
                    onChange={(v) => updateItem(index, 'product_id', Number(v))}
                  />
                </div>
                <div>
                  <Label><Trans id="Tipe" /></Label>
                  <Select
                    options={[
                      { value: 'IN', label: _(msg`Masuk (IN)`) },
                      { value: 'OUT', label: _(msg`Keluar (OUT)`) },
                      { value: 'ADJUST', label: _(msg`Penyesuaian (ADJUST)`) },
                    ]}
                    defaultValue={item.type}
                    onChange={(v) => updateItem(index, 'type', v)}
                  />
                </div>
                <div>
                  <Label><Trans id="Jumlah" /></Label>
                  <Input type="number" placeholder="0" defaultValue={item.quantity} onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} />
                </div>
                <div>
                  <Label><Trans id="Catatan" /></Label>
                  <Input type="text" placeholder={_(msg`Opsional`)} defaultValue={item.note || ''} onChange={(e) => updateItem(index, 'note', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={addItem}>+ <Trans id="Tambah Item" /></Button>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}><Trans id="Batal" /></Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? <Trans id="Menyimpan..." /> : <Trans id="Simpan" />}</Button>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Hapus Transaksi" /></h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Trans id="Apakah Anda yakin ingin menghapus transaksi stok ini? Stok produk akan dikembalikan sesuai tipe transaksi." />
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
