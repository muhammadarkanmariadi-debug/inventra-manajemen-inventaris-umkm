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
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../../../../../services/supplier.service';
import type { Supplier, CreateSupplierPayload } from '../../../../../types';
import { FilterBar, FilterValues } from '@/components/common/FilterBar';
import { useLingui } from '@lingui/react';
import { PencilIcon, TrashIcon, DownloadIcon } from "lucide-react";
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { Can } from '@/components/common/Can';
import { exportToExcel } from '@/utils/exportExcel';

export default function Suppliers() {
  const { _ } = useLingui();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateSupplierPayload>({ name: '', phone: '', address: '' });

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

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams: Record<string, any> = {};
      if (filters?.search) queryParams.search = filters.search;
      if (filters?.sorts?.['sort'] && filters.sorts['sort'].value) {
        queryParams.sort = filters.sorts['sort'].value;
        queryParams.order = filters.sorts['sort'].direction || 'asc';
      }

      const res = await getSuppliers(currentPage, itemsPerPage, queryParams);
      if (res.status) {
        setSuppliers(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setSuppliers([]);
        toast.error(res.message || _("Gagal memuat data supplier"));
      }
    } catch {
      toast.error(_("Gagal memuat data supplier"));
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filters, _]);

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
    try {
      const res = editingSupplier
        ? await updateSupplier(editingSupplier.id, formData)
        : await createSupplier(formData);
      if (res.status) {
        toast.success(editingSupplier ? _("Supplier berhasil diperbarui") : _("Supplier berhasil ditambahkan"));
        setShowFormModal(false);
        resetForm();
        fetchSuppliers();
      } else {
        toast.error(res.message || _("Gagal menyimpan supplier"));
      }
    } catch {
      toast.error(_("Terjadi kesalahan saat menyimpan"));
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
        toast.success(_("Supplier berhasil dihapus"));
        setShowDeleteModal(false);
        setDeletingSupplier(null);
        fetchSuppliers();
      } else {
        toast.error(res.message || _("Gagal menghapus supplier"));
      }
    } catch {
      toast.error(_("Terjadi kesalahan saat menghapus"));
    } finally {
      setSubmitting(false);
    }
  };

  const filterConfig = {
    sorts: [
      {
        label: _("Urutkan"),
        key: 'sort',
        options: [
          { label: _("Nama (A-Z)"), value: "name", direction: "asc" as const },
          { label: _("Nama (Z-A)"), value: "name", direction: "desc" as const },
          { label: _("Waktu Dibuat (Baru)"), value: "created_at", direction: "desc" as const },
          { label: _("Waktu Dibuat (Lama)"), value: "created_at", direction: "asc" as const },
        ],
      },
    ],
    searchPlaceholder: _("Cari supplier berdasarkan nama atau no. telepon..."),
  };

  const filteredSearch = suppliers.filter(item => {
    return !filters?.search || item.name.toLowerCase().includes(filters.search.toLowerCase()) || (item.phone || '').toLowerCase().includes(filters.search.toLowerCase());
  });

  const handleExport = () => {
    const exportData = filteredSearch.map(sup => ({
      Nama: sup.name,
      "No.Telp": sup.phone || "-",
      Alamat: sup.address || "-"
    }));
    exportToExcel(exportData, 'Supplier');
  };

  return (
    <PermissionWrapper permission="Lihat Supplier" breadcrumb="Supplier">

      <div className='flex flex-col gap-4 mb-4'>
        <FilterBar {...filterConfig} onFilterChange={handleFilterChange} useUrlSync={true} />
        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" /> <Trans id="Export Excel" />
          </Button>
          <Can permission="Tambah Supplier">
            <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah Supplier" /></Button>
          </Can>
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
                        <Can permission="Ubah Supplier">
                          <button onClick={() => openEditModal(sup)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                        </Can>
                        <Can permission="Hapus Supplier">
                          <button onClick={() => openDeleteModal(sup)} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400" title="Hapus"><TrashIcon className="w-4 h-4" /></button>
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
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} itemsPerPage={itemsPerPage} onItemsPerPageChange={(limit) => { setItemsPerPage(limit); setCurrentPage(1); }} />
        </div>
      )}

      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} className="max-w-md p-6 lg:p-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingSupplier ? <Trans id="Edit Supplier" /> : <Trans id="Tambah Supplier" />}
        </h4>
        <div className="space-y-4">
          <div>
            <Label><Trans id="Nama Supplier" /></Label>
            <Input type="text" placeholder={_("Nama supplier")} defaultValue={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <Label><Trans id="Alamat" /></Label>
            <TextArea placeholder={_("Alamat supplier")} value={formData.address || ''} onChange={(val) => setFormData({ ...formData, address: val })} rows={3} />
          </div>
          <div>
            <Label><Trans id="No.Telp" /></Label>
            <TextArea placeholder={_("Nomor telepon supplier")} value={formData.phone || ''} onChange={(val) => setFormData({ ...formData, phone: val })} rows={3} />
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
    </PermissionWrapper>
  );
}
