-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierOnOrder" DROP CONSTRAINT "SupplierOnOrder_orderId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierOnOrder" DROP CONSTRAINT "SupplierOnOrder_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierProductOnOrder" DROP CONSTRAINT "SupplierProductOnOrder_productId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierProductOnOrder" DROP CONSTRAINT "SupplierProductOnOrder_supplierOrderId_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierOnOrder" ADD CONSTRAINT "SupplierOnOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierOnOrder" ADD CONSTRAINT "SupplierOnOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProductOnOrder" ADD CONSTRAINT "SupplierProductOnOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProductOnOrder" ADD CONSTRAINT "SupplierProductOnOrder_supplierOrderId_fkey" FOREIGN KEY ("supplierOrderId") REFERENCES "SupplierOnOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
