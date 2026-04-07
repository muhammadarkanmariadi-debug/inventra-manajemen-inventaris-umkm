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
import { getFinancialCategories, createFinancialCategory, updateFinancialCategory, deleteFinancialCategory } from '../../../../../services/financial-category.service';
import type { FinancialCategory, CreateFinancialCategoryPayload } from '../../../../../types';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';

export default function FinancialCategories() {
  const { _ } = useLingui();
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FinancialCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<FinancialCategory | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateFinancialCategoryPayload>({ name: '', type: 'income' });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getFinancialCategories(currentPage);
      if (res.status) {
        setCategories(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setCategories([]);
        setError(res.message || _(msg`Gagal memuat data kategori keuangan`));
      }
    } catch {
      setError(_(msg`Gagal memuat data kategori keuangan`));
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const resetForm = () => { setFormData({ name: '', type: 'income' }); setEditingCategory(null); };

  const openCreateModal = () => { resetForm(); setShowFormModal(true); };

  const openEditModal = (cat: FinancialCategory) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, type: cat.type });
    setShowFormModal(true);
  };

  const openDeleteModal = (cat: FinancialCategory) => { setDeletingCategory(cat); setShowDeleteModal(true); };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = editingCategory
        ? await updateFinancialCategory(editingCategory.id, formData)
        : await createFinancialCategory(formData);
      if (res.status) {
        setSuccessMsg(editingCategory ? _(msg`Kategori keuangan berhasil diperbarui`) : _(msg`Kategori keuangan berhasil ditambahkan`));
        setShowFormModal(false);
        resetForm();
        fetchCategories();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menyimpan kategori keuangan`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menyimpan`));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setSubmitting(true);
    try {
      const res = await deleteFinancialCategory(deletingCategory.id);
      if (res.status) {
        setSuccessMsg(_(msg`Kategori keuangan berhasil dihapus`));
        setShowDeleteModal(false);
        setDeletingCategory(null);
        fetchCategories();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menghapus kategori keuangan`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menghapus`));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle={_(msg`Kategori Keuangan`)} />

      {successMsg && <div className="mb-4"><Alert variant="success" title={_(msg`Berhasil`)} message={successMsg} /></div>}
      {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}

      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah Kategori" /></Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Nama" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Tipe" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Aksi" /></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={3}>
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                      <Trans id="Memuat data..." />
                    </div>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow><TableCell className="px-5 py-8 text-center text-gray-500"><Trans id="Tidak ada data kategori keuangan" /></TableCell></TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{cat.name}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge size="sm" color={cat.type === 'income' ? 'success' : 'error'}>
                        {cat.type === 'income' ? <Trans id="Pemasukan" /> : <Trans id="Pengeluaran" />}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(cat)} className="text-brand-500 hover:text-brand-700 text-sm"><Trans id="Edit" /></button>
                        <button onClick={() => openDeleteModal(cat)} className="text-error-500 hover:text-error-700 text-sm"><Trans id="Hapus" /></button>
                      </div>
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

      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} className="max-w-md p-6 lg:p-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingCategory ? <Trans id="Edit Kategori Keuangan" /> : <Trans id="Tambah Kategori Keuangan" />}
        </h4>
        <div className="space-y-4">
          <div>
            <Label><Trans id="Nama" /></Label>
            <Input type="text" placeholder={_(msg`Nama kategori`)} defaultValue={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
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
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}><Trans id="Batal" /></Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? <Trans id="Menyimpan..." /> : <Trans id="Simpan" />}</Button>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Hapus Kategori Keuangan" /></h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Trans id="Apakah Anda yakin ingin menghapus kategori" /> <strong>{deletingCategory?.name}</strong>?
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
