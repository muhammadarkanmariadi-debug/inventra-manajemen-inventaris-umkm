'use client';

import React, { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { toast } from 'sonner';
import { uploadDocument } from '../../../../../services/document.service';
import { getInventories } from '../../../../../services/inventory.service';
import { getStockTransactions } from '../../../../../services/stock-transaction.service';
import { getSales } from '../../../../../services/sale.service';
import { useAuth } from '@/context/AuthContext';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

// Template imports
import StockMovementReport, { StockMovementReportData } from '@/components/documents/templates/StockMovementReport';
import RejectReport, { RejectReportData } from '@/components/documents/templates/RejectReport';
import DeliveryNote, { DeliveryNoteData } from '@/components/documents/templates/DeliveryNote';
import ProblematicGoodsReport, { ProblematicGoodsReportData } from '@/components/documents/templates/ProblematicGoodsReport';
import StockRecapReport, { StockRecapReportData } from '@/components/documents/templates/StockRecapReport';

import {
  FileTextIcon,
  TruckIcon,
  AlertTriangleIcon,
  PackageIcon,
  ClipboardListIcon,
  DownloadIcon,
  SaveIcon,
  EyeIcon,
  Loader2Icon,
  XIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react';

// ====== Document types config ======
type DocType = 'LPB' | 'BAR' | 'SJ' | 'LBB' | 'LRS';

interface DocTypeConfig {
  key: DocType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const docTypes: DocTypeConfig[] = [
  {
    key: 'LPB',
    label: 'Laporan Pergerakan Barang',
    description: 'Melacak pergerakan masuk/keluar stok per produk',
    icon: <ClipboardListIcon className="w-6 h-6" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    key: 'BAR',
    label: 'Berita Acara Reject',
    description: 'Dokumentasi barang yang ditolak/reject dari supplier',
    icon: <AlertTriangleIcon className="w-6 h-6" />,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/30',
  },
  {
    key: 'SJ',
    label: 'Surat Jalan',
    description: 'Dokumen pengiriman barang ke tujuan',
    icon: <TruckIcon className="w-6 h-6" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
  },
  {
    key: 'LBB',
    label: 'Laporan Barang Bermasalah',
    description: 'Rekapitulasi barang dengan status bermasalah',
    icon: <PackageIcon className="w-6 h-6" />,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/30',
  },
  {
    key: 'LRS',
    label: 'Laporan Rekap Stok',
    description: 'Ringkasan seluruh stok inventaris',
    icon: <FileTextIcon className="w-6 h-6" />,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/30',
  },
];

// ====== Sample data generators ======
// ====== Map data logic ======
function mapToLPB(transactions: any[], business: any, user: any): StockMovementReportData {
  const today = new Date();
  
  let totalIn = 0;
  let totalOut = 0;

  const items = transactions.map((t, idx) => {
    const isMasuk = t.type === 'ADD' || t.type === 'IN';
    const isKeluar = t.type === 'SUB' || t.type === 'OUT';
    
    if (isMasuk) totalIn += t.quantity;
    else totalOut += Math.abs(t.quantity);

    // Some fake balance calc just for display
    return {
      no: idx + 1,
      date: new Date(t.created_at).toLocaleDateString('id-ID'),
      type: t.type,
      qtyIn: isMasuk ? t.quantity : null,
      qtyOut: isKeluar ? Math.abs(t.quantity) : null,
      balance: 0, // Should be calculated if we have running balance
      refOrder: t.reference_number || '-',
      location: t.location?.name || 'Gudang Utama',
      operator: t.user?.username || 'Sistem',
      batch: t.inventory?.inventory_code || '-',
    };
  });

  return {
    companyName: business?.name || 'PT. Maju Bersama Industri',
    companyAddress: business?.address || 'Jl. Raya Industri No. 45, Surabaya',
    companyPhone: business?.phone || '(031) 555-0101',
    companyEmail: business?.email || 'info@perusahaan.com',
    documentNumber: `LPB/${today.getFullYear()}/${today.getMonth() + 1}/${Math.floor(Math.random() * 1000)}`,
    date: today.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
    period: `${today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
    productName: 'Semua Produk', // if filtered by product, change this
    productCode: 'ALL',
    location: 'Semua Gudang',
    printedBy: user?.username || 'User',
    printedByRole: 'Admin',
    items,
    totalIn,
    totalOut,
    endingBalance: totalIn - totalOut,
  };
}

function mapToBAR(rejectInventory: any, business: any, user: any): RejectReportData {
  const today = new Date();
  const companyName = business?.name || 'PT. Maju Bersama Industri';

  const items = rejectInventory ? [
    {
      no: 1,
      productName: rejectInventory.product?.name || 'Produk Tidak Diketahui',
      batchCode: rejectInventory.inventory_code || '-',
      qtyReceived: `${rejectInventory.quantity} Unit`,
      qtyRejected: `${rejectInventory.quantity} Unit`,
      reason: 'Tidak lolos QC / Reject By System',
    }
  ] : [];

  return {
    companyName,
    companyAddress: business?.address || 'Jl. Raya Industri No. 45, Surabaya',
    companyPhone: business?.phone || '(031) 555-0101',
    companyEmail: business?.email || 'info@perusahaan.com',
    documentNumber: `BAR/${today.getFullYear()}/${today.getMonth() + 1}/${Math.floor(Math.random() * 1000)}`,
    date: today.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
    introText: `Pada hari ini ${today.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}, bertempat di ${companyName}, telah dilakukan pemeriksaan kualitas. Berdasarkan hasil inspeksi, barang berikut dinyatakan tidak memenuhi standar.`,
    supplier: '-', // Needs purchase info ideally
    supplierAddress: '-',
    purchaseOrder: '-',
    receiveDate: rejectInventory ? new Date(rejectInventory.created_at).toLocaleDateString('id-ID') : today.toLocaleDateString('id-ID'),
    inspectedBy: user?.username || 'User QC',
    inspectedByRole: 'QC',
    inspectionLocation: rejectInventory?.location?.name || 'Gudang Utama',
    items,
    followUpItems: [
      'Status barang diubah menjadi REJECT di sistem.',
      'Segera koordinasi dengan supplier atau musnahkan.',
    ],
    closingText: 'Demikian berita acara ini dibuat dengan sebenarnya.',
    createdByName: user?.username || 'User',
  };
}

function mapToSJ(sale: any, business: any, user: any): DeliveryNoteData {
  const today = new Date();
  
  const items = sale?.items?.map((item: any, idx: number) => ({
    no: idx + 1,
    productCode: item.product?.sku || '-',
    productName: item.product?.name || '-',
    batch: '-', // usually tracked elsewhere
    unit: 'Unit',
    qtyShipped: item.quantity,
    notes: '',
  })) || [];

  return {
    companyName: business?.name || 'PT. Maju Bersama Industri',
    companyAddress: business?.address || 'Jl. Raya Industri',
    companyPhone: business?.phone || '(031) 555-0101',
    companyEmail: business?.email || 'info@perusahaan.com',
    documentNumber: sale?.invoice_number || `SJ/${today.getFullYear()}/${Math.floor(Math.random() * 1000)}`,
    date: sale ? new Date(sale.created_at).toLocaleDateString('id-ID') : today.toLocaleDateString('id-ID'),
    senderName: business?.name || 'Perusahaan',
    senderAddress: business?.address || '-',
    senderPhone: business?.phone || '-',
    receiverName: sale?.customer_name || 'Pelanggan Tunai',
    receiverAddress: sale?.customer_address || '-',
    receiverPhone: sale?.customer_phone || '-',
    orderNumber: sale?.invoice_number || '-',
    shippedBy: user?.username || 'Logistik',
    shippedByRole: 'Pengirim',
    vehicle: '-',
    shipDate: sale ? new Date(sale.created_at).toLocaleDateString('id-ID') : today.toLocaleDateString('id-ID'),
    items,
    footerNote: 'Catatan: Barang telah diperiksa sebelum pengiriman.',
    preparedByName: user?.username || 'Pembuat',
    preparedByRole: 'Admin',
  };
}

function mapToLBB(inventories: any[], business: any, user: any): ProblematicGoodsReportData {
  const today = new Date();
  
  const problematic = inventories.filter(inv => ['REJECT', 'ON_HOLD', 'UNRELEASED'].includes(inv.status?.code));
  
  const items = problematic.map((inv, idx) => ({
    no: idx + 1,
    productName: inv.product?.name || 'Produk X',
    batch: inv.inventory_code,
    qty: `${inv.quantity} unit`,
    status: inv.status?.code || 'REJECT',
    reason: inv.notes || 'Terindikasi masalah pada QC',
    foundDate: new Date(inv.created_at).toLocaleDateString('id-ID'),
    pic: 'Sistem',
  }));

  const totalReject = problematic.filter(i => i.status?.code === 'REJECT').length;
  const totalOnHold = problematic.filter(i => i.status?.code === 'ON_HOLD').length;
  const totalUnreleased = problematic.filter(i => i.status?.code === 'UNRELEASED').length;
  const totalQty = problematic.reduce((sum, inv) => sum + inv.quantity, 0);

  return {
    companyName: business?.name || 'PT. Maju Bersama Industri',
    companyAddress: business?.address || '-',
    companyPhone: business?.phone || '-',
    companyEmail: business?.email || '-',
    documentNumber: `LBB/${today.getFullYear()}/${Math.floor(Math.random()*1000)}`,
    date: today.toLocaleDateString('id-ID'),
    period: 'Global Stock',
    statusFilter: 'Reject, On Hold, Unreleased',
    printedBy: user?.username || 'User',
    printedByRole: 'Admin',
    items,
    totalReject,
    totalOnHold,
    totalUnreleased,
    totalQtyBermasalah: totalQty,
    totalQtyUnit: `${totalQty} unit`,
    createdByName: user?.username || 'Admin',
    createdByRole: 'System',
  };
}

function mapToLRS(inventories: any[], business: any, user: any): StockRecapReportData {
  const today = new Date();
  
  let totalQty = 0;

  const items = inventories.map((inv, idx) => {
    totalQty += inv.quantity;
    return {
      no: idx + 1,
      productCode: inv.product?.sku || '-',
      productName: inv.product?.name || '-',
      batch: inv.inventory_code,
      location: inv.location?.name || 'Gudang Utama',
      qty: inv.quantity,
      unit: 'Unit',
      status: inv.status?.code || '-',
      expired: '-',
      entryDate: new Date(inv.created_at).toLocaleDateString('id-ID'),
    };
  });

  return {
    companyName: business?.name || 'PT. Maju Bersama Industri',
    companyAddress: business?.address || '-',
    companyPhone: business?.phone || '-',
    companyEmail: business?.email || '-',
    documentNumber: `LRS/${today.getFullYear()}/${Math.floor(Math.random()*1000)}`,
    date: today.toLocaleDateString('id-ID'),
    period: 'Sampai Saat Ini',
    location: 'Semua Gudang',
    statusFilter: 'Semua',
    printedBy: user?.username || 'Admin',
    printedByRole: 'Sistem',
    items,
    totalItems: items.length,
    totalQty,
    totalQtyUnit: `${totalQty} unit`,
  };
}

// ====== Main Component ======
export default function DocumentsPage() {
  const { user, business } = useAuth();
  const [selectedType, setSelectedType] = useState<DocType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentBlob, setCurrentBlob] = useState<Blob | null>(null);

  const generatePdf = useCallback(async (type: DocType) => {
    setIsGenerating(true);
    setPreviewUrl(null);
    setCurrentBlob(null);

    try {
      let doc: React.ReactElement;

      switch (type) {
        case 'LPB': {
          const txRes = await getStockTransactions(1, 100);
          doc = <StockMovementReport data={mapToLPB(txRes.data?.data || [], business, user)} />;
          break;
        }
        case 'BAR': {
          const invRes = await getInventories({ items: 100, status: 'REJECT' });
          const latestReject = invRes.data?.data?.[0];
          doc = <RejectReport data={mapToBAR(latestReject, business, user)} />;
          break;
        }
        case 'SJ': {
          const salesRes = await getSales(1, 10);
          const latestSale = salesRes.data?.data?.[0];
          doc = <DeliveryNote data={mapToSJ(latestSale, business, user)} />;
          break;
        }
        case 'LBB': {
          const invRes = await getInventories({ items: 200 });
          doc = <ProblematicGoodsReport data={mapToLBB(invRes.data?.data || [], business, user)} />;
          break;
        }
        case 'LRS': {
          const invRes = await getInventories({ items: 500 });
          doc = <StockRecapReport data={mapToLRS(invRes.data?.data || [], business, user)} />;
          break;
        }
        default:
          return;
      }

      const blob = await pdf(doc as any).toBlob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setCurrentBlob(blob);
      setSelectedType(type);
      toast.success('PDF berhasil di-generate!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal generate PDF');
    } finally {
      setIsGenerating(false);
    }
  }, [business, user]);

  const saveToDatabase = useCallback(async () => {
    if (!currentBlob || !selectedType) return;

    setIsSaving(true);
    try {
      const config = docTypes.find(d => d.key === selectedType)!;
      const formData = new FormData();
      formData.append('file', currentBlob, `${selectedType}-document.pdf`);
      formData.append('type', selectedType);
      formData.append('title', config.label);

      const res = await uploadDocument(formData);

      if (res.status) {
        toast.success(`Dokumen berhasil disimpan: ${res.data.document_number}`);
      } else {
        toast.error(res.message || 'Gagal menyimpan dokumen');
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal menyimpan dokumen ke server');
    } finally {
      setIsSaving(false);
    }
  }, [currentBlob, selectedType]);

  const downloadPdf = useCallback(() => {
    if (!previewUrl || !selectedType) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `${selectedType}-${new Date().toISOString().slice(0, 10)}.pdf`;
    a.click();
  }, [previewUrl, selectedType]);

  const closePreview = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCurrentBlob(null);
    setSelectedType(null);
  }, [previewUrl]);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <PageBreadcrumb pageTitle="Buat Dokumen Inventaris" />
      <div className="mb-8 mt-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Pilih jenis dokumen untuk di-generate. Dokumen akan dibuat dalam format PDF dan dapat disimpan ke database.
        </p>
      </div>

      {/* Document Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {docTypes.map((dt) => (
          <button
            key={dt.key}
            onClick={() => generatePdf(dt.key)}
            disabled={isGenerating}
            className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left
              ${selectedType === dt.key
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-lg shadow-brand-500/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md bg-white dark:bg-gray-800'
              }
              ${isGenerating ? 'opacity-60 cursor-wait' : 'cursor-pointer'}
            `}
          >
            <div className={`inline-flex p-3 rounded-xl mb-4 ${dt.bgColor}`}>
              <span className={dt.color}>{dt.icon}</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {dt.label}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {dt.description}
            </p>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <PlusIcon className="w-5 h-5 text-brand-500" />
            </div>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2Icon className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Generating dokumen PDF...</p>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {previewUrl && !isGenerating && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-xl">
          {/* Preview Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3">
              <EyeIcon className="w-5 h-5 text-brand-500" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Preview: {docTypes.find(d => d.key === selectedType)?.label}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Dokumen siap diunduh atau disimpan ke database
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadPdf}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200
                  hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <DownloadIcon className="w-4 h-4" />
                Unduh PDF
              </button>
              <button
                onClick={saveToDatabase}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  bg-brand-500 text-white hover:bg-brand-600 transition-colors
                  disabled:opacity-60 disabled:cursor-wait"
              >
                {isSaving ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <SaveIcon className="w-4 h-4" />
                )}
                Simpan ke Database
              </button>
              <button
                onClick={closePreview}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PDF Embed */}
          <div className="p-4 bg-gray-100 dark:bg-gray-900">
            <iframe
              src={previewUrl}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
              style={{ height: '80vh' }}
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
