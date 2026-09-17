// app/components/pdf/ReceiptPDF.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

export interface ReceiptData {
  reference: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  provider: string;
  property: string;
}

// Brand theme constants matching your Tailwind setup
const COLORS = {
  primaryGreen: '#16a34a',
  secondaryGreen: '#15803d',
  tertiaryGreen: '#f0fdf4',
  primaryFixed: '#dcfce7',
  gray900: '#0f172a',
  gray800: '#1e293b',
  gray500: '#64748b',
  gray400: '#94a3b8',
  gray200: '#e2e8f0',
  gray100: '#f1f5f9',
  bgBody: '#f8faf7',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.bgBody,
    fontFamily: 'Helvetica',
    padding: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    overflow: 'hidden',
  },
  
  /* Header Section */
  header: {
    backgroundColor: COLORS.secondaryGreen,
    padding: 24,
    color: '#ffffff',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTextWrapper: {
    marginLeft: 8,
  },
  brandTag: {
    fontSize: 7,
    fontWeight: 800,
    letterSpacing: 1.2,
    color: COLORS.primaryFixed,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#ffffff',
    marginTop: 1,
  },
  badgeRef: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeRefText: {
    fontSize: 9,
    fontWeight: 700,
    color: '#ffffff',
  },
  
  /* Amount Block */
  amountContainer: {
    marginTop: 20,
  },
  amountLabel: {
    fontSize: 8,
    fontWeight: 600,
    color: COLORS.primaryFixed,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  amountValue: {
    fontSize: 26,
    fontWeight: 800,
    color: '#ffffff',
  },
  currency: {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.primaryFixed,
    marginLeft: 4,
  },

  /* Ticket Notch & Separator */
  notchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
    backgroundColor: '#ffffff',
    marginTop: -8,
  },
  notchLeft: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.bgBody,
    marginLeft: -7,
    borderRightWidth: 1,
    borderColor: COLORS.gray200,
  },
  dashedLine: {
    flex: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.gray200,
    marginHorizontal: 8,
  },
  notchRight: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.bgBody,
    marginRight: -7,
    borderLeftWidth: 1,
    borderColor: COLORS.gray200,
  },

  /* Body Content */
  body: {
    padding: 24,
    paddingTop: 8,
  },
  
  /* Status Banner */
  statusBox: {
    backgroundColor: COLORS.tertiaryGreen,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statusTextGroup: {
    flexDirection: 'column',
  },
  statusTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.gray900,
  },
  statusDate: {
    fontSize: 8,
    color: COLORS.gray500,
    marginTop: 1,
  },
  verifiedBadge: {
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  verifiedBadgeText: {
    fontSize: 7,
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  /* Detail Rows */
  detailList: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  detailRowFirst: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 9,
    fontWeight: 500,
    color: COLORS.gray500,
  },
  value: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.gray900,
    textAlign: 'right',
  },
  categoryPill: {
    backgroundColor: COLORS.gray100,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  categoryValue: {
    fontSize: 8.5,
    fontWeight: 600,
    color: COLORS.gray800,
  },
  providerValue: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.primaryGreen,
  },
  refValue: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.gray800,
  },

  /* Barcode Section */
  barcodeBox: {
    backgroundColor: COLORS.gray100,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeLines: {
    flexDirection: 'row',
    gap: 3,
    height: 24,
    marginBottom: 6,
    opacity: 0.7,
  },
  barLineThin: {
    width: 2,
    height: '100%',
    backgroundColor: COLORS.gray800,
  },
  barLineThick: {
    width: 4,
    height: '100%',
    backgroundColor: COLORS.gray800,
  },
  barLineWide: {
    width: 6,
    height: '100%',
    backgroundColor: COLORS.gray800,
  },
  authCode: {
    fontSize: 7.5,
    fontWeight: 600,
    color: COLORS.gray400,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export const ReceiptPDF = ({ data }: { data: ReceiptData }) => (
  <Document title={`Receipt-${data.reference}`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.card}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.brandBox}>
              <View style={styles.brandTextWrapper}>
                <Text style={styles.brandTag}>Conekta Finance</Text>
                <Text style={styles.headerTitle}>Transaction Receipt</Text>
              </View>
            </View>

            <View style={styles.badgeRef}>
              <Text style={styles.badgeRefText}>{data.reference.slice(0, 7)}</Text>
            </View>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount Paid</Text>
            <View style={styles.amountRow}>
              <Text style={styles.amountValue}>
                ₦{data.amount.toLocaleString('en-NG')}
              </Text>
              <Text style={styles.currency}>NGN</Text>
            </View>
          </View>
        </View>

        {/* TICKET CUTOUT NOTCHES */}
        <View style={styles.notchContainer}>
          <View style={styles.notchLeft} />
          <View style={styles.dashedLine} />
          <View style={styles.notchRight} />
        </View>

        {/* BODY */}
        <View style={styles.body}>
          
          {/* STATUS */}
          <View style={styles.statusBox}>
            <View style={styles.statusTextGroup}>
              <Text style={styles.statusTitle}>Payment Completed</Text>
              <Text style={styles.statusDate}>{data.date}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>Verified</Text>
            </View>
          </View>

          {/* DETAILS */}
          <View style={styles.detailList}>
            <View style={[styles.detailRow, styles.detailRowFirst]}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.value}>{data.title}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryValue}>{data.category}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Service Provider</Text>
              <Text style={styles.providerValue}>{data.provider}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Property</Text>
              <Text style={styles.value}>{data.property}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Transaction Ref</Text>
              <Text style={styles.refValue}>{data.reference}</Text>
            </View>
          </View>

          {/* BARCODE STUB */}
          <View style={styles.barcodeBox}>
            <View style={styles.barcodeLines}>
              <View style={styles.barLineThick} />
              <View style={styles.barLineThin} />
              <View style={styles.barLineWide} />
              <View style={styles.barLineThin} />
              <View style={styles.barLineThick} />
              <View style={styles.barLineWide} />
              <View style={styles.barLineThin} />
              <View style={styles.barLineThick} />
              <View style={styles.barLineThin} />
              <View style={styles.barLineWide} />
            </View>
            <Text style={styles.authCode}>AUTH CODE: {data.reference}</Text>
          </View>

        </View>

      </View>
    </Page>
  </Document>
);