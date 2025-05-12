-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_email_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_email_fkey" FOREIGN KEY ("email") REFERENCES "Auth"("email") ON DELETE SET NULL ON UPDATE CASCADE;
