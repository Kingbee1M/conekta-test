import { NextRequest, NextResponse } from 'next/server';
import { renderToStream, DocumentProps } from '@react-pdf/renderer';
import React from 'react';
import { ReceiptPDF } from '@/app/components/pdf/ReceiptPDF';

const getReceiptData = (id: string) => ({
  reference: id || 'TX-24039812',
  title: 'Plumbing service',
  category: 'Home repair',
  date: 'March 18, 2026 at 10:42 AM',
  amount: 25000,
  provider: 'BrightFlow Plumbing',
  property: '42 Lekki Epe Expressway, Ajah',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') ?? '';
    const receipt = getReceiptData(id);

    // Instantiate via React.createElement to satisfy ESLint
    const pdfElement = React.createElement(ReceiptPDF, { data: receipt }) as React.ReactElement<DocumentProps>;

    const stream = await renderToStream(pdfElement);

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Receipt-${receipt.reference}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}