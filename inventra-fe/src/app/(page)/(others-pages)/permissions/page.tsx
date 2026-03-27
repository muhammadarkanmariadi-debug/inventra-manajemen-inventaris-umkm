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
import Alert from '@/components/ui/alert/Alert';
import { getPermissions, createPermission, updatePermission, deletePermission } from '../../../../../services/permission.service';
import type { Permission, CreatePermissionPayload } from '../../../../../types';

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreatePermissionPayload>({ name: '', guard_name: 'api' });

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPermissions(currentPage);
      if (res.status) {
        setPermissions(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setPermissions([]);
        setError(res.message || 'Gagal memuat data permission');
      }
    } catch {
      setError('Gagal memuat data permission');
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
    setError('');
    try {
      const res = editingPermission
        ? await updatePermission(editingPermission.id, formData)
        : await createPermission(formData);
      if (res.status) {
        setSuccessMsg(editingPermission ? 'Permission berhasil diperbarui' : 'Permission berhasil ditambahkan');
        setShowFormModal(false);
        resetForm();
        fetchPermissions();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || 'Gagal menyimpan permission');
      }
    } catch {
      setError('Terjadi kesalahan saat menyimpan');
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
        setSuccessMsg('Permission berhasil dihapus');
        setShowDeleteModal(false);
        setDeletingPermission(null);
        fetchPermissions();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || 'Gagal menghapus permission');
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Permissions" />

      {successMsg && (
        <div className="mb-4">
          <Alert variant="success" title="Berhasil" message={successMsg} />
        </div>
      )}
      {error && (
        <div className="mb-4">
          <Alert variant="error" title="Error" message={error} />
        </div>
      )}

      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={openCreateModal}>+ Tambah Permission</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['ID', 'Nama Permission', 'Guard', 'Aksi'].map((h) => (
                  <TableCell
                    key={h}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={4}>
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-brand-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Memuat data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : permissions.length === 0 ? (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={4}>
                    Tidak ada data permission
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((permission) => (
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
                        <button onClick={() => openEditModal(permission)} className="text-brand-500 hover:text-brand-700 text-sm">Edit</button>
                        <button onClick={() => openDeleteModal(permission)} className="text-error-500 hover:text-error-700 text-sm">Hapus</button>
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
          {editingPermission ? 'Edit Permission' : 'Tambah Permission'}
        </h4>

        <div className="space-y-4">
          {/* Nama Permission */}
          <div>
            <Label>Nama Permission</Label>
            <Input
              type="text"
              placeholder="e.g. user.view"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Guard Name */}
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
            Batal
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </Modal>

      {/* ─── Delete Modal ─── */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">Hapus Permission</h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Apakah Anda yakin ingin menghapus permission <strong>{deletingPermission?.name}</strong>?
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