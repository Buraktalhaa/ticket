/*
  Warnings:

  - You are about to drop the column `mail` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `mail` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_mail_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_mail_fkey";

-- DropIndex
DROP INDEX "Token_mail_key";

-- DropIndex
DROP INDEX "User_mail_key";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "mail",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "mail",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Token_email_key" ON "Token"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_email_fkey" FOREIGN KEY ("email") REFERENCES "Auth"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_email_fkey" FOREIGN KEY ("email") REFERENCES "Auth"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
