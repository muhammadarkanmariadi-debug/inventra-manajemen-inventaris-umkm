'use client';

import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { sharedStyles, colors, formatNumber } from '../pdfStyles';

// ====== Types ======
export interface DeliveryItem {
  no: number;
  productCode: string;
  productName: string;
  batch: string;
  unit: string;
  qtyShipped: number;
  notes: string;
}

export interface DeliveryNoteData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  documentNumber: string;
  date: string;
  // Sender
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  // Receiver
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  // Order info
  orderNumber: string;
  shippedBy: string;
  shippedByRole: string;
  vehicle: string;
  shipDate: string;
  items: DeliveryItem[];
  footerNote: string;
  preparedByName: string;
  preparedByRole: string;
}

const colW = {
  no: '5%',
  code: '12%',
  name: '22%',
  batch: '15%',
  unit: '8%',
  qty: '13%',
  notes: '25%',
};

const localStyles = StyleSheet.create({
  partyBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  partySection: {
    flex: 1,
    padding: 10,
  },
  partyDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  partyLabel: {
    fontSize: 7,
    color: colors.textLabel,
    marginBottom: 4,
  },
  partyName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 2,
  },
  partyDetail: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 1,
  },
});

const DeliveryNote: React.FC<{ data: DeliveryNoteData }> = ({ data }) => (
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
          <Text style={sharedStyles.docTitle}>Surat Jalan</Text>
          <Text style={sharedStyles.docNumber}>No: {data.documentNumber}</Text>
          <Text style={sharedStyles.docDate}>Tanggal: {data.date}</Text>
        </View>
      </View>

      {/* Sender / Receiver box */}
      <View style={localStyles.partyBox}>
        <View style={localStyles.partySection}>
          <Text style={localStyles.partyLabel}>Pengirim</Text>
          <Text style={localStyles.partyName}>{data.senderName}</Text>
          <Text style={localStyles.partyDetail}>{data.senderAddress}</Text>
          <Text style={localStyles.partyDetail}>Telp: {data.senderPhone}</Text>
        </View>
        <View style={localStyles.partyDivider} />
        <View style={localStyles.partySection}>
          <Text style={localStyles.partyLabel}>Penerima</Text>
          <Text style={localStyles.partyName}>{data.receiverName}</Text>
          <Text style={localStyles.partyDetail}>{data.receiverAddress}</Text>
          <Text style={localStyles.partyDetail}>Telp: {data.receiverPhone}</Text>
        </View>
      </View>

      {/* Order info */}
      <View style={sharedStyles.infoSection}>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>No. Order</Text>
          <Text style={sharedStyles.infoValue}>{data.orderNumber}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Pengirim</Text>
          <Text style={sharedStyles.infoValue}>{data.shippedBy} — {data.shippedByRole}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Kendaraan</Text>
          <Text style={sharedStyles.infoValue}>{data.vehicle}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>Tanggal Kirim</Text>
          <Text style={sharedStyles.infoValue}>{data.shipDate}</Text>
        </View>
      </View>

      {/* Table */}
      <Text style={sharedStyles.sectionTitle}>Detail Barang</Text>
      <View>
        <View style={sharedStyles.tableHeader}>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.no }]}>No</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.code }]}>Kode Produk</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.name, textAlign: 'left' }]}>Nama Barang</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.batch }]}>Batch</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.unit }]}>Satuan</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qty }]}>Qty Dikirim</Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.notes, textAlign: 'left' }]}>Keterangan</Text>
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
            <Text style={[sharedStyles.tableCell, { width: colW.code }]}>{item.productCode}</Text>
            <Text style={[sharedStyles.tableCell, { width: colW.name, textAlign: 'left' }]}>{item.productName}</Text>
            <Text style={[sharedStyles.tableCell, { width: colW.batch }]}>{item.batch}</Text>
            <Text style={[sharedStyles.tableCell, { width: colW.unit }]}>{item.unit}</Text>
            <Text style={[sharedStyles.tableCell, { width: colW.qty, fontWeight: 'bold', color: colors.primary }]}>
              {formatNumber(item.qtyShipped)}
            </Text>
            <Text style={[sharedStyles.tableCell, { width: colW.notes, textAlign: 'left', fontSize: 7 }]}>
              {item.notes || '—'}
            </Text>
          </View>
        ))}
      </View>

      {/* Note */}
      {data.footerNote && (
        <View style={sharedStyles.noteBox}>
          <Text style={sharedStyles.noteText}>Catatan: {data.footerNote}</Text>
        </View>
      )}

      {/* Signatures */}
      <View style={sharedStyles.signatureSection}>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>Disiapkan oleh</Text>
          <View style={sharedStyles.signatureLine} />
          <Text style={sharedStyles.signatureName}>{data.preparedByName}</Text>
          <Text style={sharedStyles.signatureRole}>{data.preparedByRole}</Text>
        </View>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>Pengemudi</Text>
          <Text style={sharedStyles.signatureDots}>...............................</Text>
          <Text style={sharedStyles.signatureRole}>Nama & Tanda Tangan</Text>
        </View>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>Diterima oleh</Text>
          <Text style={sharedStyles.signatureDots}>...............................</Text>
          <Text style={sharedStyles.signatureRole}>Nama, Tanda Tangan & Stempel</Text>
        </View>
      </View>

      <Text style={sharedStyles.footer}>
        {data.companyName} | Dokumen Resmi | {data.documentNumber}
      </Text>
    </Page>
  </Document>
);

export default DeliveryNote;
