'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
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
import { FilterBar, FilterValues } from '@/components/common/FilterBar';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { PencilIcon, TrashIcon, DownloadIcon } from "lucide-react";
import { exportToExcel } from '@/utils/exportExcel';
export default function Categories() {
  const { _ } = useLingui();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateCategoryPayload>({ name: '', description: '' });




  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategories(currentPage);
      if (res.status) {
        setCategories(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setCategories([]);
        toast.error(res.message || _(msg`Gagal memuat data kategori`));
      }
    } catch {
      toast.error(_(msg`Gagal memuat data kategori`));
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
    try {
      const res = editingCategory
        ? await updateCategory(editingCategory.id, formData)
        : await createCategory(formData);
      if (res.status) {
        toast.success(editingCategory ? _(msg`Kategori berhasil diperbarui`) : _(msg`Kategori berhasil ditambahkan`));
        setShowFormModal(false);
        resetForm();
        fetchCategories();
      } else {
        toast.error(res.message || _(msg`Gagal menyimpan kategori`));
      }
    } catch {
      toast.error(_(msg`Terjadi kesalahan saat menyimpan`));
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
        toast.success(_(msg`Kategori berhasil dihapus`));
        setShowDeleteModal(false);
        setDeletingCategory(null);
        fetchCategories();
      } else {
        toast.error(res.message || _(msg`Gagal menghapus kategori`));
      }
    } catch {
      toast.error(_(msg`Terjadi kesalahan saat menghapus`));
    } finally {
      setSubmitting(false);
    }
  };


  const filterConfig = {
    selects: [
      {
        label: _(msg`Urutkan`),
        key: 'sort',
        options: [
          { label: _(msg`A-Z`), value: 'name_asc' },
          { label: _(msg`Z-A`), value: 'name_desc' }
        ]
      }
    ],
    searchPlaceholder: _(msg`Cari kategori berdasarkan nama...`),
  };

  let filteredSearch = categories.filter(item => {
    return item.name.toLowerCase().includes((filters?.search || '').toLowerCase())
  });

  if (filters?.selects?.['sort']) {
    const sortValue = filters.selects['sort'];
    filteredSearch = [...filteredSearch].sort((a, b) => {
      if (sortValue === 'name_asc') return a.name.localeCompare(b.name);
      if (sortValue === 'name_desc') return b.name.localeCompare(a.name);
      return 0;
    });
  }

  const handleExport = () => {
    const exportData = filteredSearch.map(cat => ({
      Nama: cat.name,
      Deskripsi: cat.description || "-",
      "Jumlah Produk": cat.products?.length ?? 0
    }));
    exportToExcel(exportData, 'Kategori');
  };

  return (
    <PermissionWrapper permission="Lihat Kategori" breadcrumb="Kategori">
      <div>
        {/* PageBreadcrumb already inside PermissionWrapper or redundant if using breadcrumb prop */}
        <PageBreadcrumb pageTitle="Categories" />
        
        <div className='flex flex-col gap-4 mb-4'>
          <FilterBar {...filterConfig} onFilterChange={setFilters} />
          <div className="flex justify-end gap-3">
            <Button size="sm" variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <DownloadIcon className="w-4 h-4" /> <Trans id="Export Excel" />
            </Button>
            <Can permission="Tambah Kategori">
              <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah Kategori" /></Button>
            </Can>
          </div>
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
                          <Can permission="Ubah Kategori">
                            <button onClick={() => openEditModal(cat)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                          </Can>
                          <Can permission="Hapus Kategori">
                            <button onClick={() => openDeleteModal(cat)} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400" title="Hapus"><TrashIcon className="w-4 h-4" /></button>
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
