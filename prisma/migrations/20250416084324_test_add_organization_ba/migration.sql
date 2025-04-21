/*
  Warnings:

  - You are about to drop the column `city` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the `UsersOnOrganizations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdAt` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsersOnOrganizations" DROP CONSTRAINT "UsersOnOrganizations_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnOrganizations" DROP CONSTRAINT "UsersOnOrganizations_userId_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "city",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "metadata" TEXT,
ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "activeOrganizationId" TEXT;

-- DropTable
DROP TABLE "UsersOnOrganizations";

-- CreateTable
CREATE TABLE "member" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "status" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "inviterId" TEXT NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
