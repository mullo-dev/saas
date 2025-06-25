/*
  Warnings:

  - The `contactPreference` column on the `member` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "member" DROP COLUMN "contactPreference",
ADD COLUMN     "contactPreference" TEXT[];
