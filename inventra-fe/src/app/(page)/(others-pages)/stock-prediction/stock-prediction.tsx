'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/ui/alert/Alert';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { analyzeInventory } from '../../../../../services/dashboard.service';
import { getProducts } from '../../../../../services/product.service';
import type { Product } from '../../../../../types';
import { Trans } from '@lingui/react';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';

export default function StockPrediction() {
  const { _ } = useLingui();
  const [products, setProducts] = useState<Product[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts(1, 100);
      if (res.status) {
        setProducts(res.data.data);
      }
    } catch {
      setError(_(msg`Gagal memuat data produk`));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError('');
    setAnalysis('');
    try {
      const res = await analyzeInventory();
      if (res.status) {
        const text = typeof res.data === 'string'
          ? res.data
          : (res.data?.text || res.data?.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(res.data));
        setAnalysis(text);
      } else {
        setError(res.message || _(msg`Gagal menganalisis stok`));
      }
    } catch {
      setError(_(msg`Terjadi kesalahan saat menganalisis`));
    } finally {
      setAnalyzing(false);
    }
  };

  // Determine stock status
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: _(msg`Habis`), color: 'error' as const, priority: 0 };
    if (stock <= 5) return { label: _(msg`Kritis`), color: 'error' as const, priority: 1 };
    if (stock <= 15) return { label: _(msg`Rendah`), color: 'warning' as const, priority: 2 };
    if (stock <= 50) return { label: _(msg`Sedang`), color: 'info' as const, priority: 3 };
    return { label: _(msg`Aman`), color: 'success' as const, priority: 4 };
  };

  // Sort products: critical stock first
  const sortedProducts = [...products].sort((a, b) => {
    const statusA = getStockStatus(a.stock);
    const statusB = getStockStatus(b.stock);
    return statusA.priority - statusB.priority;
  });

  const criticalCount = products.filter((p) => p.stock <= 5).length;
  const lowCount = products.filter((p) => p.stock > 5 && p.stock <= 15).length;
  const safeCount = products.filter((p) => p.stock > 15).length;

  return (
    <div>
      <PageBreadcrumb pageTitle={_(msg`Prediksi & Analisis Stok`)} />

      {error && <div className="mb-4"><Alert variant="error" title="Error" message={error} /></div>}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl border border-error-200 bg-error-50 p-5 dark:border-error-800 dark:bg-error-500/10">
          <div className="text-3xl font-bold text-error-600 dark:text-error-400">{loading ? '...' : criticalCount}</div>
          <p className="mt-1 text-sm text-error-600 dark:text-error-400"><Trans id="Produk Stok Kritis (≤5)" /></p>
        </div>
        <div className="rounded-2xl border border-warning-200 bg-warning-50 p-5 dark:border-warning-800 dark:bg-warning-500/10">
          <div className="text-3xl font-bold text-warning-600 dark:text-warning-400">{loading ? '...' : lowCount}</div>
          <p className="mt-1 text-sm text-warning-600 dark:text-warning-400"><Trans id="Produk Stok Rendah (6-15)" /></p>
        </div>
        <div className="rounded-2xl border border-success-200 bg-success-50 p-5 dark:border-success-800 dark:bg-success-500/10">
          <div className="text-3xl font-bold text-success-600 dark:text-success-400">{loading ? '...' : safeCount}</div>
          <p className="mt-1 text-sm text-success-600 dark:text-success-400"><Trans id="Produk Stok Aman (> 15)" /></p>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">🤖 <Trans id="Prediksi AI (Gemini)" /></h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400"><Trans id="AI akan menganalisis inventori dan memberikan rekomendasi restock, risiko kehabisan stok, dan strategi pengelolaan" /></p>
          </div>
          <Button size="sm" onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                <Trans id="Menganalisis..." />
              </span>
            ) : <>🔍 <Trans id="Analisis Stok" /></>}
          </Button>
        </div>

        {analyzing && (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="animate-spin h-10 w-10 text-brand-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            <p className="text-sm text-gray-500"><Trans id="AI sedang menganalisis produk..." /></p>
          </div>
        )}

        {analysis && !analyzing && (
          <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
            <div className="prose prose-sm max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {analysis}
            </div>
          </div>
        )}

        {!analysis && !analyzing && (
          <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
            <Trans id='Klik "Analisis Stok" untuk mendapatkan prediksi dan rekomendasi dari AI' />
          </div>
        )}
      </div>

      {/* Stock Status Table */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90"><Trans id="Status Stok Seluruh Produk" /></h4>
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
                        <svg className="animate-spin h-5 w-5 mr-2 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                        <Trans id="Memuat data..." />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500"><Trans id="Tidak ada data produk" /></TableCell>
                  </TableRow>
                ) : (
                  sortedProducts.map((product) => {
                    const status = getStockStatus(product.stock);
                    return (
                      <TableRow key={product.id} className={product.stock <= 5 ? 'bg-error-50/50 dark:bg-error-500/5' : ''}>
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
    </div>
  );
}
