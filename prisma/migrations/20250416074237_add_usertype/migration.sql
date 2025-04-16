-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('SUPPLIER', 'CUSTOMER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "type" "UserType" NOT NULL DEFAULT 'SUPPLIER';
