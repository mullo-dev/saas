import { NextResponse } from "next/server";
import { getOrderById } from "@/actions/orders/actions/get";
import { DeliveryNotePDF } from "@/components/pdf/deliveryNote";
import React from "react";
import { renderToStream, Document } from "@react-pdf/renderer";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const supplierId = searchParams.get("supplierId");

    if (!orderId) {
      return new NextResponse("Missing orderId", { status: 400 });
    }

    const result = await getOrderById({orderId: orderId});
    if (!result?.data?.order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const order = result.data.order;
    const supplier = order.suppliers.find((sup:any) => sup.id === supplierId);

    if (!supplier) {
      return new NextResponse("Missing supplier", { status: 400 });
    }

    const element = React.createElement(Document, {},
      React.createElement(DeliveryNotePDF, {
        order,
        supplier,
        products: supplier.products,
      })
    );

    const pdfStream = await renderToStream(element);
    const response = new Response(pdfStream as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="bon-de-livraison-${order?.ref}.pdf"`,
      },
    });

    return response;
  } catch (error) {
    console.error('PDF generation error:', error);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
