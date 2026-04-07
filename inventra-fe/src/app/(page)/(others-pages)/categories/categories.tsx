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
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { Can } from '@/components/common/Can';
import SearchBar from '@/components/form/input/SearchBar';
import { FilterBar, FilterBarProps, FilterValues } from '@/components/common/FilterBar';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';

export default function Categories() {
  const { _ } = useLingui();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [Search, setSearch] = useState('');
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
        setError(res.message || _(msg`Gagal memuat data kategori`));
      }
    } catch {
      setError(_(msg`Gagal memuat data kategori`));
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
        setSuccessMsg(editingCategory ? _(msg`Kategori berhasil diperbarui`) : _(msg`Kategori berhasil ditambahkan`));
        setShowFormModal(false);
        resetForm();
        fetchCategories();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menyimpan kategori`));
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
      const res = await deleteCategory(deletingCategory.id);
      if (res.status) {
        setSuccessMsg(_(msg`Kategori berhasil dihapus`));
        setShowDeleteModal(false);
        setDeletingCategory(null);
        fetchCategories();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menghapus kategori`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menghapus`));
    } finally {
      setSubmitting(false);
    }
  };


  const filteredSearch = categories.filter(item => {
    return item.name.toLowerCase().includes((Search || '').toLowerCase())
  })

  return (
    <PermissionWrapper permission="category.view" breadcrumb="Kategori">
      <div>
        {/* PageBreadcrumb already inside PermissionWrapper or redundant if using breadcrumb prop */}
        <PageBreadcrumb pageTitle="Categories" />
        {successMsg && <div className="mb-4"><Alert variant="success" title={_(msg`Berhasil`)} message={successMsg} /></div>}
        {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
        <div className='flex items-center justify-between '>
          <SearchBar placeholder={_(msg`Cari kategori berdasarkan nama`)} onChange={(e) => setSearch(e)}/>
          <Can permission="category.create">
            <div className="mb-4 flex justify-end">

              <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah Kategori" /></Button>
            </div>
          </Can>
        </div>


        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Nama" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Deskripsi" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Jumlah Produk" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Aksi" /></TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={4}>
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                        <Trans id="Memuat data..." />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSearch.length === 0 ? (
                  <TableRow><TableCell className="px-5 py-8 text-center text-gray-500"><Trans id="Tidak ada data kategori" /></TableCell></TableRow>
                ) : (
                  filteredSearch.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{cat.name}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{cat.description || '-'}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{cat.products?.length ?? 0}</TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div className="flex items-center gap-2">
                          <Can permission="category.update">
                            <button onClick={() => openEditModal(cat)} className="text-brand-500 hover:text-brand-700 text-sm"><Trans id="Edit" /></button>
                          </Can>
                          <Can permission="category.delete">
                            <button onClick={() => openDeleteModal(cat)} className="text-error-500 hover:text-error-700 text-sm"><Trans id="Hapus" /></button>
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

        {totalPages > 1 && (
          <div className="mt-4 flex justify-end">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} className="max-w-md p-6 lg:p-10">
          <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
            {editingCategory ? <Trans id="Edit Kategori" /> : <Trans id="Tambah Kategori" />}
          </h4>
          <div className="space-y-4">
            <div>
              <Label><Trans id="Nama Kategori" /></Label>
              <Input type="text" placeholder={_(msg`Nama kategori`)} defaultValue={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <Label><Trans id="Deskripsi" /></Label>
              <TextArea placeholder={_(msg`Deskripsi kategori (opsional)`)} value={formData.description || ''} onChange={(val) => setFormData({ ...formData, description: val })} rows={3} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}><Trans id="Batal" /></Button>
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? <Trans id="Menyimpan..." /> : <Trans id="Simpan" />}</Button>
          </div>
        </Modal>

        {/* Delete Modal */}
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Hapus Kategori" /></h4>
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
    </PermissionWrapper>
  );
}
