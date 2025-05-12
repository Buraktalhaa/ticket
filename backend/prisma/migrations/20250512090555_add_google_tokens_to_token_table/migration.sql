/*
  Warnings:

  - You are about to drop the column `email` on the `GoogleAuth` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "GoogleAuth_email_key";

-- AlterTable
ALTER TABLE "GoogleAuth" DROP COLUMN "email";
