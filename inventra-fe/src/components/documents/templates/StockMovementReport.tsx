'use client';

import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { sharedStyles, colors, getBadgeStyle, formatNumber, formatDate } from '../pdfStyles';

// ====== Types ======
export interface StockMovementItem {
  no: number;
  date: string;
  batch: string;
  type: 'MASUK' | 'KELUAR' | 'ADJUST';
  qtyIn: number | null;
  qtyOut: number | null;
  balance: number;
  refOrder: string;
  location: string;
  operator: string;
}

export interface StockMovementReportData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  documentNumber: string;
  date: string;
  period: string;
  productName: string;
  productCode: string;
  location: string;
  printedBy: string;
  printedByRole: string;
  items: StockMovementItem[];
  totalIn: number;
  totalOut: number;
  endingBalance: number;
}

// ====== Column widths ======
const colW = {
  no: '5%',
  date: '10%',
  batch: '13%',
  type: '9%',
  qtyIn: '9%',
  qtyOut: '9%',
  balance: '9%',
  ref: '13%',
  loc: '12%',
  op: '11%',
};

const StockMovementReport: React.FC<{ data: StockMovementReportData }> = ({ data }) => (
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
          <Text style={sharedStyles.docTitle}>Laporan Pergerakan Barang</Text>
          <Text style={sharedStyles.docNumber}>No: {data.documentNumber}</Text>
          <Text style={sharedStyles.docDate}>Tanggal: {data.date}</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={sharedStyles.infoSection}>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Periode</Text>
          <Text style={sharedStyles.infoValue}>{data.period}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Produk</Text>
          <Text style={sharedStyles.infoValue}>{data.productName} ({data.productCode})</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Lokasi</Text>
          <Text style={sharedStyles.infoValue}>{data.location}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Dicetak oleh</Text>
          <Text style={sharedStyles.infoValue}>{data.printedBy} — {data.printedByRole}</Text>
        </View>
      </View>

      {/* Table */}
      <View>
        <View style={sharedStyles.tableHeader}>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.no }]}>#</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.date }]}>Tanggal</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.batch }]}>Batch</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.type }]}>Tipe</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qtyIn }]}>Qty Masuk</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qtyOut }]}>Qty Keluar</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.balance }]}>Saldo</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.ref }]}>Ref. Order</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.loc }]}>Lokasi</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.op }]}>Operator</Text>
        </View>

        {data.items.map((item, idx) => {
          const badgeStyle = getBadgeStyle(item.type);
          return (
            <View
              key={idx}
              style={[
                sharedStyles.tableRow,
                { backgroundColor: idx % 2 === 0 ? '#F5F7FA' : '#FFFFFF' },
              ]}
            >
              <Text style={[sharedStyles.tableCell, { width: colW.no }]}>{item.no}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.date }]}>{item.date}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.batch }]}>{item.batch}</Text>
              <View style={{ width: colW.type, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[sharedStyles.badge, badgeStyle]}>{item.type}</Text>
              </View>
              <Text style={[sharedStyles.tableCell, { width: colW.qtyIn }]}>
                {item.qtyIn !== null ? formatNumber(item.qtyIn) : '—'}
              </Text>
              <Text style={[sharedStyles.tableCell, { width: colW.qtyOut }]}>
                {item.qtyOut !== null ? formatNumber(item.qtyOut) : '—'}
              </Text>
              <Text style={[sharedStyles.tableCell, { width: colW.balance }]}>
                {formatNumber(item.balance)}
              </Text>
              <Text style={[sharedStyles.tableCell, { width: colW.ref }]}>{item.refOrder}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.loc }]}>{item.location}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.op }]}>{item.operator}</Text>
            </View>
          );
        })}
      </View>

      {/* Summary */}
      <View style={sharedStyles.summaryBox}>
        <View style={sharedStyles.summaryRow}>
          <View style={sharedStyles.summaryCell}>
            <Text style={sharedStyles.summaryLabel}>Total Masuk</Text>
            <Text style={sharedStyles.summaryValue}>{formatNumber(data.totalIn)}</Text>
          </View>
          <View style={sharedStyles.summaryCell}>
            <Text style={sharedStyles.summaryLabel}>Total Keluar</Text>
            <Text style={sharedStyles.summaryValue}>{formatNumber(data.totalOut)}</Text>
          </View>
          <View style={[sharedStyles.summaryCell, { borderRightWidth: 0 }]}>
            <Text style={sharedStyles.summaryLabel}>Saldo Akhir</Text>
            <Text style={sharedStyles.summaryValue}>{formatNumber(data.endingBalance)}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <Text style={sharedStyles.footer}>
        {data.companyName} | Dokumen Resmi | {data.documentNumber}
      </Text>
    </Page>
  </Document>
);

export default StockMovementReport;
