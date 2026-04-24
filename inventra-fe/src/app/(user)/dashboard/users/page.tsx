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
import MultiSelect from '@/components/form/MultiSelect';
import { getUsers, createUser, updateUser, deleteUser } from '../../../../../services/user.service';
import { getAllRoles } from '../../../../../services/role.service';
import type { User, Role, CreateUserPayload } from '../../../../../types';
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { Can } from '@/components/common/Can';
import { FilterBar, FilterValues } from '@/components/common/FilterBar';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { PencilIcon, TrashIcon } from "lucide-react";

export default function Users() {
  const { _ } = useLingui();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues | null>(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateUserPayload>({
    username: '', email: '', password: '', roles: [],
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers(currentPage);
      if (res.status) {
        setUsers(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setUsers([]);
        toast.error(res.message || _(msg`Gagal memuat data user`));
      }
    } catch {
      toast.error(_(msg`Gagal memuat data user`));
    } finally {
      setLoading(false);
    }
  }, [currentPage]);


  const fetchRoles = useCallback(async () => {
    try {
      const res = await getAllRoles();
      if (res.status) setRoles(res.data.data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const resetForm = () => { setFormData({ username: '', email: '', password: '', roles: [] }); setEditingUser(null); };

  const openCreateModal = () => { resetForm(); setShowFormModal(true); };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      roles: user.roles?.map((r) => r.name.split('.')[0]) || [],
    });
    setShowFormModal(true);
  };

  const openDeleteModal = (user: User) => { setDeletingUser(user); setShowDeleteModal(true); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = { ...formData };
      if (editingUser && !payload.password) {
        const { password, ...rest } = payload;
        const res = await updateUser(editingUser.id, rest);
        if (res.status) {
          toast.success(_(msg`User berhasil diperbarui`));
          setShowFormModal(false);
          resetForm();
          fetchUsers();
        } else {
          toast.error(res.message || _(msg`Gagal menyimpan user`));
        }
      } else {
        const res = editingUser
          ? await updateUser(editingUser.id, payload)
          : await createUser(payload);
        if (res.status) {
          toast.success(editingUser ? _(msg`User berhasil diperbarui`) : _(msg`User berhasil ditambahkan`));
          setShowFormModal(false);
          resetForm();
          fetchUsers();
        } else {
          toast.error(res.message || _(msg`Gagal menyimpan user`));
        }
      }
    } catch {
      toast.error(_(msg`Terjadi kesalahan saat menyimpan`));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setSubmitting(true);
    try {
      const res = await deleteUser(deletingUser.id);
      if (res.status) {
        toast.success(_(msg`User berhasil dihapus`));
        setShowDeleteModal(false);
        setDeletingUser(null);
        fetchUsers();
      } else {
        toast.error(res.message || _(msg`Gagal menghapus user`));
      }
    } catch {
      toast.error(_(msg`Terjadi kesalahan saat menghapus`));
    } finally {
      setSubmitting(false);
    }
  };

  const uniqueRoles = Array.from(new Set(users.flatMap(u => u.roles?.map(r => r.name) || [])));

  const filterConfig = {
    selects: [
      {
        label: _(msg`Role`),
        key: "role",
        options: uniqueRoles.map(r => ({ label: r, value: r }))
      }
    ],
    searchPlaceholder: _(msg`Cari user berdasarkan username atau email...`),
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.username.toLowerCase().includes((filters?.search || '').toLowerCase()) ||
      user.email.toLowerCase().includes((filters?.search || '').toLowerCase());
    
    const matchRole = !filters?.selects?.['role'] || user.roles?.some(r => r.name === filters.selects?.['role']);

    return matchSearch && matchRole;
  });

  return (
    <PermissionWrapper permission="Lihat Pengguna" breadcrumb="Users">
      <div>



      <div className='flex flex-col gap-4 mb-4'>
        <FilterBar {...filterConfig} onFilterChange={setFilters} />
        <Can permission="Tambah Pengguna">
          <div className="flex justify-end">
            <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah User" /></Button>
          </div>
        </Can>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Username</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Roles</TableCell>
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
              ) : filteredUsers.length === 0 ? (
                <TableRow><TableCell className="px-5 py-8 text-center text-gray-500"><Trans id="Tidak ada data user" /></TableCell></TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{user.username}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{user.email}</TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role) => (
                          <Badge key={role.id} size="sm" color="primary">{role.name}</Badge>
                        )) || <span className="text-gray-400 text-sm">-</span>}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex items-center gap-2">
                        <Can permission="Ubah Pengguna">
                          <button onClick={() => openEditModal(user)} className="p-2 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400" title="Edit"><PencilIcon className="w-4 h-4" /></button>
                        </Can>
                        <Can permission="Hapus Pengguna">
                          <button onClick={() => openDeleteModal(user)} className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400" title="Hapus"><TrashIcon className="w-4 h-4" /></button>
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

      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} className="max-w-md p-6 lg:p-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingUser ? <Trans id="Edit User" /> : <Trans id="Tambah User" />}
        </h4>
        <div className="space-y-4">
          <div>
            <Label>Username</Label>
            <Input type="text" placeholder="Username" defaultValue={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="Email" defaultValue={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <Label>{editingUser ? <Trans id="Password (kosongkan jika tidak diubah)" /> : 'Password'}</Label>
            <Input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div>
            <MultiSelect
              label="Roles"
              options={roles.map((r) => ({ value: r.name, text: r.name, selected: false }))}
              defaultSelected={formData.roles}
              onChange={(selected) => setFormData({ ...formData, roles: selected })}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}><Trans id="Batal" /></Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? <Trans id="Menyimpan..." /> : <Trans id="Simpan" />}</Button>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Hapus User" /></h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Trans id="Apakah Anda yakin ingin menghapus user" /> <strong>{deletingUser?.username}</strong>?
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