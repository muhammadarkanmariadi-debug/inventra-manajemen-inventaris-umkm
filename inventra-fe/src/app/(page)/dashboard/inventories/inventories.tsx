'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { pdf } from '@react-pdf/renderer';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import Pagination from '@/components/tables/Pagination';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Alert from '@/components/ui/alert/Alert';
import { FilterBar, FilterBarProps, FilterValues } from '@/components/common/FilterBar';
import { PrintableQRModal } from '@/components/common/PrintableQRModal';
import { getInventories, getInventory } from '../../../../../services/inventory.service';
import DeliveryNote, { DeliveryNoteData } from '@/components/documents/templates/DeliveryNote';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Trans } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { useTranslate } from '@/hooks/useTranslate';
import { getStatusTranslation } from '@/utils/statusTranslations';
import { FileTextIcon } from 'lucide-react';

interface InventoryItem {
  id: number;
  inventory_code: string;
  quantity: number;
  created_at: string;
  product?: { id: number; name: string };
  status?: { id: number; code: string; name: string };
  location?: { id: number; name: string };
  logs?: Array<{
    id: number;
    action: string;
    notes?: string;
    created_at: string;
    from_status?: { code: string; name: string };
    to_status?: { code: string; name: string };
    location?: { id: number; name: string };
    user?: { name: string };
  }>;
}

function getStatusColor(code?: string): 'primary' | 'success' | 'warning' | 'error' | 'light' {
  switch (code) {
    case 'READY': return 'success';
    case 'UNRELEASED': return 'primary';
    case 'ON_HOLD': return 'warning';
    case 'REJECT': return 'error';
    default: return 'light';
  }
}

