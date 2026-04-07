'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Pagination from '@/components/tables/Pagination';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Alert from '@/components/ui/alert/Alert';
import Select from '@/components/form/Select';
import { getHppComponents, createHppComponent, updateHppComponent, deleteHppComponent } from '../../../../../services/hpp.service';
import { getProducts } from '../../../../../services/product.service';
import type { HppComponent, CreateHppComponentPayload, Product } from '../../../../../types';
import { FilterBar, FilterBarProps, FilterValues } from '@/components/common/FilterBar';
import { Search } from 'lucide-react';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';

export default function Hpp() {
  const { _ } = useLingui();
  const [hppComponents, setHppComponents] = useState<HppComponent[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingHpp, setEditingHpp] = useState<HppComponent | null>(null);
  const [deletingHpp, setDeletingHpp] = useState<HppComponent | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateHppComponentPayload>({ name: '', product_id: 0, cost: 0 });


  const filterConfig: Required<Pick<FilterBarProps, "selects" | "searchPlaceholder" | "tabs">> = {

    selects: [
      {
        label: "Hpp components",
        key: "hpp",
        options: [{
          label: _(msg`Terendah ke Tertinggi`), value: 'lth'
        },
        {
          label: _(msg`Tertinggi ke Terendah`), value: 'htl'
        }]
      },

    ],
    searchPlaceholder: _(msg`Cari komponen hpp atau nama produk...`),

    tabs: [{
      label: _(msg`Terendah ke Tertinggi`), value: 'lth'
    },
    {
      label: _(msg`Tertinggi ke Terendah`), value: 'htl'
    }]
  };
  const fetchHppComponents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getHppComponents(currentPage);
      if (res.status) {
        setHppComponents(res.data.data || []);
        setTotalPages(res.data.last_page);
      } else {
        setHppComponents([]);
        setError(res.message || _(msg`Gagal memuat data HPP`));
      }
    } catch {
      setError(_(msg`Gagal memuat data HPP`));
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await getProducts(1, 100);
      if (res.status) setProducts(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  }, []);

  useEffect(() => {
    fetchHppComponents();
    fetchProducts();
  }, [fetchHppComponents, fetchProducts]);

  const resetForm = () => {
    setFormData({ name: '', product_id: 0, cost: 0 });
    setEditingHpp(null);
  };

  const openCreateModal = () => { resetForm(); setShowFormModal(true); };

  const openEditModal = (hpp: HppComponent) => {
    setEditingHpp(hpp);
    setFormData({ name: hpp.name, product_id: hpp.product_id, cost: hpp.cost });
    setShowFormModal(true);
  };

  const openDeleteModal = (hpp: HppComponent) => { setDeletingHpp(hpp); setShowDeleteModal(true); };

  const handleSubmit = async () => {
    if (!formData.product_id || !formData.name || formData.cost < 0) {
      setError(_(msg`Mohon lengkapi semua field dengan benar`));
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = editingHpp
        ? await updateHppComponent(editingHpp.id, formData)
        : await createHppComponent(formData);
      if (res.status) {
        setSuccessMsg(editingHpp ? _(msg`HPP berhasil diperbarui`) : _(msg`HPP berhasil ditambahkan`));
        setShowFormModal(false);
        resetForm();
        fetchHppComponents();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menyimpan HPP`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menyimpan`));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingHpp) return;
    setSubmitting(true);
    try {
      const res = await deleteHppComponent(deletingHpp.id);
      if (res.status) {
        setSuccessMsg(_(msg`HPP berhasil dihapus`));
        setShowDeleteModal(false);
        setDeletingHpp(null);
        fetchHppComponents();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menghapus HPP`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menghapus`));
    } finally {
      setSubmitting(false);
    }
  };

  const productOptions = products.map(p => ({
    value: p.id.toString(),
    label: p.name
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };



  const filteredHpp = hppComponents.filter(item => {
    const matchSearch = item.product?.name.toLowerCase().includes(filters?.search.toLowerCase() || '') || item.name.toLowerCase().includes(filters?.search.toLowerCase() || '')


    return matchSearch


  }).sort((a, b) => {
    const filcon = filters?.tab ?? '';

    if (filcon == 'lth') return a.cost - b.cost
    if (filcon == 'htl') return b.cost - a.cost
    return 0;
  })
  return (
    <div>
      <PageBreadcrumb pageTitle="HPP Component" />

      {successMsg && <div className="mb-4"><Alert variant="success" title={_(msg`Berhasil`)} message={successMsg} /></div>}
      {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
      <div className='flex flex-col gap-4 '>
        <FilterBar

          selects={filterConfig.selects}
          searchPlaceholder={filterConfig.searchPlaceholder}
          onFilterChange={setFilters}
          tabs={filterConfig.tabs}
        />
        <div className="mb-4 flex justify-end">
          <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah HPP" /></Button>
        </div>
      </div>


      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Nama Komponen" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Produk" /></TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Biaya" /></TableCell>
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
              ) : filteredHpp.length === 0 ? (
                <TableRow><TableCell className="px-5 py-8 text-center text-gray-500" colSpan={4}><Trans id="Tidak ada data HPP" /></TableCell></TableRow>
              ) : (
                filteredHpp.map((hpp) => (
                  <TableRow key={hpp.id}>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {hpp.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {hpp.product?.name || '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatCurrency(hpp.cost)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(hpp)} className="text-brand-500 hover:text-brand-700 text-sm"><Trans id="Edit" /></button>
                        <button onClick={() => openDeleteModal(hpp)} className="text-error-500 hover:text-error-700 text-sm"><Trans id="Hapus" /></button>
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
          {editingHpp ? <Trans id="Edit HPP Component" /> : <Trans id="Tambah HPP Component" />}
        </h4>
        <div className="space-y-4">
          <div>
            <Label><Trans id="Nama Komponen" /></Label>
            <Input type="text" placeholder={_(msg`Misal: Bahan Baku, Packaging, dll`)} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <Label><Trans id="Produk" /></Label>
            <Select
              options={productOptions}
              placeholder={_(msg`Pilih Produk`)}
              onChange={(val) => setFormData({ ...formData, product_id: parseInt(val) })}
              value={formData.product_id ? formData.product_id.toString() : ''}
            />
          </div>
          <div>
            <Label><Trans id="Biaya" /></Label>
            <Input type="number" placeholder={_(msg`Biaya komponen`)} value={formData.cost.toString()} onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}><Trans id="Batal" /></Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? <Trans id="Menyimpan..." /> : <Trans id="Simpan" />}</Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Hapus HPP" /></h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Trans id="Apakah Anda yakin ingin menghapus komponen HPP" /> <strong>{deletingHpp?.name}</strong>?
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
