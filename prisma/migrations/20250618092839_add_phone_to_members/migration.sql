-- AlterTable
ALTER TABLE "member" ADD COLUMN     "contactPreference" TEXT;

-- DropEnum
DROP TYPE "MemberRole";
