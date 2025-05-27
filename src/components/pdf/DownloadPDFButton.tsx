'use client';

import React from 'react';
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import { DeliveryNotePDF } from './deliveryNote';
import { Button } from '../ui/button';
import { Download, Loader2 } from 'lucide-react';

const MyDoc = ({order, supplier}: {order: any, supplier: any}) => (
  <Document>
    <Page size="A4" style={{ padding: 30 }}>

      <DeliveryNotePDF
        order={order}
        supplier={supplier}
        products={supplier.products}
      />
    </Page>
  </Document>
);

export default function PDFTestButton({order, supplier}: {order: any, supplier: any}) {
  console.log(supplier)
  return (
    <PDFDownloadLink document={<MyDoc order={order} supplier={supplier} />} fileName="test.pdf">
      {({ loading }) =>
        <Button size="icon" variant="outline">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Download />}
        </Button>
      }
    </PDFDownloadLink>
  );
}
