/*
  Warnings:

  - You are about to drop the column `contactId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `siret` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "contactId",
DROP COLUMN "email",
DROP COLUMN "phone",
DROP COLUMN "siret";
