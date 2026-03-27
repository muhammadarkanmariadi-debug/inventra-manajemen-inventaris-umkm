'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Pagination from '@/components/tables/Pagination';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Alert from '@/components/ui/alert/Alert';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../../../services/category.service';
import type { Category, CreateCategoryPayload } from '../../../../../types';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateCategoryPayload>({ name: '', description: '' });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getCategories(currentPage);
      if (res.status) {
        setCategories(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setCategories([]);
        setError(res.message || 'Gagal memuat data kategori');
      }
    } catch {
      setError('Gagal memuat data kategori');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const resetForm = () => { setFormData({ name: '', description: '' }); setEditingCategory(null); };

  const openCreateModal = () => { resetForm(); setShowFormModal(true); };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setShowFormModal(true);
  };

  const openDeleteModal = (cat: Category) => { setDeletingCategory(cat); setShowDeleteModal(true); };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = editingCategory
        ? await updateCategory(editingCategory.id, formData)
        : await createCategory(formData);
      if (res.status) {
        setSuccessMsg(editingCategory ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan');
        setShowFormModal(false);
        resetForm();
        fetchCategories();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || 'Gagal menyimpan kategori');
      }
    } catch {
      setError('Terjadi kesalahan saat menyimpan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setSubmitting(true);
    try {
      const res = await deleteCategory(deletingCategory.id);
      if (res.status) {
        setSuccessMsg('Kategori berhasil dihapus');
        setShowDeleteModal(false);
        setDeletingCategory(null);
        fetchCategories();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || 'Gagal menghapus kategori');
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Kategori" />

      {successMsg && <div className="mb-4"><Alert variant="success" title="Berhasil" message={successMsg} /></div>}
      {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}

      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={openCreateModal}>+ Tambah Kategori</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['Nama', 'Deskripsi', 'Jumlah Produk', 'Aksi'].map((h) => (
                  <TableCell key={h} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{h}</TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={4}>
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                      Memuat data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow><TableCell className="px-5 py-8 text-center text-gray-500">Tidak ada data kategori</TableCell></TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{cat.name}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{cat.description || '-'}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{cat.products?.length ?? 0}</TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(cat)} className="text-brand-500 hover:text-brand-700 text-sm">Edit</button>
                        <button onClick={() => openDeleteModal(cat)} className="text-error-500 hover:text-error-700 text-sm">Hapus</button>
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

      {/* Create/Edit Modal */}
      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} className="max-w-md p-6 lg:p-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
        </h4>
        <div className="space-y-4">
          <div>
            <Label>Nama Kategori</Label>
            <Input type="text" placeholder="Nama kategori" defaultValue={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <Label>Deskripsi</Label>
            <TextArea placeholder="Deskripsi kategori (opsional)" value={formData.description || ''} onChange={(val) => setFormData({ ...formData, description: val })} rows={3} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}>Batal</Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">Hapus Kategori</h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Apakah Anda yakin ingin menghapus kategori <strong>{deletingCategory?.name}</strong>?
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
