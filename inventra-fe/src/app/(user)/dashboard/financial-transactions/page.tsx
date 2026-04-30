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
import TextArea from '@/components/form/input/TextArea';
import Alert from '@/components/ui/alert/Alert';
import { getFinancialTransactions, createFinancialTransaction, updateFinancialTransaction, deleteFinancialTransaction } from '../../../../../services/financial-transaction.service';
import { getAllFinancialCategories } from '../../../../../services/financial-category.service';
import type { FinancialTransaction, FinancialCategory, CreateFinancialTransactionPayload } from '../../../../../types';
import { FilterBar, FilterValues } from '@/components/common/FilterBar';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { PencilIcon, TrashIcon, DownloadIcon } from "lucide-react";
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { Can } from '@/components/common/Can';
import { exportToExcel } from '@/utils/exportExcel';

export default function FinancialTransactions() {
  const { _ } = useLingui();
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues | null>(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTx, setEditingTx] = useState<FinancialTransaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<FinancialTransaction | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateFinancialTransactionPayload>({
    financial_category_id: 0, type: 'income', amount: 0, note: '', transaction_date: '',
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFinancialTransactions(currentPage);
      if (res.status) {
        setTransactions(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setTransactions([]);
        toast.error(res.message || _(msg`Gagal memuat data transaksi keuangan`));
      }
    } catch {
      toast.error(_(msg`Gagal memuat data transaksi keuangan`));
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getAllFinancialCategories();
      if (res.status) setCategories(res.data.data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const resetForm = () => {
    setFormData({ financial_category_id: 0, type: 'income', amount: 0, note: '', transaction_date: '' });
    setEditingTx(null);
  };

  const openCreateModal = () => { resetForm(); setShowFormModal(true); };

  const openEditModal = (tx: FinancialTransaction) => {
    setEditingTx(tx);
    setFormData({
      financial_category_id: tx.financial_category_id,
      type: tx.type,
      amount: tx.amount,
      note: tx.note || '',
      transaction_date: tx.transaction_date.split('T')[0],
    });
    setShowFormModal(true);
  };

  const openDeleteModal = (tx: FinancialTransaction) => { setDeletingTx(tx); setShowDeleteModal(true); };

  const handleCategoryChange = (categoryId: string) => {
    const cat = categories.find((c) => c.id === Number(categoryId));
    setFormData((prev) => ({
      ...prev,
      financial_category_id: Number(categoryId),
      type: cat?.type || prev.type,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = editingTx
        ? await updateFinancialTransaction(editingTx.id, formData)
        : await createFinancialTransaction(formData);
      if (res.status) {
        toast.success(editingTx ? _(msg`Transaksi keuangan berhasil diperbarui`) : _(msg`Transaksi keuangan berhasil ditambahkan`));
        setShowFormModal(false);
        resetForm();
        fetchTransactions();
      } else {
        toast.error(res.message || _(msg`Gagal menyimpan transaksi keuangan`));
      }
    } catch {
      toast.error(_(msg`Terjadi kesalahan saat menyimpan`));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTx) return;
    setSubmitting(true);
    try {
      const res = await deleteFinancialTransaction(deletingTx.id);
      if (res.status) {
        toast.success(_(msg`Transaksi keuangan berhasil dihapus`));
        setShowDeleteModal(false);
        setDeletingTx(null);
        fetchTransactions();
      } else {
        toast.error(res.message || _(msg`Gagal menghapus transaksi keuangan`));
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
    tabs: [
      { label: _(msg`Semua`), value: "all" },
      { label: _(msg`Pemasukan`), value: "income" },
      { label: _(msg`Pengeluaran`), value: "expense" }
    ],
    selects: [
      {
        label: _(msg`Kategori`),
        key: "category",
        options: categories.map(c => ({ label: c.name, value: String(c.id) }))
      }
    ],
    searchPlaceholder: _(msg`Cari transaksi berdasarkan catatan atau tipe...`),
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchSearch = tx.note?.toLowerCase().includes((filters?.search || '').toLowerCase()) ||
      (filters?.search ? tx.type.toLowerCase().includes(filters?.search.toLowerCase()) : true);
    
    const matchTab = !filters?.tab || filters.tab === 'all' || tx.type === filters.tab;
    const matchCat = !filters?.selects?.['category'] || String(tx.financial_category_id) === filters.selects['category'];

    return matchSearch && matchTab && matchCat;
  });

  const handleExport = () => {
    const exportData = filteredTransactions.map(tx => ({
      Tipe: tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      Jumlah: tx.amount,
      Catatan: tx.note || "-",
      Tanggal: new Date(tx.transaction_date).toLocaleDateString('id-ID')
    }));
    exportToExcel(exportData, 'Transaksi_Keuangan');
  };

  return (
    <PermissionWrapper permission="Lihat Transaksi Keuangan" breadcrumb="Transaksi Keuangan">


      <div className='flex flex-col gap-4 mb-4'>
        <FilterBar {...filterConfig} onFilterChange={setFilters} />
        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" /> <Trans id="Export Excel" />
          </Button>
          <Can permission="Tambah Transaksi Keuangan">
            <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah Transaksi" /></Button>
          </Can>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
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
                    <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={5}>
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                        <Trans id="Memuat data..." />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow><TableCell className="px-5 py-8 text-center text-gray-500"><Trans id="Tidak ada data transaksi keuangan" /></TableCell></TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge size="sm" color={tx.type === 'income' ? 'success' : 'error'}>
                          {tx.type === 'income' ? <Trans id="Pemasukan" /> : <Trans id="Pengeluaran" />}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <span className={`font-medium text-theme-sm ${tx.type === 'income' ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{tx.note || '-'}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {new Date(tx.transaction_date).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div className="flex items-center gap-2">
                          <Can permission="Ubah Transaksi Keuangan">
                            <button onClick={() => openEditModal(tx)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                          </Can>
                          <Can permission="Hapus Transaksi Keuangan">
                            <button onClick={() => openDeleteModal(tx)} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400" title="Hapus"><TrashIcon className="w-4 h-4" /></button>
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

      {totalPages > 1 && (
        <div className="mt-4 flex justify-end">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} className="max-w-md p-6 lg:p-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingTx ? <Trans id="Edit Transaksi Keuangan" /> : <Trans id="Tambah Transaksi Keuangan" />}
        </h4>
        <div className="space-y-4">
          <div>
            <Label><Trans id="Kategori Keuangan" /></Label>
            <Select
              options={categories.map((c) => ({ value: String(c.id), label: `${c.name} (${c.type === 'income' ? _(msg`Pemasukan`) : _(msg`Pengeluaran`)})` }))}
              placeholder={_(msg`Pilih kategori`)}
              defaultValue={formData.financial_category_id ? String(formData.financial_category_id) : ''}
              onChange={handleCategoryChange}
            />
          </div>
          <div>
            <Label><Trans id="Tipe" /></Label>
            <Select
              options={[
                { value: 'income', label: _(msg`Pemasukan`) },
                { value: 'expense', label: _(msg`Pengeluaran`) },
              ]}
              defaultValue={formData.type}
              onChange={(v) => setFormData({ ...formData, type: v as 'income' | 'expense' })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label><Trans id="Jumlah" /></Label>
              <Input type="number" placeholder="0" defaultValue={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} />
            </div>
            <div>
              <Label><Trans id="Tanggal Transaksi" /></Label>
              <Input type="date" defaultValue={formData.transaction_date} onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })} />
            </div>
          </div>
          <div>
            <Label><Trans id="Catatan" /></Label>
            <TextArea placeholder={_(msg`Catatan (opsional)`)} value={formData.note || ''} onChange={(val) => setFormData({ ...formData, note: val })} rows={3} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}><Trans id="Batal" /></Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? <Trans id="Menyimpan..." /> : <Trans id="Simpan" />}</Button>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Hapus Transaksi" /></h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Trans id="Apakah Anda yakin ingin menghapus transaksi keuangan ini?" />
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
