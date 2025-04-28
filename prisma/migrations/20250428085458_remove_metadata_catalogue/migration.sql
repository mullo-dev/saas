/*
  Warnings:

  - You are about to drop the column `email` on the `Catalogue` table. All the data in the column will be lost.
  - You are about to drop the column `ownerName` on the `Catalogue` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Catalogue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Catalogue" DROP COLUMN "email",
DROP COLUMN "ownerName",
DROP COLUMN "phone";
