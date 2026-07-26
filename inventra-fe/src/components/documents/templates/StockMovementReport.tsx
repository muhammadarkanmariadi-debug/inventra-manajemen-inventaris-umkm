"use client";

import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { sharedStyles, colors, getBadgeStyle, formatNumber, formatDate } from '../pdfStyles';
import { Trans } from "@lingui/macro";

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
            {/* @ts-ignore */}<Trans>Telp:</Trans>{data.companyPhone} {/* @ts-ignore */}<Trans>| Email:</Trans>{data.companyEmail}
          </Text>
        </View>
        <View style={sharedStyles.headerRight}>
          <Text style={sharedStyles.docTitle}>{/* @ts-ignore */}<Trans>Laporan Pergerakan Barang</Trans></Text>
          <Text style={sharedStyles.docNumber}>{/* @ts-ignore */}<Trans>No:</Trans>{data.documentNumber}</Text>
          <Text style={sharedStyles.docDate}>{/* @ts-ignore */}<Trans>Tanggal:</Trans>{data.date}</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={sharedStyles.infoSection}>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Periode</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.period}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Produk</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.productName} ({data.productCode})</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Lokasi</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.location}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Dicetak oleh</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.printedBy} — {data.printedByRole}</Text>
        </View>
      </View>

      {/* Table */}
      <View>
        <View style={sharedStyles.tableHeader}>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.no }]}>#</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.date }]}>{/* @ts-ignore */}<Trans>Tanggal</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.batch }]}>{/* @ts-ignore */}<Trans>Batch</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.type }]}>{/* @ts-ignore */}<Trans>Tipe</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qtyIn }]}>{/* @ts-ignore */}<Trans>Qty Masuk</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qtyOut }]}>{/* @ts-ignore */}<Trans>Qty Keluar</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.balance }]}>{/* @ts-ignore */}<Trans>Saldo</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.ref }]}>{/* @ts-ignore */}<Trans>Ref. Order</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.loc }]}>{/* @ts-ignore */}<Trans>Lokasi</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.op }]}>{/* @ts-ignore */}<Trans>Operator</Trans></Text>
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
            <Text style={sharedStyles.summaryLabel}>{/* @ts-ignore */}<Trans>Total Masuk</Trans></Text>
            <Text style={sharedStyles.summaryValue}>{formatNumber(data.totalIn)}</Text>
          </View>
          <View style={sharedStyles.summaryCell}>
            <Text style={sharedStyles.summaryLabel}>{/* @ts-ignore */}<Trans>Total Keluar</Trans></Text>
            <Text style={sharedStyles.summaryValue}>{formatNumber(data.totalOut)}</Text>
          </View>
          <View style={[sharedStyles.summaryCell, { borderRightWidth: 0 }]}>
            <Text style={sharedStyles.summaryLabel}>{/* @ts-ignore */}<Trans>Saldo Akhir</Trans></Text>
            <Text style={sharedStyles.summaryValue}>{formatNumber(data.endingBalance)}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <Text style={sharedStyles.footer}>
        {data.companyName} {/* @ts-ignore */}<Trans>| Dokumen Resmi |</Trans>{data.documentNumber}
      </Text>
    </Page>
  </Document>
);

export default StockMovementReport;
