-- CreateEnum
CREATE TYPE "Day" AS ENUM ('TUESDAY', 'MONDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('NOT_INCLUDED', 'INCLUDED', 'ON_SITE', 'MEMBER_HOME');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('ADMIN', 'EDITOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ALBANIAN', 'BASQUE', 'BELARUSIAN', 'BOSNIAN', 'BULGARIAN', 'CATALAN', 'CROATIAN', 'CZECH', 'DANISH', 'DUTCH', 'ENGLISH', 'ESTONIAN', 'FINNISH', 'FRENCH', 'GALICIAN', 'GERMAN', 'GREEK', 'HUNGARIAN', 'ICELANDIC', 'IRISH', 'ITALIAN', 'LATVIAN', 'LITHUANIAN', 'LUXEMBOURGISH', 'MALTESE', 'NORWEGIAN', 'POLISH', 'PORTUGUESE', 'ROMANIAN', 'RUSSIAN', 'SERBIAN', 'SLOVAK', 'SLOVENE', 'SPANISH', 'SWEDISH', 'TURKISH', 'UKRAINIAN', 'WELSH');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOnOrganizations" (
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL,

    CONSTRAINT "UsersOnOrganizations_pkey" PRIMARY KEY ("organizationId","userId")
);

-- CreateTable
CREATE TABLE "Establishment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "languages" "Language"[],
    "openDays" "Day"[],
    "collaborator" INTEGER NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Establishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "maxTime" INTEGER NOT NULL,
    "minTime" INTEGER NOT NULL,
    "timeUnit" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "room" "RoomType" NOT NULL,
    "traveler" INTEGER NOT NULL,
    "establishmentId" TEXT NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "offerId" TEXT NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Offer_reference_key" ON "Offer"("reference");

-- AddForeignKey
ALTER TABLE "UsersOnOrganizations" ADD CONSTRAINT "UsersOnOrganizations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnOrganizations" ADD CONSTRAINT "UsersOnOrganizations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Establishment" ADD CONSTRAINT "Establishment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
