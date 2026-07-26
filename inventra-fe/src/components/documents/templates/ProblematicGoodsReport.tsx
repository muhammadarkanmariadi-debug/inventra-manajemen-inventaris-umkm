"use client";

import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { sharedStyles, colors, getBadgeStyle, formatNumber } from '../pdfStyles';
import { Trans } from "@lingui/macro";

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
            {/* @ts-ignore */}<Trans>Telp:</Trans>{data.companyPhone} {/* @ts-ignore */}<Trans>| Email:</Trans>{data.companyEmail}
          </Text>
        </View>
        <View style={sharedStyles.headerRight}>
          <Text style={sharedStyles.docTitle}>{/* @ts-ignore */}<Trans>Laporan Barang Bermasalah</Trans></Text>
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
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.product, textAlign: 'left' }]}>{/* @ts-ignore */}<Trans>Produk</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.batch }]}>{/* @ts-ignore */}<Trans>Batch</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.qty }]}>{/* @ts-ignore */}<Trans>Qty</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.status }]}>{/* @ts-ignore */}<Trans>Status</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.reason, textAlign: 'left' }]}>{/* @ts-ignore */}<Trans>Alasan</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.date }]}>{/* @ts-ignore */}<Trans>Tgl Temuan</Trans></Text>
          <Text style={[sharedStyles.tableHeaderCell, { width: colW.pic }]}>{/* @ts-ignore */}<Trans>PIC</Trans></Text>
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
            <Text style={sharedStyles.summaryLabel}>{/* @ts-ignore */}<Trans>Reject</Trans></Text>
            <Text style={[sharedStyles.summaryValue, { color: colors.accent.red }]}>{data.totalReject} {/* @ts-ignore */}<Trans>batch</Trans></Text>
          </View>
          <View style={sharedStyles.summaryCell}>
            <Text style={sharedStyles.summaryLabel}>{/* @ts-ignore */}<Trans>On Hold</Trans></Text>
            <Text style={[sharedStyles.summaryValue, { color: colors.accent.yellow }]}>{data.totalOnHold} {/* @ts-ignore */}<Trans>batch</Trans></Text>
          </View>
          <View style={sharedStyles.summaryCell}>
            <Text style={sharedStyles.summaryLabel}>{/* @ts-ignore */}<Trans>Unreleased</Trans></Text>
            <Text style={[sharedStyles.summaryValue, { color: colors.accent.purple }]}>{data.totalUnreleased} {/* @ts-ignore */}<Trans>batch</Trans></Text>
          </View>
          <View style={[sharedStyles.summaryCell, { borderRightWidth: 0 }]}>
            <Text style={sharedStyles.summaryLabel}>{/* @ts-ignore */}<Trans>Total Qty Bermasalah</Trans></Text>
            <Text style={sharedStyles.summaryValue}>{data.totalQtyUnit}</Text>
          </View>
        </View>
      </View>

      {/* Signatures */}
      <View style={sharedStyles.signatureSection}>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>{/* @ts-ignore */}<Trans>Dibuat oleh</Trans></Text>
          <View style={sharedStyles.signatureLine} />
          <Text style={sharedStyles.signatureName}>{data.createdByName}</Text>
          <Text style={sharedStyles.signatureRole}>{data.createdByRole}</Text>
        </View>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>{/* @ts-ignore */}<Trans>Diperiksa oleh</Trans></Text>
          <Text style={sharedStyles.signatureDots}>...............................</Text>
          <Text style={sharedStyles.signatureRole}>{/* @ts-ignore */}<Trans>Manajer QC</Trans></Text>
        </View>
        <View style={sharedStyles.signatureBlock}>
          <Text style={sharedStyles.signatureTitle}>{/* @ts-ignore */}<Trans>Disetujui oleh</Trans></Text>
          <Text style={sharedStyles.signatureDots}>...............................</Text>
          <Text style={sharedStyles.signatureRole}>{/* @ts-ignore */}<Trans>Manajer Gudang</Trans></Text>
        </View>
      </View>

      <Text style={sharedStyles.footer}>
        {data.companyName} {/* @ts-ignore */}<Trans>| Dokumen Resmi |</Trans>{data.documentNumber}
      </Text>
    </Page>
  </Document>
);

export default ProblematicGoodsReport;
