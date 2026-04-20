import { StyleSheet, Font } from '@react-pdf/renderer';

// Register default font
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
});

// ====== Color Palette ======
export const colors = {
  primary: '#1B3A5C',
  primaryLight: '#2D5A8E',
  headerBg: '#1B3A5C',
  headerText: '#FFFFFF',
  rowEven: '#F5F7FA',
  rowOdd: '#FFFFFF',
  border: '#D1D5DB',
  textDark: '#1F2937',
  textMuted: '#6B7280',
  textLabel: '#4B7399',
  accent: {
    green: '#166534',
    greenBg: '#DCFCE7',
    red: '#991B1B',
    redBg: '#FEE2E2',
    yellow: '#92400E',
    yellowBg: '#FEF3C7',
    blue: '#1E40AF',
    blueBg: '#DBEAFE',
    purple: '#6B21A8',
    purpleBg: '#F3E8FF',
  },
};

// ====== Shared Styles ======
export const sharedStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    color: colors.textDark,
  },

  // ---- Header ----
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 12,
    marginBottom: 20,
  },
  headerLeft: {},
  headerRight: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  companyAddress: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 2,
  },
  companyContact: {
    fontSize: 7,
    color: colors.textMuted,
    marginTop: 4,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  docNumber: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 2,
  },
  docDate: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 2,
  },

  // ---- Info Row ----
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    marginBottom: 2,
    backgroundColor: '#F9FAFB',
  },
  infoLabel: {
    width: 120,
    fontSize: 8,
    color: colors.textLabel,
  },
  infoValue: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.textDark,
  },

  // ---- Table ----
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.headerBg,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    color: colors.headerText,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  tableCell: {
    fontSize: 8,
    textAlign: 'center',
    color: colors.textDark,
  },

  // ---- Badge ----
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  // ---- Summary Box ----
  summaryBox: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
  },
  summaryCell: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRightWidth: 0.5,
    borderRightColor: colors.border,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 7,
    color: colors.textMuted,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },

  // ---- Signature ----
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  signatureBlock: {
    alignItems: 'center',
    width: 150,
  },
  signatureTitle: {
    fontSize: 8,
    color: colors.textMuted,
    marginBottom: 40,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textDark,
    width: 120,
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  signatureRole: {
    fontSize: 7,
    color: colors.textMuted,
    marginTop: 2,
  },
  signatureDots: {
    fontSize: 8,
    color: colors.textMuted,
    marginBottom: 4,
    letterSpacing: 2,
  },

  // ---- Footer ----
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7,
    color: colors.textMuted,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingTop: 8,
  },

  // ---- Paragraph ----
  paragraph: {
    fontSize: 9,
    lineHeight: 1.6,
    color: colors.textDark,
    marginBottom: 12,
    textAlign: 'justify',
  },

  // ---- Section Title ----
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    marginTop: 8,
  },

  // ---- Notes ----
  noteBox: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 3,
  },
  noteText: {
    fontSize: 7,
    color: '#92400E',
    fontStyle: 'italic',
  },
});

// ====== Badge helpers ======
export const getBadgeStyle = (variant: string) => {
  switch (variant) {
    case 'MASUK':
    case 'AVAILABLE':
      return { backgroundColor: colors.accent.greenBg, color: colors.accent.green };
    case 'KELUAR':
    case 'REJECT':
      return { backgroundColor: colors.accent.redBg, color: colors.accent.red };
    case 'ADJUST':
    case 'ON HOLD':
      return { backgroundColor: colors.accent.yellowBg, color: colors.accent.yellow };
    case 'UNRELEASED':
      return { backgroundColor: colors.accent.purpleBg, color: colors.accent.purple };
    default:
      return { backgroundColor: colors.accent.blueBg, color: colors.accent.blue };
  }
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('id-ID');
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};
