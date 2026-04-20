'use client';

import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { sharedStyles, colors, getBadgeStyle, formatNumber } from '../pdfStyles';

// ====== Types ======
export interface ProblematicItem {
  no: number;
  productName: string;
  batch: string;
  qty: string;
  status: string;
  reason: string;
  foundDate: string;
  pic: string;
}

export interface ProblematicGoodsReportData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  documentNumber: string;
  date: string;
  period: string;
  statusFilter: string;
  printedBy: string;
  printedByRole: string;
  items: ProblematicItem[];
  totalReject: number;
  totalOnHold: number;
  totalUnreleased: number;
  totalQtyBermasalah: number;
  totalQtyUnit: string;
  createdByName: string;
  createdByRole: string;
}

const colW = {
  no: '4%',
  product: '14%',
  batch: '13%',
  qty: '7%',
  status: '10%',
  reason: '24%',
  date: '12%',
  pic: '10%',
};

const ProblematicGoodsReport: React.FC<{ data: ProblematicGoodsReportData }> = ({ data }) => (
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
          <Text style={sharedStyles.docTitle}>Laporan Barang Bermasalah</Text>
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
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.product, textAlign: 'left' }]}>Produk</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.batch }]}>Batch</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qty }]}>Qty</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.status }]}>Status</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.reason, textAlign: 'left' }]}>Alasan</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.date }]}>Tgl Temuan</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.pic }]}>PIC</Text>
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
              <Text style={[sharedStyles.tableCell, { width: colW.product, textAlign: 'left' }]}>{item.productName}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.batch }]}>{item.batch}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.qty }]}>{item.qty}</Text>
              <View style={{ width: colW.status, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[sharedStyles.badge, badgeStyle]}>{item.status}</Text>
              </View>
              <Text style={[sharedStyles.tableCell, { width: colW.reason, textAlign: 'left', fontSize: 7 }]}>{item.reason}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.date }]}>{item.foundDate}</Text>
              <Text style={[sharedStyles.tableCell, { width: colW.pic }]}>{item.pic}</Text>
            </View>
          );
        })}
      </View>

      {/* Summary */}
      <View style={sharedStyles.summaryBox}>
        <View style={sharedStyles.summaryRow}>
          <View style={sharedStyles.summaryCell}>
            <Text style={sharedStyles.summaryLabel}>Reject</Text>
            <Text style={[sharedStyles.summaryValue, { color: colors.accent.red }]}>{data.totalReject} batch</Text>
          </View>
          <View style={sharedStyles.summaryCell}>
            <Text style={sharedStyles.summaryLabel}>On Hold</Text>
            <Text style={[sharedStyles.summaryValue, { color: colors.accent.yellow }]}>{data.totalOnHold} batch</Text>
          </View>
          <View style={sharedStyles.summaryCell}>
            <Text style={sharedStyles.summaryLabel}>Unreleased</Text>
            <Text style={[sharedStyles.summaryValue, { color: colors.accent.purple }]}>{data.totalUnreleased} batch</Text>
          </View>
          <View style={[sharedStyles.summaryCell, { borderRightWidth: 0 }]}>
            <Text style={sharedStyles.summaryLabel}>Total Qty Bermasalah</Text>
            <Text style={sharedStyles.summaryValue}>{data.totalQtyUnit}</Text>
          </View>
        </View>
      </View>

      {/* Signatures */}
      <View style={sharedStyles.signatureSection}>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>Dibuat oleh</Text>
          <View style={sharedStyles.signatureLine} />
          <Text style={sharedStyles.signatureName}>{data.createdByName}</Text>
          <Text style={sharedStyles.signatureRole}>{data.createdByRole}</Text>
        </View>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>Diperiksa oleh</Text>
          <Text style={sharedStyles.signatureDots}>...............................</Text>
          <Text style={sharedStyles.signatureRole}>Manajer QC</Text>
        </View>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>Disetujui oleh</Text>
          <Text style={sharedStyles.signatureDots}>...............................</Text>
          <Text style={sharedStyles.signatureRole}>Manajer Gudang</Text>
        </View>
      </View>

      <Text style={sharedStyles.footer}>
        {data.companyName} | Dokumen Resmi | {data.documentNumber}
      </Text>
    </Page>
  </Document>
);

export default ProblematicGoodsReport;
