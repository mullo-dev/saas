/*
  Warnings:

  - You are about to drop the column `fromEmail` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `toEmail` on the `Conversation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId,supplierId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Conversation_fromEmail_toEmail_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "fromEmail",
DROP COLUMN "toEmail",
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "supplierId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_customerId_supplierId_key" ON "Conversation"("customerId", "supplierId");
