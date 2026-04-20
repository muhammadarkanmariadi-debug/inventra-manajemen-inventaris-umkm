'use client';

import React, { useState, useEffect } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/ui/alert/Alert';
import { useTransaction } from '@/hooks/useTransaction';
import { useTranslate } from '@/hooks/useTranslate';
import { msg } from '@lingui/core/macro';
import Select from '@/components/form/Select';
import { getProducts } from '../../../../../services/product.service';
import { getInventories } from '../../../../../services/inventory.service';
import { getLocations } from '../../../../../services/location.service';
import type { Product } from '../../../../../types';
import QRScanner from '@/components/inventory/QRScanner';


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

export default function TransactionsPage() {
  const { transact, loading, error } = useTransaction();
  const { _ } = useTranslate();
  const [success, setSuccess] = useState('');

  const [type, setType] = useState<'ADJUSTMENT_ADD' | 'ADJUSTMENT_SUB'>('ADJUSTMENT_ADD');
  const [items, setItems] = useState<any[]>([
    { product_id: '', inventory_id: '', location_id: '', quantity: 1 }
  ]);
  const [notes, setNotes] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [fetchingData, setFetchingData] = useState(false);

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
      setSuccess(_(msg`Penyesuaian stok berhasil diproses!`));
      setItems([{ product_id: '', inventory_id: '', location_id: '', quantity: 1 }]);
      setNotes('');
      setTimeout(() => setSuccess(''), 4000);
    }
  };

  const productOptions = products.map(p => ({ label: p.name, value: String(p.id) }));
  const locationOptions = locations.map(l => ({ label: l.name, value: String(l.id) }));
  const inventoryOptions = inventories.map(inv => ({
    label: `[${inv.inventory_code}] ${inv.product?.name || 'Unknown'} - (Stok: ${inv.quantity})`,
    value: String(inv.id)
  }));

  return (
    <div className='flex'>
      <PageBreadcrumb pageTitle={_(msg`Penyesuaian Stok`)} />

      <div className="max-w-3xl mt-4 ">
        <div className="bg-white dark:bg-gray-800/50 p-6 lg:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          {success && <div className="mb-6"><Alert variant="success" title={_(msg`Berhasil`)} message={success} /></div>}
          {error && <div className="mb-6"><Alert variant="error" title={_(msg`Error`)} message={error} /></div>}

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

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button type="submit" disabled={loading || fetchingData} className="w-full md:w-auto px-8">
                {loading ? _(msg`Memproses...`) : _(msg`Kirim Penyesuaian`)}
              </Button>
            </div>

          </form>

        </div>

      </div>
      <QRScanner onScan={(e) => console.log(e)} />
    </div>
  );
}
