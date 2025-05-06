-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categories" "Categories"[],
ADD COLUMN     "tvaValue" DOUBLE PRECISION NOT NULL DEFAULT 5.5,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'kg';
