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
import Alert from '@/components/ui/alert/Alert';
import { FilterBar, FilterBarProps, FilterValues } from '@/components/common/FilterBar';
import { getLocations, createLocation, updateLocation, deleteLocation } from '../../../../../services/location.service';
import { PencilIcon, TrashIcon, DownloadIcon } from "lucide-react";
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { Can } from '@/components/common/Can';
import { exportToExcel } from '@/utils/exportExcel';

interface LocationItem {
  id: number;
  name: string;
  inventories_count: number;
  created_at: string;
  updated_at: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues | null>(null);

  // Form modal
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [formName, setFormName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingLocation, setDeletingLocation] = useState<LocationItem | null>(null);

  const filterConfig: Required<Pick<FilterBarProps, "tabs" | "selects" | "searchPlaceholder">> = {
    tabs: [],
    selects: [],
    searchPlaceholder: "Cari nama gudang...",
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLocations({ page: currentPage, items: 50 });
      setLocations(res.data?.data || []);
      setTotalPages(res.data?.last_page || 1);
    } catch (err: any) {
      toast.error(err?.message || 'Gagal memuat data Gudang.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => { fetchData(); }, [fetchData]);



  const openCreateModal = () => {
    setEditingLocation(null);
    setFormName('');
    setShowFormModal(true);
  };

  const openEditModal = (loc: LocationItem) => {
    setEditingLocation(loc);
    setFormName(loc.name);
    setShowFormModal(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) return;
    setSubmitting(true);
    try {
      if (editingLocation) {
        await updateLocation(editingLocation.id, formName.trim());
        toast.success('Gudang berhasil diperbarui.');
      } else {
        await createLocation(formName.trim());
        toast.success('Gudang berhasil ditambahkan.');
      }
      setShowFormModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.message || 'Gagal menyimpan Gudang.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLocation) return;
    setSubmitting(true);
    try {
      await deleteLocation(deletingLocation.id);
      toast.success('Gudang berhasil dihapus.');
      setShowDeleteModal(false);
      setDeletingLocation(null);
      fetchData();
    } catch (err: any) {
      toast.error(err?.message || 'Gagal menghapus Gudang.');
    } finally {
      setSubmitting(false);
    }
  };

  // Client-side filtering
  const filtered = locations.filter((loc) => {
    const matchSearch = loc.name
      .toLowerCase()
      .includes((filters?.search || '').toLowerCase());
    return matchSearch;
  });

  const handleExport = () => {
    const exportData = filtered.map(loc => ({
      "Nama Gudang": loc.name,
      "Jumlah Inventaris": loc.inventories_count
    }));
    exportToExcel(exportData, 'Kelola_Gudang');
  };

  return (
    <PermissionWrapper permission="Lihat Produk" breadcrumb="Kelola Gudang">
      <div className="flex flex-col gap-4">
        <FilterBar
          tabs={filterConfig.tabs}
          selects={filterConfig.selects}
          searchPlaceholder={filterConfig.searchPlaceholder}
          onFilterChange={setFilters}
        />
        <div className="mb-4 flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" /> Export Excel
          </Button>
          <Can permission="Tambah Produk">
            <Button size="sm" onClick={openCreateModal}>+ Tambah Gudang</Button>
          </Can>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">No</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Nama Gudang</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Jumlah Inventaris</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Aksi</TableCell>
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
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={4}>Tidak ada data Gudang.</TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((loc, idx) => (
                      <TableRow key={loc.id}>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{(currentPage - 1) * 50 + idx + 1}</TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{loc.name}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge size="sm" color={loc.inventories_count > 0 ? 'primary' : 'light'}>{loc.inventories_count}</Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="flex items-center gap-2">
                            <Can permission="Ubah Produk">
                              <button onClick={() => openEditModal(loc)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                            </Can>
                            <Can permission="Hapus Produk">
                              <button onClick={() => { setDeletingLocation(loc); setShowDeleteModal(true); }} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400" title="Hapus"><TrashIcon className="w-4 h-4" /></button>
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
      </div>

      {/* Create / Edit Modal */}
      <Modal isOpen={showFormModal} onClose={() => setShowFormModal(false)} className="max-w-md">
        <div className="p-5">
          <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            {editingLocation ? 'Edit Gudang' : 'Tambah Gudang Baru'}
          </h4>
          <div className="mb-4">
            <Label>Nama Gudang</Label>
            <Input
              type="text"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="Contoh: Gudang A, Rak 01..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button size="sm" variant="outline" onClick={() => setShowFormModal(false)}>Batal</Button>
            <Button size="sm" onClick={handleSubmit} disabled={submitting || !formName.trim()}>
              {submitting ? 'Menyimpan...' : editingLocation ? 'Perbarui' : 'Simpan'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeletingLocation(null); }} className="max-w-md">
        <div className="p-5">
          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Hapus Gudang</h4>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus Gudang <strong>{deletingLocation?.name}</strong>?
            {deletingLocation && deletingLocation.inventories_count > 0 && (
              <span className="mt-1 block text-red-500">⚠ Gudang ini memiliki {deletingLocation.inventories_count} inventaris. Hapus akan ditolak.</span>
            )}
          </p>
          <div className="flex justify-end gap-3">
            <Button size="sm" variant="outline" onClick={() => { setShowDeleteModal(false); setDeletingLocation(null); }}>Batal</Button>
            <Button size="sm" onClick={handleDelete} disabled={submitting}>
              {submitting ? 'Menghapus...' : 'Ya, Hapus'}
            </Button>
          </div>
        </div>
      </Modal>
    </PermissionWrapper>
  );
}
