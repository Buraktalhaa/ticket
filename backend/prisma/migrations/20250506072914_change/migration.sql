/*
  Warnings:

  - You are about to drop the column `orderId` on the `Point` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Point` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Point" DROP CONSTRAINT "Point_orderId_fkey";

-- AlterTable
ALTER TABLE "Point" DROP COLUMN "orderId",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "PointStatus";
