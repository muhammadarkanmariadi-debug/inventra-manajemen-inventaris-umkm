'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  getStatisticSales,
  getStatisticProducts,
  getStatisticFinancial,
} from '../../../../services/dashboard.service';
import Badge from '@/components/ui/badge/Badge';
import Alert from '@/components/ui/alert/Alert';
import {
  ArrowUpIcon, ArrowDownIcon, BoxIconLine,
  ShootingStarIcon, DollarLineIcon, GroupIcon,
} from '@/icons/index';
import LineChartOne from '@/components/charts/line/LineChartOne';
import DatePicker from '@/components/form/date-picker';
import Label from '@/components/form/Label';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import BarChartOne from '@/components/charts/bar/BarChartOne';
import BarChartGroup from '@/components/charts/bar/BarChartGroup';

interface SalesStat {
  yearmonth: string;
  total_penjualan: number;
}

interface TopProduct {
  id: number;
  name: string;
  category_name: string;
  penjualan_produk: number;
}

export default function DashboardPage() {
  const { _ } = useLingui();
  const [salesStats, setSalesStats] = useState<SalesStat[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);
  const [startDate, setStartDate] = useState(`${new Date().getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState(`${new Date().getFullYear()}-12-31`);
  const [financialStats, setFinancialStats] = useState({ income: 0, expense: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, productsRes, financialRes] = await Promise.all([
        getStatisticSales(startDate, endDate),
        getStatisticProducts(),
        getStatisticFinancial(startDate, endDate),
      ]);

      if (salesRes.status) {
        setSalesStats(salesRes.data.data || []);
        setTotalSales(salesRes.data.total_penjualan);
      }

      if (productsRes.status) {
        setTopProducts(productsRes.data || []);
      }

      if (financialRes.status) {
        setFinancialStats(financialRes.data || { income: 0, expense: 0 });
      }
    } catch {
      toast.error(_(msg`Gagal memuat data dashboard`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const latestMonth = salesStats.at(-1) ?? null;
  const prevMonth = salesStats.length > 1 ? salesStats.at(-2) : null;
  const salesTrend = latestMonth && prevMonth
    ? ((latestMonth.total_penjualan - prevMonth.total_penjualan) / (prevMonth.total_penjualan || 1) * 100)
    : 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          <Trans id="Dashboard" />
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          <Trans id="Ringkasan bisnis Anda" />
        </p>
      </div>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">

        {/* Total Penjualan */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
              <ShootingStarIcon className="text-brand-500" />
            </div>
            {salesTrend !== 0 && (
              <Badge size="sm" color={salesTrend > 0 ? 'success' : 'error'}>
                <span className="flex items-center gap-1">
                  {salesTrend > 0 ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                  {Math.abs(salesTrend).toFixed(1)}%
                </span>
                Lebih rendah dari bulan lalu
              </Badge>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {loading ? '...' : totalSales}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Trans id="Total Penjualan" />
            </p>
          </div>
        </div>

        {/* Income Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-50 dark:bg-success-500/10">
            <DollarLineIcon className="text-success-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {loading ? '...' : formatCurrency(financialStats.income)}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Trans id="Pemasukan" />
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-error-50 dark:bg-error-500/10">
            <DollarLineIcon className="text-error-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {loading ? '...' : formatCurrency(financialStats.expense)}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Trans id="Pengeluaran" />
            </p>
          </div>
        </div>

        {/* Penjualan Bulan Ini */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning-50 dark:bg-warning-500/10">
            <BoxIconLine className="text-warning-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {loading ? '...' : (latestMonth?.total_penjualan ?? 0)}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Trans id="Penjualan Bulan Ini" />
            </p>
          </div>
        </div>
      </div>

      <div className="block">
        <div className="rounded-xl shadow-lg p-4">
          <div className="flex justify-end gap-4">
            <div className="items-center gap-2 flex">
              <Label htmlFor="start-date"><Trans id="From" /></Label>
              <DatePicker
                id="start-date"
                placeholder="dd/mm/yy"
                onChange={(date: any) => {
                  if (date) setStartDate(new Date(date).toISOString().split('T')[0]);
                }}
              />
            </div>
            <div className="items-center gap-2 flex">
              <Label htmlFor="end-date"><Trans id="To" /></Label>
              <DatePicker
                id="end-date"
                placeholder="dd/mm/yy"
                onChange={(date: any) => {
                  if (date) setEndDate(new Date(date).toISOString().split('T')[0]);
                }}
              />
            </div>
          </div>
          <LineChartOne data={salesStats} />
      
        </div>

        {/* Top Products */}
        <div className="mt-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              <Trans id="Produk Terlaris" />
            </h4>
            {loading ? (
              <div className="flex h-40 items-center justify-center text-gray-400">
                <Trans id="Memuat data..." />
              </div>
            ) : topProducts.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-gray-400">
                <Trans id="Belum ada data produk" />
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${index === 0 ? 'bg-brand-500' : 'bg-gray-400'}`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800 dark:text-white/90">{product.name}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{product.category_name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-brand-500">{product.penjualan_produk}</span>
                      <p className="text-xs text-gray-400"><Trans id="terjual" /></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}