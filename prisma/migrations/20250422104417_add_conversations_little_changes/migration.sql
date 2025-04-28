-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'APP');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "via" "ChannelType" NOT NULL DEFAULT 'EMAIL';
