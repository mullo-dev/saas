/*
  Warnings:

  - You are about to drop the column `supplierId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `ProductOnOrder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ref]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ref` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOnOrder" DROP CONSTRAINT "ProductOnOrder_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOnOrder" DROP CONSTRAINT "ProductOnOrder_productId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "supplierId",
ADD COLUMN     "ref" TEXT NOT NULL;

-- DropTable
DROP TABLE "ProductOnOrder";

-- CreateTable
CREATE TABLE "SupplierOnOrder" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "deliveryNote" TEXT,
    "totalHt" INTEGER NOT NULL,
    "totalTtc" INTEGER NOT NULL,

    CONSTRAINT "SupplierOnOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierProductOnOrder" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "supplierOrderId" TEXT NOT NULL,

    CONSTRAINT "SupplierProductOnOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_ref_key" ON "Order"("ref");

-- AddForeignKey
ALTER TABLE "SupplierOnOrder" ADD CONSTRAINT "SupplierOnOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierOnOrder" ADD CONSTRAINT "SupplierOnOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProductOnOrder" ADD CONSTRAINT "SupplierProductOnOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProductOnOrder" ADD CONSTRAINT "SupplierProductOnOrder_supplierOrderId_fkey" FOREIGN KEY ("supplierOrderId") REFERENCES "SupplierOnOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
