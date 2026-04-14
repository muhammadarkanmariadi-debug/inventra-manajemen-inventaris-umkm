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
import { getAllCategories, getCategories } from '../../../../../services/category.service';
import type { Product, Category, CreateProductPayload } from '../../../../../types';
import { Search } from 'lucide-react';
import SearchBar from '@/components/form/input/SearchBar';
import { FilterBar, FilterBarProps, FilterValues } from '@/components/common/FilterBar';
import { PrintableQRModal } from '@/components/common/PrintableQRModal';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { CloudUpload } from "lucide-react";
import QRCode from "react-qr-code";
import Image from "next/image";

export default function Products() {
  const { _ } = useLingui();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState({ code: '', title: '', subtitle: '' });


  const handleFetchCategories = async () => {
    const res = await getCategories()

    setCategories(res.data.data)
  }

  const filterConfig: Required<Pick<FilterBarProps, "tabs" | "selects" | "searchPlaceholder">> = {
    tabs: [
      { label: _(msg`Barang`), value: "Barang" },
      { label: _(msg`Kuliner`), value: "Kuliner" }
    ],
    selects: [
      {
        label: _(msg`Kategori`),
        key: "category",
        options: categories.map((item) => {
          return { label: item.name, value: item.name }
        }),
      },

    ],
    searchPlaceholder: _(msg`Cari produk...`),
  };


  const [formData, setFormData] = useState<CreateProductPayload>({
    name: '',
    image: '',
    sku: '',
    selling_price: 0,
    category_id: 0,
    product_type: 'barang',
    unit: '',
    expired_date: null,
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
        setError(res.message || _(msg`Gagal memuat data produk`));
      }
    } catch {
      setError(_(msg`Gagal memuat data produk`));
    } finally {
      setLoading(false);
    }
  }, [currentPage]);



  const fetchDropdownData = useCallback(async () => {
    try {
      const catRes = await getAllCategories();
      if (catRes.status) setCategories(catRes.data.data);
    } catch {

    }
  }, []);





  useEffect(() => {
    handleFetchCategories()
  }, [])
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  const resetForm = () => {
    setFormData({
      name: '', sku: '', image: '', selling_price: 0,
      category_id: 0, product_type: 'barang', unit: '',
      expired_date: null,
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const openDetailModal = (product: Product) => {
    setDetailProduct(product);
    setShowDetailModal(true);
  };


  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      image: product.image || '',
      sku: product.sku,
      selling_price: product.selling_price,
      category_id: product.category_id,
      product_type: product.product_type,
      unit: product.unit,
      expired_date: product.expired_date,
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
        setSuccessMsg(editingProduct ? _(msg`Produk berhasil diperbarui`) : _(msg`Produk berhasil ditambahkan`));
        setShowFormModal(false);
        resetForm();
        fetchProducts();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menyimpan produk`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menyimpan`));
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
        setSuccessMsg(_(msg`Produk berhasil dihapus`));
        setShowDeleteModal(false);
        setDeletingProduct(null);
        fetchProducts();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setError(res.message || _(msg`Gagal menghapus produk`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menghapus`));
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };


  const prod = products.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes((filters?.search || '').toLowerCase());

    const activeCategory = filters?.selects?.['category'] ?? '';
    const matchCategory = activeCategory === '' || item.category?.name === activeCategory;

    const activeTab = filters?.tab ?? 'Barang';
    const matchTab = item.product_type.toLowerCase() === activeTab.toLowerCase();

    return matchSearch && matchCategory && matchTab;
  });


  return (
    <div>
      <PageBreadcrumb pageTitle={_(msg`Produk`)} />
      {successMsg && <div className="mb-4"><Alert variant="success" title={_(msg`Berhasil`)} message={successMsg} /></div>}
      {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}
      <div className='flex flex-col gap-4 '>
        <FilterBar
          tabs={filterConfig.tabs}
          selects={filterConfig.selects}
          searchPlaceholder={filterConfig.searchPlaceholder}
          onFilterChange={setFilters}
        />
        <div className="mb-4 flex justify-end">
          <Button size="sm" onClick={openCreateModal}>+ <Trans id="Tambah Produk" /></Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Nama" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">SKU</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Harga Jual" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Stok" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Kategori" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Tipe" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Satuan" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Aksi" /></TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={8}>
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                        <Trans id="Memuat data..." />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : prod.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500"><Trans id="Tidak ada data produk" /></TableCell>
                  </TableRow>
                ) : (
                  prod.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <Image src={product.image} alt={product.name} width={40} height={40} className="rounded-md object-cover w-10 h-10 border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md flex items-center justify-center text-gray-500 text-[10px] leading-tight text-center px-1">No<br/>Img</div>
                          )}
                          <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{product.name}</span>
                        </div>
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
                          <div className="flex flex-wrap items-center gap-2">
                            <button onClick={() => openDetailModal(product)} className="text-blue-500 hover:text-blue-700 text-sm"><Trans id="Detail" /></button>
                            <button onClick={() => openEditModal(product)} className="text-brand-500 hover:text-brand-700 text-sm"><Trans id="Edit" /></button>
                            <button onClick={() => openDeleteModal(product)} className="text-error-500 hover:text-error-700 text-sm"><Trans id="Hapus" /></button>
                            <button onClick={() => { setQrCodeData({ code: product.sku, title: 'QR Produk', subtitle: product.name }); setQrModalOpen(true); }} className="text-gray-500 hover:text-gray-700 text-sm border border-gray-200 px-2 py-0.5 rounded"><Trans id="Cetak QR" /></button>
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

      <PrintableQRModal 
        isOpen={qrModalOpen} 
        onClose={() => setQrModalOpen(false)} 
        code={qrCodeData.code} 
        title={qrCodeData.title}
        subtitle={qrCodeData.subtitle}
      />

      {/* Create/Edit Modal */}
      <Modal isOpen={showFormModal} onClose={() => { setShowFormModal(false); resetForm(); }} className="max-w-lg p-6 lg:p-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingProduct ? <Trans id="Edit Produk" /> : <Trans id="Tambah Produk" />}
        </h4>
        <div className="space-y-4">
          <div>
            <Label><Trans id="Gambar Produk" /></Label>
            <div className="mb-2 w-full">
              {formData.image && (
                <div className="relative w-32 h-32 mb-3 overflow-hidden rounded-lg border border-gray-200">
                  <Image src={formData.image} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <CldUploadWidget
                uploadPreset="inventra"
                onSuccess={(result) => {
                  const res = result.info as CloudinaryUploadWidgetInfo;
                  setFormData({...formData, image: res.secure_url});
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition"
                    onClick={() => open()}
                  >
                    <CloudUpload className="w-4 h-4" />
                    <span><Trans id="Upload Gambar" /></span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
          <div>
            <Label><Trans id="Nama Produk" /></Label>
            <Input type="text" placeholder={_(msg`Nama produk`)} defaultValue={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <Label>SKU</Label>
            <Input type="text" placeholder="SKU" defaultValue={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
          </div>
          <div>
            <Label><Trans id="Harga Jual" /></Label>
            <Input type="number" placeholder="0" defaultValue={formData.selling_price} onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label><Trans id="Kategori" /></Label>
              <Select
                options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                placeholder={_(msg`Pilih kategori`)}
                defaultValue={formData.category_id ? String(formData.category_id) : ''}
                onChange={(v) => setFormData({ ...formData, category_id: Number(v) })}
              />
            </div>
            <div>
              <Label><Trans id="Tipe Produk" /></Label>
              <Select
                options={[{ value: 'barang', label: _(msg`Barang`) }, { value: 'kuliner', label: _(msg`Kuliner`) }]}
                defaultValue={formData.product_type}
                onChange={(v) => setFormData({ ...formData, product_type: v as 'kuliner' | 'barang' })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label><Trans id="Satuan" /></Label>
              <Input type="text" placeholder="pcs, kg, dll" defaultValue={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
            </div>
            <div>
              <Label><Trans id="Tanggal Kadaluarsa" /></Label>
              <Input type="date" defaultValue={formData.expired_date || ''} onChange={(e) => setFormData({ ...formData, expired_date: e.target.value || null })} />
            </div>
          </div>
          <div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ℹ️ <Trans id="Supplier dikelola melalui halaman Pembelian" />
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => { setShowFormModal(false); resetForm(); }}><Trans id="Batal" /></Button>
          <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? <Trans id="Menyimpan..." /> : <Trans id="Simpan" />}</Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="max-w-sm p-6">
        <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Hapus Produk" /></h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Trans id="Apakah Anda yakin ingin menghapus produk" /> <strong>{deletingProduct?.name}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(false)}><Trans id="Batal" /></Button>
          <Button size="sm" onClick={handleDelete} disabled={submitting} className="bg-error-500 hover:bg-error-600">
            {submitting ? <Trans id="Menghapus..." /> : <Trans id="Hapus" />}
          </Button>
        </div>
      </Modal>

      {/* Detail & QR Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} className="max-w-sm p-6 lg:p-8">
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90 text-center"><Trans id="Detail Produk" /></h4>
        {detailProduct && (
          <div className="flex flex-col items-center gap-5">
            {detailProduct?.image ? (
              <Image src={detailProduct.image} alt={detailProduct.name || ''} width={200} height={200} className="w-full h-48 object-cover rounded-xl border border-gray-200" />
            ) : (
              <div className="w-full h-48 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-800">
                <Trans id="Tidak ada gambar" />
              </div>
            )}
            
            <div className="w-full text-center">
              <h5 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{detailProduct?.name}</h5>
              <p className="text-gray-500 text-sm mb-1">{detailProduct?.sku} • {detailProduct ? formatCurrency(detailProduct.selling_price) : ''}</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center w-full max-w-[200px]">
              <p className="text-[10px] font-semibold mb-3 text-gray-400 uppercase tracking-wider"><Trans id="QR Code Produk" /></p>
              <QRCode value={String(detailProduct?.id || '')} size={140} />
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-center w-full">
          <Button size="sm" variant="outline" className="w-full" onClick={() => setShowDetailModal(false)}><Trans id="Tutup" /></Button>
        </div>
      </Modal>
    </div>
  );
}
