'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { toast } from 'sonner';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/ui/alert/Alert';
import { FilterBar, FilterBarProps, FilterValues } from '@/components/common/FilterBar';
import { useTransaction } from '@/hooks/useTransaction';
import { useTranslate } from '@/hooks/useTranslate';
import { msg } from '@lingui/core/macro';
import Select from '@/components/form/Select';
import { getProducts } from '../../../../../services/product.service';
import { getInventories } from '../../../../../services/inventory.service';
import { getLocations } from '../../../../../services/location.service';
import type { Product } from '../../../../../types';
import QRScanner from '@/components/inventory/QRScanner';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Pagination from '@/components/tables/Pagination';
import { Trans } from '@lingui/react';
import { getStockTransactions } from '../../../../../services/stock-transaction.service';
import type { StockTransaction } from '../../../../../types';

interface InventoryItem {
  id: number;
  inventory_code: string;
  quantity: number;
  product?: { name: string };
  status?: { code: string };
}

interface LocationItem {
  id: number;
  name: string;
}

export default function StockAdjustmentPage() {
  const { transact, loading, error } = useTransaction();
  const { _ } = useTranslate();

  const [type, setType] = useState<'ADJUSTMENT_ADD' | 'ADJUSTMENT_SUB'>('ADJUSTMENT_ADD');
  const [items, setItems] = useState<any[]>([
    { product_id: '', inventory_id: '', location_id: '', quantity: 1 }
  ]);
  const [notes, setNotes] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [history, setHistory] = useState<StockTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [filters, setFilters] = useState<FilterValues | null>(null);

  const filterConfig: Required<Pick<FilterBarProps, "tabs" | "selects" | "searchPlaceholder">> = {
    tabs: [
      { label: _(msg`Semua`), value: "Semua" },
      { label: _(msg`Masuk`), value: "IN" },
      { label: _(msg`Keluar`), value: "OUT" },
    ],
    selects: [],
    searchPlaceholder: _(msg`Cari transaksi...`),
  };

  const filteredHistory = history.filter((tx) => {
    const searchString = filters?.search || '';
    const matchSearch = (tx.product?.name?.toLowerCase().includes(searchString.toLowerCase()) || 
                         tx.note?.toLowerCase().includes(searchString.toLowerCase())) ?? true;
    const activeTab = filters?.tab ?? 'Semua';
    const matchTab = activeTab === 'Semua' || tx.type === activeTab;
    return matchSearch && matchTab;
  });

  const fetchHistory = async () => {
    setFetchingHistory(true);
    try {
      const res = await getStockTransactions(currentPage, 10);
      if (res.status) {
        setHistory(res.data.data);
        setTotalPages(res.data.last_page || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      setFetchingData(true);
      try {
        const [prodRes, invRes, locRes] = await Promise.all([
          getProducts(1, 100),
          getInventories({ items: 200 }),
          getLocations({ items: 100 })
        ]);

        if (prodRes.status) setProducts(prodRes.data.data);
        if (invRes.status) setInventories(invRes.data.data.filter((inv: any) => inv.status?.code === 'READY'));
        if (locRes.status) setLocations(locRes.data.data);
      } catch (err) {
        console.error('Failed to fetch data for transactions', err);
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, []);

  const addItem = () => setItems([...items, { product_id: '', inventory_id: '', location_id: '', quantity: 1 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, key: string, value: any) => {
    const updated = [...items];
    updated[index][key] = value;
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalItems = items.map(item => ({
      product_id: item.product_id ? Number(item.product_id) : undefined,
      inventory_id: item.inventory_id ? Number(item.inventory_id) : undefined,
      location_id: item.location_id ? Number(item.location_id) : undefined,
      quantity: Number(item.quantity)
    }));

    const res = await transact(type, finalItems, notes);
    if (res.status) {
      toast.success(_(msg`Penyesuaian stok berhasil diproses!`));
      setItems([{ product_id: '', inventory_id: '', location_id: '', quantity: 1 }]);
      setNotes('');
      fetchHistory();
      setOpenCreateModal(false);
    }
  };

  const productOptions = products.map(p => ({ label: p.name, value: String(p.id) }));
  const locationOptions = locations.map(l => ({ label: l.name, value: String(l.id) }));
  const inventoryOptions = inventories.map(inv => ({
    label: `[${inv.inventory_code}] ${inv.product?.name || 'Unknown'} - (Stok: ${inv.quantity})`,
    value: String(inv.id)
  }));

  return (
    <div className='flex flex-col space-y-4 pb-20'>
      <PageBreadcrumb pageTitle={_(msg`Penyesuaian Stok`)} />
      
      <div className='flex flex-col gap-4 '>
        <FilterBar
          tabs={filterConfig.tabs}
          selects={filterConfig.selects}
          searchPlaceholder={filterConfig.searchPlaceholder}
          onFilterChange={setFilters}
        />
        <div className="mb-4 flex justify-end">
          <Button size="sm" onClick={() => setOpenCreateModal(true)}>+ <Trans id="Tambah Penyesuaian" /></Button>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
 
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Tipe" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Produk" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Kuantitas" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Catatan" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Tanggal" /></TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {fetchingHistory ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={5}>
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                        <Trans id="Memuat data..." />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredHistory.length === 0 ? (
                  <TableRow><TableCell className="px-5 py-8 text-center text-gray-500"><Trans id="Belum ada riwayat penyesuaian" /></TableCell></TableRow>
                ) : (
                  filteredHistory.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge size="sm" color={tx.type === 'IN' ? 'success' : tx.type === 'OUT' ? 'error' : 'warning'}>
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start font-medium text-theme-sm text-gray-800 dark:text-white/90">
                        {tx.product?.name || '-'}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <span className={`font-medium text-theme-sm ${tx.type === 'IN' ? 'text-success-600 dark:text-success-400' : tx.type === 'OUT' ? 'text-error-600 dark:text-error-400' : 'text-warning-600 dark:text-warning-400'}`}>
                          {tx.type === 'IN' ? '+' : tx.type === 'OUT' ? '-' : ''}{tx.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {tx.note || '-'}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {new Date(tx.created_at).toLocaleDateString('id-ID')}
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

      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} className="max-w-3xl">
        <div className="p-6">
          <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
            <Trans id="Tambah Penyesuaian Stok" />
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{_(msg`Tipe Penyesuaian`)}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="ADJUSTMENT_ADD" checked={type === 'ADJUSTMENT_ADD'} onChange={() => setType('ADJUSTMENT_ADD')} className="text-brand-500 w-4 h-4 cursor-pointer" />
                  <span className="text-sm">{_(msg`Penambahan (+)`)}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="ADJUSTMENT_SUB" checked={type === 'ADJUSTMENT_SUB'} onChange={() => setType('ADJUSTMENT_SUB')} className="text-brand-500 w-4 h-4 cursor-pointer" />
                  <span className="text-sm">{_(msg`Pengurangan (-)`)}</span>
                </label>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col gap-4 p-4 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-lg relative group">
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)} className="absolute -top-2 -right-2 bg-error-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-sm z-10">
                      &times;
                    </button>
                  )}

                  {type === 'ADJUSTMENT_ADD' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">{_(msg`Produk`)}</label>
                        <Select
                          options={productOptions}
                          value={item.product_id}
                          onChange={(val) => updateItem(index, 'product_id', val)}
                          placeholder={_(msg`Pilih Produk`)}
                          isSearchable
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">{_(msg`Lokasi Simpan`)}</label>
                        <Select
                          options={locationOptions}
                          value={item.location_id}
                          onChange={(val) => updateItem(index, 'location_id', val)}
                          placeholder={_(msg`Pilih Lokasi`)}
                          isSearchable
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">{_(msg`Batch Inventaris (Ready)`)}</label>
                      <Select
                        options={inventoryOptions}
                        value={item.inventory_id}
                        onChange={(val) => updateItem(index, 'inventory_id', val)}
                        placeholder={_(msg`Pilih Batch`)}
                        isSearchable
                      />
                    </div>
                  )}

                  <div className="w-full md:w-32">
                    <label className="block text-xs font-medium text-gray-500 mb-1">{_(msg`Kuantitas`)}</label>
                    <input required type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} className="w-full text-sm p-2.5 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700" placeholder="0" />
                  </div>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" size="sm" onClick={addItem} className="mb-6 mb-8 border-dashed">+ {_(msg`Tambah Item Lain`)}</Button>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{_(msg`Catatan`)}</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full text-sm p-3 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 h-24 resize-none" placeholder={_(msg`Alasan penyesuaian...`)}></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800 gap-3">
              <Button type="button" variant="outline" onClick={() => setOpenCreateModal(false)} className="px-8">
                {_(msg`Batal`)}
              </Button>
              <Button type="submit" disabled={loading || fetchingData} className="px-8">
                {loading ? _(msg`Memproses...`) : _(msg`Kirim Penyesuaian`)}
              </Button>
            </div>

          </form>
        </div>
      </Modal>

      <div className="hidden">
        <QRScanner onScan={(e) => console.log(e)} />
      </div>
    </div>
  );
}
