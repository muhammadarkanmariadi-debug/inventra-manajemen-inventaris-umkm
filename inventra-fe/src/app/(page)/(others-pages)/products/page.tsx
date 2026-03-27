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
import Select from '@/components/form/Select';
import Alert from '@/components/ui/alert/Alert';
import MultiSelect from '@/components/form/MultiSelect';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../../../../services/product.service';
import { getAllCategories } from '../../../../../services/category.service';
import { getAllSuppliers } from '../../../../../services/supplier.service';
import type { Product, Category, Supplier, CreateProductPayload } from '../../../../../types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');


  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateProductPayload>({
    name: '',
    sku: '',
    selling_price: 0,
    stock: 0,
    category_id: 0,
    product_type: 'barang',
    unit: '',
    expired_date: null,
    supplier_id: [],
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getProducts(currentPage);
      if (res.status) {
        setProducts(res.data.data);
        setTotalPages(res.data.last_page);
      } else {
        setProducts([]);
        setError(res.message || 'Gagal memuat data produk');
      }
    } catch {
      setError('Gagal memuat data produk');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [catRes, supRes] = await Promise.all([getAllCategories(), getAllSuppliers()]);
      if (catRes.status) setCategories(catRes.data.data);
      if (supRes.status) setSuppliers(supRes.data.data);
    } catch {
  
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  const resetForm = () => {
    setFormData({
      name: '', sku: '', selling_price: 0, stock: 0,
      category_id: 0, product_type: 'barang', unit: '',
      expired_date: null, supplier_id: [],
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      selling_price: product.selling_price,
      stock: product.stock,
      category_id: product.category_id,
      product_type: product.product_type,
      unit: product.unit,
      expired_date: product.expired_date,
      supplier_id: product.suppliers?.map((s) => s.id) || [],
    });
    setShowFormModal(true);
  };

  const openDeleteModal = (product: Product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = editingProduct
        ? await updateProduct(editingProduct.id, formData)
        : await createProduct(formData);

      if (res.status) {
        setSuccessMsg(editingProduct ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan');
        setShowFormModal(false);
        resetForm();
        fetchProducts();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || 'Gagal menyimpan produk');
      }
    } catch {
      setError('Terjadi kesalahan saat menyimpan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setSubmitting(true);
    try {
      const res = await deleteProduct(deletingProduct.id);
      if (res.status) {
        setSuccessMsg('Produk berhasil dihapus');
        setShowDeleteModal(false);
        setDeletingProduct(null);
        fetchProducts();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || 'Gagal menghapus produk');
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Produk" />

      {successMsg && <div className="mb-4"><Alert variant="success" title="Berhasil" message={successMsg} /></div>}
      {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}

      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={openCreateModal}>+ Tambah Produk</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {['Nama', 'SKU', 'Harga Jual', 'Stok', 'Kategori', 'Tipe', 'Satuan', 'Aksi'].map((h) => (
                    <TableCell key={h} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{h}</TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={8}>
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                        Memuat data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500">Tidak ada data produk</TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{product.name}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{product.sku}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatCurrency(product.selling_price)}</TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge size="sm" color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}>
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{product.category?.name || '-'}</TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge size="sm" color={product.product_type === 'kuliner' ? 'info' : 'light'}>
                          {product.product_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{product.unit}</TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(product)} className="text-brand-500 hover:text-brand-700 text-sm">Edit</button>
                          <button onClick={() => openDeleteModal(product)} className="text-error-500 hover:text-error-700 text-sm">Hapus</button>
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

      {/* Create/Edit Modal */}
      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} className="max-w-lg p-6 lg:p-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingProduct ? 'Edit Produk' : 'Tambah Produk'}
        </h4>
        <div className="space-y-4">
          <div>
            <Label>Nama Produk</Label>
            <Input type="text" placeholder="Nama produk" defaultValue={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <Label>SKU</Label>
            <Input type="text" placeholder="SKU" defaultValue={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Harga Jual</Label>
              <Input type="number" placeholder="0" defaultValue={formData.selling_price} onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Stok</Label>
              <Input type="number" placeholder="0" defaultValue={formData.stock} onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Kategori</Label>
              <Select
                options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                placeholder="Pilih kategori"
                defaultValue={formData.category_id ? String(formData.category_id) : ''}
                onChange={(v) => setFormData({ ...formData, category_id: Number(v) })}
              />
            </div>
            <div>
              <Label>Tipe Produk</Label>
              <Select
                options={[{ value: 'barang', label: 'Barang' }, { value: 'kuliner', label: 'Kuliner' }]}
                defaultValue={formData.product_type}
                onChange={(v) => setFormData({ ...formData, product_type: v as 'kuliner' | 'barang' })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Satuan</Label>
              <Input type="text" placeholder="pcs, kg, dll" defaultValue={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
            </div>
            <div>
              <Label>Tanggal Kadaluarsa</Label>
              <Input type="date" defaultValue={formData.expired_date || ''} onChange={(e) => setFormData({ ...formData, expired_date: e.target.value || null })} />
            </div>
          </div>
          <div>
            <MultiSelect
              label="Supplier"
              options={suppliers.map((s) => ({ value: String(s.id), text: s.name, selected: false }))}
              defaultSelected={formData.supplier_id?.map(String) || []}
              onChange={(selected) => setFormData({ ...formData, supplier_id: selected.map(Number) })}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}>Batal</Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">Hapus Produk</h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Apakah Anda yakin ingin menghapus produk <strong>{deletingProduct?.name}</strong>? Aksi ini tidak dapat dibatalkan.
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
