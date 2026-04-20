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
import { getPermissions, createPermission, updatePermission, deletePermission } from '../../../../../services/permission.service';
import type { Permission, CreatePermissionPayload } from '../../../../../types';
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { Can } from '@/components/common/Can';
import { FilterBar, FilterValues } from '@/components/common/FilterBar';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { PencilIcon, TrashIcon } from "lucide-react";

export default function Permissions() {
  const { _ } = useLingui();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues | null>(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreatePermissionPayload>({ name: '', guard_name: 'api' });

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPermissions(currentPage);
      if (res.status) {
        setPermissions(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setPermissions([]);
        toast.error(res.message || _(msg`Gagal memuat data permission`));
      }
    } catch {
      toast.error(_(msg`Gagal memuat data permission`));
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const resetForm = () => {
    setFormData({ name: '', guard_name: 'api' });
    setEditingPermission(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const openEditModal = (permission: Permission) => {
    setEditingPermission(permission);
    setFormData({
      name: permission.name,
      guard_name: permission.guard_name,
    });
    setShowFormModal(true);
  };

  const openDeleteModal = (permission: Permission) => {
    setDeletingPermission(permission);
    setShowDeleteModal(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = editingPermission
        ? await updatePermission(editingPermission.id, formData)
        : await createPermission(formData);
      if (res.status) {
        toast.success(editingPermission ? _(msg`Permission berhasil diperbarui`) : _(msg`Permission berhasil ditambahkan`));
        setShowFormModal(false);
        resetForm();
        fetchPermissions();
      } else {
        toast.error(res.message || _(msg`Gagal menyimpan permission`));
      }
    } catch {
      toast.error(_(msg`Terjadi kesalahan saat menyimpan`));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPermission) return;
    setSubmitting(true);
    try {
      const res = await deletePermission(deletingPermission.id);
      if (res.status) {
        toast.success(_(msg`Permission berhasil dihapus`));
        setShowDeleteModal(false);
        setDeletingPermission(null);
        fetchPermissions();
      } else {
        toast.error(res.message || _(msg`Gagal menghapus permission`));
      }
    } catch {
      toast.error(_(msg`Terjadi kesalahan saat menghapus`));
    } finally {
      setSubmitting(false);
    }
  };

  const uniqueModules = Array.from(new Set(permissions.map(p => p.name.split('.')[0]))).filter(Boolean);

  const filterConfig = {
    selects: [
      {
        label: _(msg`Modul`),
        key: "module",
        options: uniqueModules.map(m => ({ label: m, value: m }))
      }
    ],
    searchPlaceholder: _(msg`Cari permission berdasarkan nama...`),
  };

  const filteredPermissions = permissions.filter(permission => {
    const matchSearch = permission.name.toLowerCase().includes((filters?.search || '').toLowerCase());
    const matchModule = !filters?.selects?.['module'] || permission.name.startsWith(filters.selects['module'] + '.');
    return matchSearch && matchModule;
  });

  return (
    <PermissionWrapper permission="permission.view" breadcrumb="Permissions">
      <div>



      <div className='flex flex-col gap-4 mb-4'>
        <FilterBar {...filterConfig} onFilterChange={setFilters} />
        <Can permission="permission.create">
          <div className="flex justify-end">
            <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah Permission" /></Button>
          </div>
        </Can>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">ID</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Nama Permission" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Guard</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Aksi" /></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={4}>
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      <Trans id="Memuat data..." />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPermissions.length === 0 ? (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={4}>
                    <Trans id="Tidak ada data permission" />
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="text-gray-500 text-theme-sm">{permission.id}</span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{permission.name}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge size="sm" color="light">{permission.guard_name}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex items-center gap-2">
                        <Can permission="permission.update">
                          <button onClick={() => openEditModal(permission)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                        </Can>
                        <Can permission="permission.delete">
                          <button onClick={() => openDeleteModal(permission)} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400" title="Hapus"><TrashIcon className="w-4 h-4" /></button>
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

      {/* ─── Create / Edit Modal ─── */}
      <Modal
        isOpen={showFormModal}
        onClose={() => { setShowFormModal(false); resetForm(); }}
        className="max-w-lg p-6 lg:p-10"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingPermission ? <Trans id="Edit Permission" /> : <Trans id="Tambah Permission" />}
        </h4>

        <div className="space-y-4">
          <div>
            <Label><Trans id="Nama Permission" /></Label>
            <Input
              type="text"
              placeholder="e.g. user.view"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Guard Name</Label>
            <Input
              type="text"
              placeholder="api"
              value={formData.guard_name}
              onChange={(e) => setFormData({ ...formData, guard_name: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}>
            <Trans id="Batal" />
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Trans id="Menyimpan..." /> : <Trans id="Simpan" />}
          </Button>
        </div>
      </Modal>

      {/* ─── Delete Modal ─── */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Hapus Permission" /></h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Trans id="Apakah Anda yakin ingin menghapus permission" /> <strong>{deletingPermission?.name}</strong>?
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