"use client";

import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { sharedStyles, colors, getBadgeStyle, formatNumber, formatDate } from '../pdfStyles';
import { Trans } from "@lingui/macro";

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
            {/* @ts-ignore */}<Trans>Telp:</Trans>{data.companyPhone} {/* @ts-ignore */}<Trans>| Email:</Trans>{data.companyEmail}
          </Text>
        </View>
        <View style={sharedStyles.headerRight}>
          <Text style={sharedStyles.docTitle}>{/* @ts-ignore */}<Trans>Berita Acara Reject Barang</Trans></Text>
          <Text style={sharedStyles.docNumber}>{/* @ts-ignore */}<Trans>No:</Trans>{data.documentNumber}</Text>
          <Text style={sharedStyles.docDate}>{/* @ts-ignore */}<Trans>Tanggal:</Trans>{data.date}</Text>
        </View>
      </View>

      {/* Intro paragraph */}
      <Text style={sharedStyles.paragraph}>{data.introText}</Text>

      {/* Info */}
      <View style={sharedStyles.infoSection}>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Supplier</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.supplier}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Alamat Supplier</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.supplierAddress}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>No. Purchase Order</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.purchaseOrder}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Tanggal Terima</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.receiveDate}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Diperiksa oleh</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.inspectedBy} — {data.inspectedByRole}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Lokasi Inspeksi</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.inspectionLocation}</Text>
        </View>
      </View>

      {/* Table */}
      <Text style={sharedStyles.sectionTitle}>{/* @ts-ignore */}<Trans>Detail Barang Ditolak</Trans></Text>
      <View>
        <View style={sharedStyles.tableHeader}>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.no }]}>{/* @ts-ignore */}<Trans>No</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.product, textAlign: 'left' }]}>{/* @ts-ignore */}<Trans>Nama Barang</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.batch }]}>{/* @ts-ignore */}<Trans>Kode Batch</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qtyRecv }]}>{/* @ts-ignore */}<Trans>Qty Diterima</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qtyReject }]}>{/* @ts-ignore */}<Trans>Qty Ditolak</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.reason, textAlign: 'left' }]}>{/* @ts-ignore */}<Trans>Alasan Penolakan</Trans></Text>
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
      <Text style={[sharedStyles.sectionTitle, { marginTop: 16 }]}>{/* @ts-ignore */}<Trans>Tindak Lanjut</Trans></Text>
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
          <Text style={sharedStyles.signatureTitle}>{/* @ts-ignore */}<Trans>Dibuat oleh</Trans></Text>
          <View style={sharedStyles.signatureLine} />
          <Text style={sharedStyles.signatureName}>{data.createdByName}</Text>
        </View>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>{/* @ts-ignore */}<Trans>Mengetahui</Trans></Text>
          <Text style={sharedStyles.signatureDots}>...............................</Text>
        </View>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>{/* @ts-ignore */}<Trans>Menyetujui</Trans></Text>
          <Text style={sharedStyles.signatureDots}>...............................</Text>
        </View>
      </View>

      <Text style={sharedStyles.footer}>
        {data.companyName} {/* @ts-ignore */}<Trans>| Dokumen Resmi |</Trans>{data.documentNumber}
      </Text>
    </Page>
  </Document>
);

export default RejectReport;
