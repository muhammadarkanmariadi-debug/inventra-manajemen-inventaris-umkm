'use client';

import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import QRScanner from '@/components/inventory/QRScanner';
import StatusActionPanel from '@/components/inventory/StatusActionPanel';
import InventoryLogTimeline from '@/components/inventory/InventoryLogTimeline';
import { useInventory } from '@/hooks/useInventory';
import Alert from '@/components/ui/alert/Alert';
import Badge from '@/components/ui/badge/Badge';
import { getLocations } from '../../../../../services/location.service';
import { updateInventoryStatus } from '../../../../../services/inventory.service';


export default function ScanPage() {
  const { inventory, loading, error, scan, updateStatus } = useInventory();
  const [manualCode, setManualCode] = useState('');
  const [options, setOptions] = useState<{ key: any, value: any }[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const locations = await getLocations();
      if (locations) {
        setOptions(locations.data.data.map((location: any) => ({ key: location.name, value: location.id })));
      }
    };
    fetchLocations();
  }, []);


  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      scan(manualCode.trim());
    }
  };



  return (
    <div>
      <PageBreadcrumb pageTitle="Pemindai QR Inventaris" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Scan QR Code</h3>
            <QRScanner onScan={(code) => scan(code)} />

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Atau masukkan kode manual:</p>
              <form onSubmit={handleManualScan} className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Mis. INV-A1B2C3"
                  className="flex-1 text-sm p-2 border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700"
                />
                <button type="submit" className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-600 transition" disabled={loading}>
                  Cari
                </button>
              </form>
            </div>

            {loading && <p className="text-sm text-brand-500 mt-4 text-center animate-pulse">Memproses...</p>}
            {error && <div className="mt-4"><Alert variant="error" title="Error" message={error} /></div>}
          </div>

          {inventory && (
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detail Inventaris</h3>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500">Produk</span>
                  <span className="font-medium text-gray-900 dark:text-white">{inventory.product?.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500">Kode QR / Batch</span>
                  <span className="font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded-md">{inventory.inventory_code}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500">Kuantitas</span>
                  <span className="font-bold text-gray-900 dark:text-white text-lg">{inventory.quantity} <span className="text-sm font-normal text-gray-500">{inventory.product?.unit}</span></span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500">Lokasi</span>
                  <span className="font-bold text-gray-900 dark:text-white text-lg">{inventory.location?.name || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500">Status Saat Ini</span>
                  <Badge size="sm" color={inventory.status?.code === 'READY' ? 'success' : inventory.status?.code === 'REJECT' ? 'error' : inventory.status?.code === 'ON_HOLD' ? 'warning' : 'light'}>
                    {inventory.status?.name || inventory.status?.code}
                  </Badge>
                </div>
              </div>

              <div className="mt-6">
                <StatusActionPanel
                  inventory={inventory}
                  onUpdateStatus={(id, status, notes, location_id) => updateStatus(id, status, notes, location_id)}
                  options={options}
                />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          {inventory ? (
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Riwayat Rekam Jejak (Logs)</h3>
              <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <InventoryLogTimeline logs={inventory.logs} />
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/30 p-10 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 h-full flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h4 className="text-gray-500 dark:text-gray-400 font-medium mb-1">Tidak ada data</h4>
              <p className="text-sm text-gray-400 dark:text-gray-500">Pindai kode QR untuk melihat rekam jejak inventaris.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
