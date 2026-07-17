'use client';

import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { sharedStyles, colors, getBadgeStyle, formatNumber } from '../pdfStyles';

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
            Telp: {data.companyPhone} | Email: {data.companyEmail}
          </Text>
        </View>
        <View style={sharedStyles.headerRight}>
          <Text style={sharedStyles.docTitle}>Laporan Rekap Stok</Text>
          <Text style={sharedStyles.docNumber}>No: {data.documentNumber}</Text>
          <Text style={sharedStyles.docDate}>Tanggal: {data.date}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={sharedStyles.infoSection}>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Periode</Text>
          <Text style={sharedStyles.infoValue}>{data.period}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Lokasi</Text>
          <Text style={sharedStyles.infoValue}>{data.location}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Status</Text>
          <Text style={sharedStyles.infoValue}>{data.statusFilter}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Dicetak oleh</Text>
          <Text style={sharedStyles.infoValue}>{data.printedBy} — {data.printedByRole}</Text>
        </View>
      </View>

      {/* Table */}
      <View>
        <View style={sharedStyles.tableHeader}>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.no }]}>No</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.code }]}>Kode Produk</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.name, textAlign: 'left' }]}>Nama Produk</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.batch }]}>Batch</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.loc }]}>Lokasi</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qty }]}>Qty</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.unit }]}>Satuan</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.status }]}>Status</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.expired }]}>Expired</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.entry }]}>Tgl Masuk</Text>
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
          Total item: {data.totalItems}  |  Total qty: {data.totalQtyUnit}
        </Text>
      </View>

      {/* Footer */}
      <Text style={sharedStyles.footer}>
        {data.companyName} | Dokumen Resmi | {data.documentNumber}
      </Text>
    </Page>
  </Document>
);

export default StockRecapReport;
