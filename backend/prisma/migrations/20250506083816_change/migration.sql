/*
  Warnings:

  - You are about to drop the column `money` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Point" ALTER COLUMN "expiresAt" SET DEFAULT '2025-12-31 23:59:59 +00:00';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "money";
