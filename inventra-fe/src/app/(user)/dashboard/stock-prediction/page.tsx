'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/ui/alert/Alert';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { analyzeInventory } from '../../../../../services/dashboard.service';
import { predictBatch } from '../../../../../services/prediction.service';
import { getProducts } from '../../../../../services/product.service';
import type { Product, PredictionResult, SalesRecord } from '../../../../../types';
import { FilterBar, FilterValues } from '@/components/common/FilterBar';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { apiGet } from '../../../../../lib/api';
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { DownloadIcon } from "lucide-react";
import { exportToExcel } from '@/utils/exportExcel';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const STOCK_STATUS_COLOR: Record<string, 'error' | 'warning' | 'info' | 'success' | 'light'> = {
  CRITICAL: 'error',
  LOW: 'warning',
  WARNING: 'info',
  SAFE: 'success',
  UNKNOWN: 'light',
};

const TREND_COLOR: Record<string, 'error' | 'warning' | 'success' | 'light'> = {
  NAIK: 'success',
  TURUN: 'error',
  STABIL: 'warning',
  INSUFFICIENT_DATA: 'light',
};

export default function StockPrediction() {
  const { _ } = useLingui();

  const [products, setProducts] = useState<Product[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [predError, setPredError] = useState<string>('');
  const [predicting, setPredicting] = useState(false);
  const [predResults, setPredResults] = useState<PredictionResult[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [forecastDays, setForecastDays] = useState<number>(14);
  const [fetchingHistory, setFetchingHistory] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts(1, 100);
      if (res.status) setProducts(res.data.data);
    } catch {
      toast.error(_(msg`Gagal memuat data produk`));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);


  const handlePredict = async () => {
    if (!selectedProductId) {
      toast.error(_(msg`Harap pilih produk terlebih dahulu`));
      return;
    }

    setPredicting(true);
    setFetchingHistory(true);
    setPredResults([]);

    try {
      // Ambil data historis dari Laravel
      const json = await apiGet(`/statistic/prediksi/${selectedProductId}`);
      console.log(json)
      setFetchingHistory(false);

      if (!json.status || !json.data || json.data.length < 2) {
        setPredError(
          json.message ||
            _(msg`Data historis tidak cukup. Minimal diperlukan 2 hari transaksi dalam 30 hari terakhir.`)
        );
        setPredicting(false);
        return;
      }

      const records: SalesRecord[] = json.data;
      const results = await predictBatch(records, forecastDays);
      setPredResults(results);
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.detail ||
        _(msg`Gagal menghubungi API prediksi. Pastikan server FastAPI sedang berjalan.`);
      toast.error(errMsg);
    } finally {
      setPredicting(false);
      setFetchingHistory(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: _(msg`Habis`), color: 'error' as const, priority: 0 };
    if (stock <= 5) return { label: _(msg`Kritis`), color: 'error' as const, priority: 1 };
    if (stock <= 15) return { label: _(msg`Rendah`), color: 'warning' as const, priority: 2 };
    if (stock <= 50) return { label: _(msg`Sedang`), color: 'info' as const, priority: 3 };
    return { label: _(msg`Aman`), color: 'success' as const, priority: 4 };
  };

  const sortedProducts = [...products].sort((a, b) => {
    return getStockStatus(a.stock).priority - getStockStatus(b.stock).priority;
  });

  const criticalCount = products.filter((p) => p.stock <= 5).length;
  const lowCount = products.filter((p) => p.stock > 5 && p.stock <= 15).length;
  const safeCount = products.filter((p) => p.stock > 15).length;

  const filterConfig = {
    tabs: [
      { label: _(msg`Semua`), value: 'all' },
      { label: _(msg`Kritis`), value: 'critical' },
      { label: _(msg`Rendah`), value: 'low' },
      { label: _(msg`Aman`), value: 'safe' },
    ],
    searchPlaceholder: _(msg`Cari produk...`),
  };

  const filteredSortedProducts = sortedProducts.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes((filters?.search || '').toLowerCase());
    let matchTab = true;
    if (filters?.tab && filters?.tab !== 'all') {
      const s = product.stock;
      if (filters.tab === 'critical') matchTab = s <= 5;
      else if (filters.tab === 'low') matchTab = s > 5 && s <= 15;
      else if (filters.tab === 'safe') matchTab = s > 15;
    }
    return matchSearch && matchTab;
  });

  const handleExport = () => {
    const exportData = filteredSortedProducts.map(product => {
      const status = getStockStatus(product.stock);
      return {
        Produk: product.name,
        SKU: product.sku,
        Kategori: product.category?.name || '-',
        Stok: product.stock,
        Status: status.label,
        Tipe: product.product_type
      };
    });
    exportToExcel(exportData, 'Status_Stok_Produk');
  };

  const buildChartOptions = (result: PredictionResult): ApexCharts.ApexOptions => ({
    chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: [3, 1, 1] },
    colors: ['#465fff', '#22c55e', '#f59e0b'],
    xaxis: {
      categories: result.prophet_forecast.map((f) => f.ds),
      labels: { rotate: -35, style: { fontSize: '11px' } },
    },
    yaxis: { labels: { formatter: (v: number) => v.toFixed(0) } },
    tooltip: { shared: true, y: { formatter: (v: number) => `${v.toFixed(1)} unit` } },
    legend: { position: 'top' },
    fill: {
      type: ['solid', 'gradient', 'gradient'],
      gradient: { opacityFrom: 0.3, opacityTo: 0.05 },
    },
  });

  const buildChartSeries = (result: PredictionResult) => [
    { name: 'Prediksi (yhat)', data: result.prophet_forecast.map((f) => f.yhat) },
    { name: 'Batas Atas', data: result.prophet_forecast.map((f) => f.yhat_upper) },
    { name: 'Batas Bawah', data: result.prophet_forecast.map((f) => f.yhat_lower) },
  ];

  const SpinnerIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );

  return (
    <PermissionWrapper permission="Lihat Transaksi Stok" breadcrumb="Prediksi & Analisis Stok">

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-error-200 bg-error-50 p-5 dark:border-error-800 dark:bg-error-500/10">
          <div className="text-3xl font-bold text-error-600 dark:text-error-400">
            {loading ? '...' : criticalCount}
          </div>
          <p className="mt-1 text-sm text-error-600 dark:text-error-400">
            <Trans id="Produk Stok Kritis (<=5)" />
          </p>
        </div>
        <div className="rounded-2xl border border-warning-200 bg-warning-50 p-5 dark:border-warning-800 dark:bg-warning-500/10">
          <div className="text-3xl font-bold text-warning-600 dark:text-warning-400">
            {loading ? '...' : lowCount}
          </div>
          <p className="mt-1 text-sm text-warning-600 dark:text-warning-400">
            <Trans id="Produk Stok Rendah (6-15)" />
          </p>
        </div>
        <div className="rounded-2xl border border-success-200 bg-success-50 p-5 dark:border-success-800 dark:bg-success-500/10">
          <div className="text-3xl font-bold text-success-600 dark:text-success-400">
            {loading ? '...' : safeCount}
          </div>
          <p className="mt-1 text-sm text-success-600 dark:text-success-400">
            <Trans id="Produk Stok Aman (> 15)" />
          </p>
        </div>
      </div>

      {/* Filter + Stock Table */}
      <div className="flex flex-col gap-4 mb-4">
        <FilterBar {...filterConfig} onFilterChange={setFilters} />
        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" /> <Trans id="Export Excel" />
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-6">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            <Trans id="Status Stok Seluruh Produk" />
          </h4>
        </div>
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Produk" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">SKU</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Kategori" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Stok" /></TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Tipe" /></TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500" colSpan={6}>
                      <div className="flex items-center justify-center">
                        <SpinnerIcon className="animate-spin h-5 w-5 mr-2 text-brand-500" />
                        <Trans id="Memuat data..." />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500">
                      <Trans id="Tidak ada data produk" />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSortedProducts.map((product) => {
                    const status = getStockStatus(product.stock);
                    return (
                      <TableRow
                        key={product.id}
                        className={product.stock <= 5 ? 'bg-error-50/50 dark:bg-error-500/5' : ''}
                      >
                        <TableCell className="px-5 py-4 text-start">
                          <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{product.name}</span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{product.sku}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{product.category?.name || '-'}</TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <span className={`font-bold text-theme-sm ${product.stock <= 5 ? 'text-error-600 dark:text-error-400' : 'text-gray-800 dark:text-white/90'}`}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge size="sm" color={status.color}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge size="sm" color={product.product_type === 'kuliner' ? 'info' : 'light'}>
                            {product.product_type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* FastAPI Prediction Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
        <div className="mb-5">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            <Trans id="Prediksi Stok (FastAPI)" />
          </h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            <Trans id="Prediksi tren penjualan menggunakan Linear Regression + Prophet berdasarkan data transaksi 30 hari terakhir." />
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-3">
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
              <Trans id="Produk" />
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(Number(e.target.value));
                setPredResults([]);
              }}
            >
              <option value="">{_(msg`-- Pilih Produk --`)}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
              <Trans id="Hari Prediksi" />
            </label>
            <input
              type="number"
              min={1}
              max={90}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              value={forecastDays}
              onChange={(e) => setForecastDays(Number(e.target.value))}
            />
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
          <Trans id="Data historis diambil otomatis dari transaksi keluar (OUT) 30 hari terakhir." />
        </p>

        <div className="flex items-center gap-3 mb-5">
          <Button size="sm" onClick={handlePredict} disabled={predicting}>
            {predicting ? (
              <span className="flex items-center gap-2">
                <SpinnerIcon className="animate-spin h-4 w-4" />
                {fetchingHistory
                  ? <Trans id="Mengambil data historis..." />
                  : <Trans id="Memprediksi..." />
                }
              </span>
            ) : (
              <Trans id="Jalankan Prediksi" />
            )}
          </Button>
          {predResults.length > 0 && (
            <button
              className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
              onClick={() => { setPredResults([]); }}
            >
              <Trans id="Reset" />
            </button>
          )}
        </div>


        {predicting && (
          <div className="flex flex-col items-center justify-center py-12">
            <SpinnerIcon className="animate-spin h-10 w-10 text-brand-500 mb-4" />
            <p className="text-sm text-gray-500">
              {fetchingHistory
                ? <Trans id="Mengambil data historis transaksi..." />
                : <Trans id="Menjalankan model prediksi..." />
              }
            </p>
          </div>
        )}

        {!predicting && predResults.length > 0 && predResults.map((result) => {
          const productName =
            products.find((p) => p.id === result.product_id)?.name ||
            `Produk #${result.product_id}`;
          const statusColor = STOCK_STATUS_COLOR[result.stock_status.status] ?? 'light';
          const trendColor = TREND_COLOR[result.linear_regression.trend] ?? 'light';

          return (
            <div key={result.product_id} className="mb-8">
              <h5 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-3">
                {productName}
              </h5>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1"><Trans id="Stok Saat Ini" /></p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{result.current_stock}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1"><Trans id="Rata-rata Penjualan/Hari" /></p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{result.average_daily_sales}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status Stok</p>
                  <div className="mt-1">
                    <Badge size="sm" color={statusColor}>{result.stock_status.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{result.stock_status.message}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1"><Trans id="Tren Penjualan" /></p>
                  <div className="mt-1">
                    <Badge size="sm" color={trendColor}>{result.linear_regression.trend}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    R² {result.linear_regression.r_squared} · Slope {result.linear_regression.slope}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 mb-5 dark:border-brand-800 dark:bg-brand-500/10">
                <p className="text-sm font-medium text-brand-700 dark:text-brand-300"><Trans id="Rekomendasi" /></p>
                <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">{result.recommendation}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] mb-5">
                <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <Trans id="Grafik Prediksi Penjualan" />
                </h6>
                <ReactApexChart
                  type="line"
                  height={280}
                  options={buildChartOptions(result)}
                  series={buildChartSeries(result)}
                />
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="p-4 border-b border-gray-100 dark:border-white/[0.05]">
                  <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Trans id="Tabel Forecast Harian" />
                  </h6>
                </div>
                <div className="max-w-full overflow-x-auto">
                  <div className="min-w-[500px]">
                    <Table>
                      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                          <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Tanggal" /></TableCell>
                          <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Prediksi (yhat)" /></TableCell>
                          <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Batas Bawah" /></TableCell>
                          <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"><Trans id="Batas Atas" /></TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {result.prophet_forecast.map((f) => (
                          <TableRow key={f.ds}>
                            <TableCell className="px-5 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300">{f.ds}</TableCell>
                            <TableCell className="px-5 py-3 font-semibold text-gray-800 text-start text-theme-sm dark:text-white/90">{f.yhat}</TableCell>
                            <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{f.yhat_lower}</TableCell>
                            <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{f.yhat_upper}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {!predicting && predResults.length === 0 && !predError && (
          <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
            <Trans id='Pilih produk lalu klik "Jalankan Prediksi" untuk melihat hasil prediksi.' />
          </div>
        )}
      </div>

    </PermissionWrapper>
  );
}