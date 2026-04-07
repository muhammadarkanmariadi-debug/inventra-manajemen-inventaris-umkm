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
import MultiSelect from '@/components/form/MultiSelect';
import { getUsers, createUser, updateUser, deleteUser } from '../../../../../services/user.service';
import { getAllRoles } from '../../../../../services/role.service';
import type { User, Role, CreateUserPayload } from '../../../../../types';
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { Can } from '@/components/common/Can';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';

export default function Users() {
  const { _ } = useLingui();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
    setError('');
    try {
      const res = await getUsers(currentPage);
      if (res.status) {
        setUsers(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setUsers([]);
        setError(res.message || _(msg`Gagal memuat data user`));
      }
    } catch {
      setError(_(msg`Gagal memuat data user`));
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
    setError('');
    try {
      const payload = { ...formData };
      if (editingUser && !payload.password) {
        const { password, ...rest } = payload;
        const res = await updateUser(editingUser.id, rest);
        if (res.status) {
          setSuccessMsg(_(msg`User berhasil diperbarui`));
          setShowFormModal(false);
          resetForm();
          fetchUsers();
          setTimeout(() => setSuccessMsg(''), 3000);
        } else {
          setError(res.message || _(msg`Gagal menyimpan user`));
        }
      } else {
        const res = editingUser
          ? await updateUser(editingUser.id, payload)
          : await createUser(payload);
        if (res.status) {
          setSuccessMsg(editingUser ? _(msg`User berhasil diperbarui`) : _(msg`User berhasil ditambahkan`));
          setShowFormModal(false);
          resetForm();
          fetchUsers();
          setTimeout(() => setSuccessMsg(''), 3000);
        } else {
          setError(res.message || _(msg`Gagal menyimpan user`));
        }
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menyimpan`));
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
        setSuccessMsg(_(msg`User berhasil dihapus`));
        setShowDeleteModal(false);
        setDeletingUser(null);
        fetchUsers();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menghapus user`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menghapus`));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PermissionWrapper permission="user.view" breadcrumb="Users">
      <div>


      {successMsg && <div className="mb-4"><Alert variant="success" title={_(msg`Berhasil`)} message={successMsg} /></div>}
      {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}

      <Can permission="user.create">
        <div className="mb-4 flex justify-end">
          <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah User" /></Button>
        </div>
      </Can>

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
              ) : users.length === 0 ? (
                <TableRow><TableCell className="px-5 py-8 text-center text-gray-500"><Trans id="Tidak ada data user" /></TableCell></TableRow>
              ) : (
                users.map((user) => (
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
                        <Can permission="user.update">
                          <button onClick={() => openEditModal(user)} className="text-brand-500 hover:text-brand-700 text-sm"><Trans id="Edit" /></button>
                        </Can>
                        <Can permission="user.delete">
                          <button onClick={() => openDeleteModal(user)} className="text-error-500 hover:text-error-700 text-sm"><Trans id="Hapus" /></button>
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