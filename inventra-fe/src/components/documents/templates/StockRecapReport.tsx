'use client';

import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { sharedStyles, colors, getBadgeStyle, formatNumber } from '../pdfStyles';
import { Trans } from "@lingui/macro";

// ====== Types ======
export interface StockRecapItem {
  no: number;
  productCode: string;
  productName: string;
  batch: string;
  location: string;
  qty: number;
  unit: string;
  status: string;
  expired: string;
  entryDate: string;
}

export interface StockRecapReportData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  documentNumber: string;
  date: string;
  period: string;
  location: string;
  statusFilter: string;
  printedBy: string;
  printedByRole: string;
  items: StockRecapItem[];
  totalItems: number;
  totalQty: number;
  totalQtyUnit: string;
}

const colW = {
  no: '4%',
  code: '9%',
  name: '14%',
  batch: '12%',
  loc: '9%',
  qty: '7%',
  unit: '7%',
  status: '11%',
  expired: '12%',
  entry: '11%',
};

const StockRecapReport: React.FC<{ data: StockRecapReportData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={sharedStyles.page}>
      {/* Header */}
      <View style={sharedStyles.headerContainer}>
        <View style={sharedStyles.headerLeft}>
          <Text style={sharedStyles.companyName}>{data.companyName}</Text>
          <Text style={sharedStyles.companyAddress}>{data.companyAddress}</Text>
          <Text style={sharedStyles.companyContact}>
            {/* @ts-ignore */}<Trans>Telp:</Trans>{data.companyPhone} {/* @ts-ignore */}<Trans>| Email:</Trans>{data.companyEmail}
          </Text>
        </View>
        <View style={sharedStyles.headerRight}>
          <Text style={sharedStyles.docTitle}>{/* @ts-ignore */}<Trans>Laporan Rekap Stok</Trans></Text>
          <Text style={sharedStyles.docNumber}>{/* @ts-ignore */}<Trans>No:</Trans>{data.documentNumber}</Text>
          <Text style={sharedStyles.docDate}>{/* @ts-ignore */}<Trans>Tanggal:</Trans>{data.date}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={sharedStyles.infoSection}>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Periode</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.period}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Lokasi</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.location}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Status</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.statusFilter}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Dicetak oleh</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.printedBy} — {data.printedByRole}</Text>
        </View>
      </View>

      {/* Table */}
      <View>
        <View style={sharedStyles.tableHeader}>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.no }]}>{/* @ts-ignore */}<Trans>No</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.code }]}>{/* @ts-ignore */}<Trans>Kode Produk</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.name, textAlign: 'left' }]}>{/* @ts-ignore */}<Trans>Nama Produk</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.batch }]}>{/* @ts-ignore */}<Trans>Batch</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.loc }]}>{/* @ts-ignore */}<Trans>Lokasi</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qty }]}>{/* @ts-ignore */}<Trans>Qty</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.unit }]}>{/* @ts-ignore */}<Trans>Satuan</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.status }]}>{/* @ts-ignore */}<Trans>Status</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.expired }]}>{/* @ts-ignore */}<Trans>Expired</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.entry }]}>{/* @ts-ignore */}<Trans>Tgl Masuk</Trans></Text>
        </View>

        {data.items.map((item, idx) => {
          const badgeStyle = getBadgeStyle(item.status);
          return (
            <View
              key={idx}
              style={[
                sharedStyles.tableRow,
                { backgroundColor: idx % 2 === 0 ? '#F5F7FA' : '#FFFFFF' },
              ]}
            >
              <Text style={[sharedStyles.tableCell, { width: colW.no }]}>{item.no}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.code }]}>{item.productCode}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.name, textAlign: 'left' }]}>{item.productName}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.batch }]}>{item.batch}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.loc }]}>{item.location}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.qty, fontWeight: 'bold' }]}>{formatNumber(item.qty)}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.unit }]}>{item.unit}</Text>
              <View style={{ width: colW.status, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[sharedStyles.badge, badgeStyle]}>{item.status}</Text>
              </View>
              <Text style={[sharedStyles.tableCell, { width: colW.expired }]}>{item.expired || '—'}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.entry }]}>{item.entryDate}</Text>
            </View>
          );
        })}
      </View>

      {/* Total summary row */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
        <Text style={{ fontSize: 8, color: colors.textLabel }}>
          {/* @ts-ignore */}<Trans>Total item:</Trans>{data.totalItems}  {/* @ts-ignore */}<Trans>|  Total qty:</Trans>{data.totalQtyUnit}
        </Text>
      </View>

      {/* Footer */}
      <Text style={sharedStyles.footer}>
        {data.companyName} {/* @ts-ignore */}<Trans>| Dokumen Resmi |</Trans>{data.documentNumber}
      </Text>
    </Page>
  </Document>
);

export default StockRecapReport;
