"use client";

import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { sharedStyles, colors, formatNumber } from '../pdfStyles';
import { Trans } from "@lingui/macro";

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
            {/* @ts-ignore */}<Trans>Telp:</Trans>{data.companyPhone} {/* @ts-ignore */}<Trans>| Email:</Trans>{data.companyEmail}
          </Text>
        </View>
        <View style={sharedStyles.headerRight}>
          <Text style={sharedStyles.docTitle}>{/* @ts-ignore */}<Trans>Surat Jalan</Trans></Text>
          <Text style={sharedStyles.docNumber}>{/* @ts-ignore */}<Trans>No:</Trans>{data.documentNumber}</Text>
          <Text style={sharedStyles.docDate}>{/* @ts-ignore */}<Trans>Tanggal:</Trans>{data.date}</Text>
        </View>
      </View>

      {/* Sender / Receiver box */}
      <View style={localStyles.partyBox}>
        <View style={localStyles.partySection}>
          <Text style={localStyles.partyLabel}>{/* @ts-ignore */}<Trans>Pengirim</Trans></Text>
          <Text style={localStyles.partyName}>{data.senderName}</Text>
          <Text style={localStyles.partyDetail}>{data.senderAddress}</Text>
          <Text style={localStyles.partyDetail}>{/* @ts-ignore */}<Trans>Telp:</Trans>{data.senderPhone}</Text>
        </View>
        <View style={localStyles.partyDivider} />
        <View style={localStyles.partySection}>
          <Text style={localStyles.partyLabel}>{/* @ts-ignore */}<Trans>Penerima</Trans></Text>
          <Text style={localStyles.partyName}>{data.receiverName}</Text>
          <Text style={localStyles.partyDetail}>{data.receiverAddress}</Text>
          <Text style={localStyles.partyDetail}>{/* @ts-ignore */}<Trans>Telp:</Trans>{data.receiverPhone}</Text>
        </View>
      </View>

      {/* Order info */}
      <View style={sharedStyles.infoSection}>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>No. Order</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.orderNumber}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Pengirim</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.shippedBy} — {data.shippedByRole}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Kendaraan</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.vehicle}</Text>
        </View>
        <View style={sharedStyles.infoRow}>
          <Text style={sharedStyles.infoLabel}>{/* @ts-ignore */}<Trans>Tanggal Kirim</Trans></Text>
          <Text style={sharedStyles.infoValue}>{data.shipDate}</Text>
        </View>
      </View>

      {/* Table */}
      <Text style={sharedStyles.sectionTitle}>{/* @ts-ignore */}<Trans>Detail Barang</Trans></Text>
      <View>
        <View style={sharedStyles.tableHeader}>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.no }]}>{/* @ts-ignore */}<Trans>No</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.code }]}>{/* @ts-ignore */}<Trans>Kode Produk</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.name, textAlign: 'left' }]}>{/* @ts-ignore */}<Trans>Nama Barang</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.batch }]}>{/* @ts-ignore */}<Trans>Batch</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.unit }]}>{/* @ts-ignore */}<Trans>Satuan</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qty }]}>{/* @ts-ignore */}<Trans>Qty Dikirim</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.notes, textAlign: 'left' }]}>{/* @ts-ignore */}<Trans>Keterangan</Trans></Text>
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
          <Text style={sharedStyles.noteText}>{/* @ts-ignore */}<Trans>Catatan:</Trans>{data.footerNote}</Text>
        </View>
      )}

      {/* Signatures */}
      <View style={sharedStyles.signatureSection}>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>{/* @ts-ignore */}<Trans>Disiapkan oleh</Trans></Text>
          <View style={sharedStyles.signatureLine} />
          <Text style={sharedStyles.signatureName}>{data.preparedByName}</Text>
          <Text style={sharedStyles.signatureRole}>{data.preparedByRole}</Text>
        </View>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>{/* @ts-ignore */}<Trans>Pengemudi</Trans></Text>
          <Text style={sharedStyles.signatureDots}>...............................</Text>
          <Text style={sharedStyles.signatureRole}>{/* @ts-ignore */}<Trans>Nama & Tanda Tangan</Trans></Text>
        </View>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>{/* @ts-ignore */}<Trans>Diterima oleh</Trans></Text>
          <Text style={sharedStyles.signatureDots}>...............................</Text>
          <Text style={sharedStyles.signatureRole}>{/* @ts-ignore */}<Trans>Nama, Tanda Tangan & Stempel</Trans></Text>
        </View>
      </View>

      <Text style={sharedStyles.footer}>
        {data.companyName} {/* @ts-ignore */}<Trans>| Dokumen Resmi |</Trans>{data.documentNumber}
      </Text>
    </Page>
  </Document>
);

export default DeliveryNote;
