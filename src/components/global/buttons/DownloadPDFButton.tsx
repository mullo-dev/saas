'use client';

import React from 'react';
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer';
import { DeliveryNotePDF } from '../../pdf/deliveryNote';
import { Button } from '../../ui/button';
import { Download, Loader2 } from 'lucide-react';

const MyDoc = ({order, supplier, all}: {order: any, supplier?: any, all?: boolean}) => (
  <Document>
    <Page size="A4" style={{ padding: 30 }}>
      <DeliveryNotePDF
        order={order}
        supplier={supplier}
        all={all}
      />
    </Page>
  </Document>
);

export default function PDFDownloadButton({order, supplier, all}: {order: any, supplier?: any, all?: boolean}) {

  return (
    <PDFDownloadLink 
      document={<MyDoc order={order} supplier={supplier} all={all} />} 
      fileName={`bon-de-livraison-${order.ref}.pdf`}
    >
      {({ loading }) =>
        <Button size={all ? "default" : "icon"} className={all ? "w-full mt-4" : ""} variant={all ? "default" : "outline"}>
          {all && "Bon de livraison"} {loading ? <Loader2 size={16} className="animate-spin" /> : <Download />}
        </Button>
      }
    </PDFDownloadLink>
  );
}