export default function InventoriesPage() {
  const { _, t } = useTranslate();
  const { user, business } = useAuth();
  const router = useRouter();
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const filterConfig: Required<Pick<FilterBarProps, "tabs" | "selects" | "searchPlaceholder">> = {
    tabs: [
      { label: _(msg`Semua`), value: "" },
      { label: _(msg`Unreleased`), value: "UNRELEASED" },
      { label: _(msg`Ready`), value: "READY" },
      { label: _(msg`On Hold`), value: "ON_HOLD" },
      { label: _(msg`Reject`), value: "REJECT" },
    ],
    selects: [],
    searchPlaceholder: _(msg`Cari kode inventaris atau produk...`),
  };

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState({ code: '', title: '', subtitle: '' });

  // Surat Jalan state
  const [showSJModal, setShowSJModal] = useState(false);
  const [sjItem, setSjItem] = useState<InventoryItem | null>(null);
  const [sjGenerating, setSjGenerating] = useState(false);
  const [sjForm, setSjForm] = useState({
    receiverName: '', receiverAddress: '', receiverPhone: '', vehicle: '', notes: ''
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getInventories({ page: currentPage, items: 50 });
      setInventories(res.data?.data || []);
      setTotalPages(res.data?.last_page || 1);
    } catch (err: any) {
      toast.error(err?.message || _(msg`Gagal memuat data inventaris.`));
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewDetail = async (id: number) => {
    setDetailLoading(true);
    setShowDetailModal(true);
    try {
      const res = await getInventory(id);
      setDetailItem(res.data);
    } catch {
      setDetailItem(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Client-side filtering (matching products page pattern)
  const filtered = inventories.filter((inv) => {
    const matchSearch = (inv.inventory_code + ' ' + (inv.product?.name || ''))
      .toLowerCase()
      .includes((filters?.search || '').toLowerCase());

    const activeTab = filters?.tab ?? '';
    const matchTab = activeTab === '' || inv.status?.code === activeTab;

    return matchSearch && matchTab;
  });

  const openSJModal = (inv: InventoryItem) => {
    setSjItem(inv);
    setSjForm({ receiverName: '', receiverAddress: '', receiverPhone: '', vehicle: '', notes: '' });
    setShowSJModal(true);
  };

  const generateSuratJalan = async () => {
    if (!sjItem) return;
    setSjGenerating(true);
    try {
      const today = new Date();
      const sjData: DeliveryNoteData = {
        companyName: business?.name || 'Perusahaan',
        companyAddress: business?.address || '-',
        companyPhone: business?.phone || '-',
        companyEmail: business?.email || '-',
        documentNumber: `SJ/${today.getFullYear()}/${sjItem.id}`,
        date: today.toLocaleDateString('id-ID'),
        senderName: business?.name || 'Perusahaan',
        senderAddress: business?.address || '-',
        senderPhone: business?.phone || '-',
        receiverName: sjForm.receiverName || 'Penerima',
        receiverAddress: sjForm.receiverAddress || '-',
        receiverPhone: sjForm.receiverPhone || '-',
        orderNumber: sjItem.inventory_code,
        shippedBy: user?.username || 'Logistik',
        shippedByRole: 'Pengirim',
        vehicle: sjForm.vehicle || '-',
        shipDate: today.toLocaleDateString('id-ID'),
        items: [{
          no: 1,
          productCode: sjItem.product?.name?.substring(0, 10) || '-',
          productName: sjItem.product?.name || '-',
          batch: sjItem.inventory_code,
          unit: 'Unit',
          qtyShipped: sjItem.quantity,
          notes: sjForm.notes || '',
        }],
        footerNote: sjForm.notes || 'Barang telah diperiksa sebelum pengiriman.',
        preparedByName: user?.username || 'Admin',
        preparedByRole: 'Staff',
      };
      const blob = await pdf(<DeliveryNote data={sjData} /> as any).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `surat-jalan-${sjItem.inventory_code}-${today.toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(_(msg`Surat Jalan berhasil diunduh`));
      setShowSJModal(false);
    } catch (err) {
      console.error(err);
      toast.error(_(msg`Gagal generate Surat Jalan`));
    } finally {
      setSjGenerating(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle={_(msg`Stok Inventaris`)} />
      <div className="flex flex-col gap-4">
        <FilterBar
          tabs={filterConfig.tabs}
          selects={filterConfig.selects}
          searchPlaceholder={filterConfig.searchPlaceholder}
          onFilterChange={setFilters}
        />

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1102px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Kode Inventaris" /></TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Produk" /></TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Jumlah" /></TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Status" /></TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Lokasi" /></TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Tanggal" /></TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Aksi" /></TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {loading ? (
                    <TableRow>
                      <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={7}>
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                          Memuat data...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={7}>Tidak ada data inventaris.</TableCell>
                    </TableRow>
                  ) : (
                    filtered.map(inv => (
                      <TableRow key={inv.id}>
                        <TableCell className="px-5 py-4 text-start">
                          <span className="font-mono font-medium text-gray-800 text-theme-sm dark:text-white/90">{inv.inventory_code}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{inv.product?.name || '-'}</TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge size="sm" color="primary">{inv.quantity}</Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge size="sm" color={getStatusColor(inv.status?.code)}>{inv.status?.code ? getStatusTranslation(inv.status.code, _) : '-'}</Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{inv.location?.name || '-'}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {new Date(inv.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="flex items-center gap-2">
                        
                            <button onClick={() => router.push(`/dashboard/scan?code=${inv.inventory_code}`)} className="text-brand-500 hover:text-brand-700 text-sm">Scan</button>
                            <button onClick={() => { setQrCodeData({ code: inv.inventory_code, title: `QR Inventaris`, subtitle: `Produk: ${inv.product?.name || '-'}` }); setQrModalOpen(true); }} className="text-gray-500 hover:text-gray-700 text-sm border border-gray-200 px-2 py-0.5 rounded ml-1">Cetak QR</button>
                            <button
                              onClick={() => openSJModal(inv)}
                              className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 border border-green-200 dark:border-green-700 rounded"
                              title={_(msg`Cetak Surat Jalan`)}
                            >
                              <FileTextIcon className="w-4 h-4" />
                            </button>
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
      </div>

      <PrintableQRModal 
        isOpen={qrModalOpen} 
        onClose={() => setQrModalOpen(false)} 
        code={qrCodeData.code} 
        title={qrCodeData.title}
        subtitle={qrCodeData.subtitle}
      />

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => { setShowDetailModal(false); setDetailItem(null); }} className="max-w-xl">
        <div className="p-5">
          <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Detail Inventaris</h4>
          {detailLoading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              Memuat...
            </div>
          ) : detailItem ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Kode</p>
                  <p className="font-mono font-semibold text-gray-800 dark:text-white">{detailItem.inventory_code}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Produk</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{detailItem.product?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Jumlah</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{detailItem.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400"><Trans id="Status" /></p>
                  <Badge color={getStatusColor(detailItem.status?.code)}>{detailItem.status?.code ? getStatusTranslation(detailItem.status.code, _) : '-'}</Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Lokasi</p>
                  <p className="text-gray-700 dark:text-gray-300">{detailItem.location?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dibuat</p>
                  <p className="text-gray-700 dark:text-gray-300">{new Date(detailItem.created_at).toLocaleString('id-ID')}</p>
                </div>
              </div>

           
            </div>
          ) : (
            <p className="text-red-500">Gagal memuat detail.</p>
          )}
        </div>
      </Modal>

      {/* Surat Jalan Modal */}
      <Modal isOpen={showSJModal} onClose={() => setShowSJModal(false)} className="max-w-md p-6 lg:p-10">
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          <Trans id="Cetak Surat Jalan" />
        </h4>
        {sjItem && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{sjItem.product?.name || '-'}</p>
            <p className="text-xs text-gray-500">Batch: {sjItem.inventory_code} &middot; Qty: {sjItem.quantity}</p>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <Label><Trans id="Nama Penerima" /></Label>
            <Input type="text" placeholder={_(msg`Nama penerima`)} defaultValue={sjForm.receiverName} onChange={(e) => setSjForm({ ...sjForm, receiverName: e.target.value })} />
          </div>
          <div>
            <Label><Trans id="Alamat Penerima" /></Label>
            <Input type="text" placeholder={_(msg`Alamat penerima`)} defaultValue={sjForm.receiverAddress} onChange={(e) => setSjForm({ ...sjForm, receiverAddress: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label><Trans id="No. Telepon" /></Label>
              <Input type="text" placeholder={_(msg`No. telepon`)} defaultValue={sjForm.receiverPhone} onChange={(e) => setSjForm({ ...sjForm, receiverPhone: e.target.value })} />
            </div>
            <div>
              <Label><Trans id="Kendaraan" /></Label>
              <Input type="text" placeholder={_(msg`Kendaraan pengiriman`)} defaultValue={sjForm.vehicle} onChange={(e) => setSjForm({ ...sjForm, vehicle: e.target.value })} />
            </div>
          </div>
          <div>
            <Label><Trans id="Catatan" /></Label>
            <Input type="text" placeholder={_(msg`Catatan tambahan`)} defaultValue={sjForm.notes} onChange={(e) => setSjForm({ ...sjForm, notes: e.target.value })} />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowSJModal(false)}><Trans id="Batal" /></Button>
          <Button size="sm" onClick={generateSuratJalan} disabled={sjGenerating}>
            {sjGenerating ? <Trans id="Generating..." /> : <Trans id="Cetak & Unduh PDF" />}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
