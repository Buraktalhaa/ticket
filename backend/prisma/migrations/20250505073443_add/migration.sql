/*
  Warnings:

  - Added the required column `pointExpiresAt` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "pointExpiresAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "sold" SET DEFAULT false;
