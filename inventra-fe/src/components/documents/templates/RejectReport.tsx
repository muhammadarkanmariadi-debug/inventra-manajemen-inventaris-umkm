'use client';

import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { sharedStyles, colors, getBadgeStyle, formatNumber, formatDate } from '../pdfStyles';

// ====== Types ======
export interface RejectItem {
  no: number;
  productName: string;
  batchCode: string;
  qtyReceived: string;
  qtyRejected: string;
  reason: string;
}

export interface RejectReportData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  documentNumber: string;
  date: string;
  introText: string;
  supplier: string;
  supplierAddress: string;
  purchaseOrder: string;
  receiveDate: string;
  inspectedBy: string;
  inspectedByRole: string;
  inspectionLocation: string;
  items: RejectItem[];
  followUpItems: string[];
  closingText: string;
  createdByName: string;
}

const colW = {
  no: '5%',
  product: '18%',
  batch: '15%',
  qtyRecv: '12%',
  qtyReject: '12%',
  reason: '38%',
};

const RejectReport: React.FC<{ data: RejectReportData }> = ({ data }) => (
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
          <Text style={sharedStyles.docTitle}>Berita Acara Reject Barang</Text>
          <Text style={sharedStyles.docNumber}>No: {data.documentNumber}</Text>
          <Text style={sharedStyles.docDate}>Tanggal: {data.date}</Text>
        </View>
      </View>

      {/* Intro paragraph */}
      <Text style={sharedStyles.paragraph}>{data.introText}</Text>

      {/* Info */}
      <View style={sharedStyles.infoSection}>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Supplier</Text>
          <Text style={sharedStyles.infoValue}>{data.supplier}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Alamat Supplier</Text>
          <Text style={sharedStyles.infoValue}>{data.supplierAddress}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>No. Purchase Order</Text>
          <Text style={sharedStyles.infoValue}>{data.purchaseOrder}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Tanggal Terima</Text>
          <Text style={sharedStyles.infoValue}>{data.receiveDate}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Diperiksa oleh</Text>
          <Text style={sharedStyles.infoValue}>{data.inspectedBy} — {data.inspectedByRole}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Lokasi Inspeksi</Text>
          <Text style={sharedStyles.infoValue}>{data.inspectionLocation}</Text>
        </View>
      </View>

      {/* Table */}
      <Text style={sharedStyles.sectionTitle}>Detail Barang Ditolak</Text>
      <View>
        <View style={sharedStyles.tableHeader}>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.no }]}>No</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.product, textAlign: 'left' }]}>Nama Barang</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.batch }]}>Kode Batch</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qtyRecv }]}>Qty Diterima</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qtyReject }]}>Qty Ditolak</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.reason, textAlign: 'left' }]}>Alasan Penolakan</Text>
        </View>
        {data.items.map((item, idx) => (
          <View
            key={idx}
            style={[
              sharedStyles.tableRow,
              { backgroundColor: idx % 2 === 0 ? '#F5F7FA' : '#FFFFFF' },
            ]}
          >
            <Text style={[sharedStyles.tableCell, { width: colW.no }]}>{item.no}</Text>
            <Text style={[sharedStyles.tableCell, { width: colW.product, textAlign: 'left' }]}>{item.productName}</Text>
            <Text style={[sharedStyles.tableCell, { width: colW.batch, fontWeight: 'bold' }]}>{item.batchCode}</Text>
            <Text style={[sharedStyles.tableCell, { width: colW.qtyRecv }]}>{item.qtyReceived}</Text>
            <Text style={[sharedStyles.tableCell, { width: colW.qtyReject }]}>{item.qtyRejected}</Text>
            <Text style={[sharedStyles.tableCell, { width: colW.reason, textAlign: 'left', fontSize: 7 }]}>{item.reason}</Text>
          </View>
        ))}
      </View>

      {/* Follow-up */}
      <Text style={[sharedStyles.sectionTitle, { marginTop: 16 }]}>Tindak Lanjut</Text>
      {data.followUpItems.map((item, idx) => (
        <Text key={idx} style={{ fontSize: 8, marginBottom: 4, paddingLeft: 12, color: colors.textDark }}>
          {idx + 1}. {item}
        </Text>
      ))}

      {/* Closing text */}
      <Text style={[sharedStyles.paragraph, { marginTop: 16 }]}>{data.closingText}</Text>

      {/* Signatures */}
      <View style={sharedStyles.signatureSection}>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>Dibuat oleh</Text>
          <View style={sharedStyles.signatureLine} />
          <Text style={sharedStyles.signatureName}>{data.createdByName}</Text>
        </View>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>Mengetahui</Text>
          <Text style={sharedStyles.signatureDots}>...............................</Text>
        </View>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>Menyetujui</Text>
          <Text style={sharedStyles.signatureDots}>...............................</Text>
        </View>
      </View>

      <Text style={sharedStyles.footer}>
        {data.companyName} | Dokumen Resmi | {data.documentNumber}
      </Text>
    </Page>
  </Document>
);

export default RejectReport;
