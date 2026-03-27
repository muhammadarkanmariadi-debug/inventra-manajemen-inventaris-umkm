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
import { getRoles, getRole, createRole, updateRole, deleteRole, getPermissions } from '../../../../../services/role.service';
import type { Role, Permission, CreateRolePayload } from '../../../../../types';
import Switch from '@/components/form/switch/Switch';


function groupPermissions(permissions: Permission[]): Record<string, Permission[]> {
  return permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
    const module = perm.name.split('.')[0] ?? perm.name; 
    if (!acc[module]) acc[module] = [];
    acc[module].push(perm);
    return acc;
  }, {});
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [detailRole, setDetailRole] = useState<Role | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateRolePayload>({ name: '', permissions: [] });

  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getRoles(currentPage);
      if (res.status) {
        setRoles(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setRoles([]);
        setError(res.message || 'Gagal memuat data role');
      }
    } catch {
      setError('Gagal memuat data role');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchAllPermissions = useCallback(async () => {
    try {
      const res = await getPermissions(); 

      if (res.status && res.data) {
        const perms: Permission[] = res.data;
        setAllPermissions(perms);
        setGroupedPermissions(groupPermissions(perms));
      }
    } catch {
      // Jika endpoint belum ada, abaikan — fallback ke permissions dari role
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchAllPermissions();
  }, [fetchRoles, fetchAllPermissions]);

  const resetForm = () => {
    setFormData({ name: '', permissions: [] });
    setEditingRole(null);
    setGroupedPermissions(groupPermissions(allPermissions));
  };

  const openCreateModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const openEditModal = async (role: Role) => {
    try {
      const res = await getRole(role.id);
      if (res.status && res.data) {
        const roleData: Role = res.data;
        setEditingRole(roleData);

        const ownedPermNames = roleData.permissions?.map((p: Permission) => p.name) ?? [];

        setFormData({
          name: roleData.name,
          permissions: ownedPermNames,
        });

        if (allPermissions.length > 0) {
          setGroupedPermissions(groupPermissions(allPermissions));
        } else {
          const fallbackPerms = roleData.permissions ?? [];
          setGroupedPermissions(groupPermissions(fallbackPerms));
        }

        setShowFormModal(true);
      }
    } catch {
      setError('Gagal memuat detail role');
    }
  };

  const openDetailModal = async (role: Role) => {
    try {
      const res = await getRole(role.id);
      if (res.status) {
        setDetailRole(res.data);
        setShowDetailModal(true);
      }
    } catch {
      setError('Gagal memuat detail role');
    }
  };

  const openDeleteModal = (role: Role) => {
    setDeletingRole(role);
    setShowDeleteModal(true);
  };

  const togglePermission = (permName: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permName)
        ? prev.permissions.filter((p) => p !== permName)
        : [...prev.permissions, permName],
    }));
  };

  
  const toggleModulePermissions = (modulePerms: Permission[]) => {
    const permNames = modulePerms.map((p) => p.name);
    const allChecked = permNames.every((name) => formData.permissions.includes(name));

    setFormData((prev) => ({
      ...prev,
      permissions: allChecked
        ? prev.permissions.filter((p) => !permNames.includes(p))
        : [...new Set([...prev.permissions, ...permNames])],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = editingRole
        ? await updateRole(editingRole.id, formData)
        : await createRole(formData);
      if (res.status) {
        setSuccessMsg(editingRole ? 'Role berhasil diperbarui' : 'Role berhasil ditambahkan');
        setShowFormModal(false);
        resetForm();
        fetchRoles();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || 'Gagal menyimpan role');
      }
    } catch {
      setError('Terjadi kesalahan saat menyimpan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingRole) return;
    setSubmitting(true);
    try {
      const res = await deleteRole(deletingRole.id);
      if (res.status) {
        setSuccessMsg('Role berhasil dihapus');
        setShowDeleteModal(false);
        setDeletingRole(null);
        fetchRoles();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || 'Gagal menghapus role');
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Roles" />

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
        <Button size="sm" onClick={openCreateModal}>+ Tambah Role</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['Nama Role', 'Guard', 'Aksi'].map((h) => (
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
                  <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={3}>
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
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={3}>
                    Tidak ada data role
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{role.name}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Badge size="sm" color="light">{role.guard_name}</Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openDetailModal(role)} className="text-blue-500 hover:text-blue-700 text-sm">Detail</button>
                        <button onClick={() => openEditModal(role)} className="text-brand-500 hover:text-brand-700 text-sm">Edit</button>
                        <button onClick={() => openDeleteModal(role)} className="text-error-500 hover:text-error-700 text-sm">Hapus</button>
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
          {editingRole ? 'Edit Role' : 'Tambah Role'}
        </h4>

        <div className="space-y-4">
          {/* Nama Role */}
          <div>
            <Label>Nama Role</Label>
            <Input
              type="text"
              placeholder="Nama role"
              defaultValue={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Permissions — hanya tampil saat edit */}
          {editingRole && Object.keys(groupedPermissions).length > 0 && (
            <div>
              <Label>Permissions</Label>
              <div className="mt-2 max-h-72 overflow-y-auto space-y-4 pr-1">
                {Object.entries(groupedPermissions).map(([module, perms]) => {
                  const allChecked = perms.every((p) => formData.permissions.includes(p.name));
                  const someChecked = perms.some((p) => formData.permissions.includes(p.name));

                  return (
                    <div key={module} className="rounded-lg border border-gray-100 dark:border-white/[0.08] p-3">
                      {/* Header modul — klik untuk toggle semua */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 capitalize">
                          {module}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleModulePermissions(perms)}
                          className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                            allChecked
                              ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-500/10 dark:border-brand-500/30 dark:text-brand-400'
                              : someChecked
                              ? 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-500/10 dark:border-yellow-500/30 dark:text-yellow-400'
                              : 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-white/[0.04] dark:border-white/[0.08]'
                          }`}
                        >
                          {allChecked ? 'Hapus Semua' : 'Pilih Semua'}
                        </button>
                      </div>

                      {/* Daftar permission dalam modul ini */}
                      <div className="space-y-1.5">
                        {perms.map((perm) => (
                          <Switch
                            key={perm.id}
                            label={perm.name}
                            checked={formData.permissions.includes(perm.name)}
                            onChange={() => togglePermission(perm.name)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ringkasan jumlah permission yang dipilih */}
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                {formData.permissions.length} dari {allPermissions.length || Object.values(groupedPermissions).flat().length} permission dipilih
              </p>
            </div>
          )}
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

      {/* ─── Detail Modal ─── */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setDetailRole(null); }}
        className="max-w-lg p-6 lg:p-10"
      >
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Detail Role: {detailRole?.name}
        </h4>
        {detailRole?.permissions && detailRole.permissions.length > 0 ? (
          <div className="space-y-3">
            {Object.entries(groupPermissions(detailRole.permissions)).map(([module, perms]) => (
              <div key={module}>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1 capitalize">{module}</p>
                <div className="flex flex-wrap gap-1.5">
                  {perms.map((perm) => (
                    <Badge key={perm.id} size="sm" color="primary">{perm.name}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Tidak ada permissions</p>
        )}
        <div className="mt-6 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => { setShowDetailModal(false); setDetailRole(null); }}>
            Tutup
          </Button>
        </div>
      </Modal>

      {/* ─── Delete Modal ─── */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">Hapus Role</h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Apakah Anda yakin ingin menghapus role <strong>{deletingRole?.name}</strong>?
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