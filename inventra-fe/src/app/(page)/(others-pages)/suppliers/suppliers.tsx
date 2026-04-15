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
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../../../../../services/supplier.service';
import type { Supplier, CreateSupplierPayload } from '../../../../../types';
import { FilterBar, FilterValues } from '@/components/common/FilterBar';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';

export default function Suppliers() {
  const { _ } = useLingui();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateSupplierPayload>({ name: '', phone: '', address: '' });

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getSuppliers(currentPage);
      if (res.status) {
        setSuppliers(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setSuppliers([]);
        setError(res.message || _(msg`Gagal memuat data supplier`));
      }
    } catch {
      setError(_(msg`Gagal memuat data supplier`));
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  const resetForm = () => { setFormData({ name: '', address: '', phone: '' }); setEditingSupplier(null); };

  const openCreateModal = () => { resetForm(); setShowFormModal(true); };

  const openEditModal = (sup: Supplier) => {
    setEditingSupplier(sup);
    setFormData({ name: sup.name, address: sup.address || '', phone: sup.phone });
    setShowFormModal(true);
  };

  const openDeleteModal = (sup: Supplier) => { setDeletingSupplier(sup); setShowDeleteModal(true); };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = editingSupplier
        ? await updateSupplier(editingSupplier.id, formData)
        : await createSupplier(formData);
      if (res.status) {
        setSuccessMsg(editingSupplier ? _(msg`Supplier berhasil diperbarui`) : _(msg`Supplier berhasil ditambahkan`));
        setShowFormModal(false);
        resetForm();
        fetchSuppliers();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menyimpan supplier`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menyimpan`));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSupplier) return;
    setSubmitting(true);
    try {
      const res = await deleteSupplier(deletingSupplier.id);
      if (res.status) {
        setSuccessMsg(_(msg`Supplier berhasil dihapus`));
        setShowDeleteModal(false);
        setDeletingSupplier(null);
        fetchSuppliers();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menghapus supplier`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menghapus`));
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
    searchPlaceholder: _(msg`Cari supplier berdasarkan nama...`),
  };

  let filteredSearch = suppliers.filter(item => {
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

  return (
    <div>
      <PageBreadcrumb pageTitle="Supplier" />

      {successMsg && <div className="mb-4"><Alert variant="success" title={_(msg`Berhasil`)} message={successMsg} /></div>}
      {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
      <div className='flex flex-col gap-4 mb-4'>
        <FilterBar {...filterConfig} onFilterChange={setFilters} />
        <div className="flex justify-end">
          <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah Supplier" /></Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Nama" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="No.Telp" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Alamat" /></TableCell>
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
              ) : filteredSearch.length === 0 ? (
                <TableRow><TableCell className="px-5 py-8 text-center text-gray-500"><Trans id="Tidak ada data supplier" /></TableCell></TableRow>
              ) : (
                filteredSearch.map((sup) => (
                  <TableRow key={sup.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{sup.name}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{sup.phone || '-'}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{sup.address || '-'}</TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(sup)} className="text-brand-500 hover:text-brand-700 text-sm"><Trans id="Edit" /></button>
                        <button onClick={() => openDeleteModal(sup)} className="text-error-500 hover:text-error-700 text-sm"><Trans id="Hapus" /></button>
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
          {editingSupplier ? <Trans id="Edit Supplier" /> : <Trans id="Tambah Supplier" />}
        </h4>
        <div className="space-y-4">
          <div>
            <Label><Trans id="Nama Supplier" /></Label>
            <Input type="text" placeholder={_(msg`Nama supplier`)} defaultValue={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <Label><Trans id="Alamat" /></Label>
            <TextArea placeholder={_(msg`Alamat supplier`)} value={formData.address || ''} onChange={(val) => setFormData({ ...formData, address: val })} rows={3} />
          </div>
          <div>
            <Label><Trans id="No.Telp" /></Label>
            <TextArea placeholder={_(msg`Nomor telepon supplier`)} value={formData.phone || ''} onChange={(val) => setFormData({ ...formData, phone: val })} rows={3} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}><Trans id="Batal" /></Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? <Trans id="Menyimpan..." /> : <Trans id="Simpan" />}</Button>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Hapus Supplier" /></h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Trans id="Apakah Anda yakin ingin menghapus supplier" /> <strong>{deletingSupplier?.name}</strong>?
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
