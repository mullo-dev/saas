/*
  Warnings:

  - Added the required column `price` to the `SupplierProductOnOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductOnSubCatalogue" DROP CONSTRAINT "ProductOnSubCatalogue_productId_fkey";

-- AlterTable
ALTER TABLE "SupplierProductOnOrder" ADD COLUMN     "price" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductOnSubCatalogue" ADD CONSTRAINT "ProductOnSubCatalogue_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
