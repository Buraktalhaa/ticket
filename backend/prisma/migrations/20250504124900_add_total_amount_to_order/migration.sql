/*
  Warnings:

  - Added the required column `totalamount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PointStatus" AS ENUM ('used', 'unused');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "totalamount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Point" ADD COLUMN     "status" "PointStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "money" SET DEFAULT 1000;
