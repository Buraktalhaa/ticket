/*
  Warnings:

  - You are about to drop the column `authId` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `authId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mail]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mail]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_authId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_authId_fkey";

-- DropIndex
DROP INDEX "Token_authId_key";

-- DropIndex
DROP INDEX "User_authId_key";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "authId",
ADD COLUMN     "mail" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "authId",
DROP COLUMN "email",
ADD COLUMN     "mail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Token_mail_key" ON "Token"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_mail_fkey" FOREIGN KEY ("mail") REFERENCES "Auth"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mail_fkey" FOREIGN KEY ("mail") REFERENCES "Auth"("email") ON DELETE SET NULL ON UPDATE CASCADE;
