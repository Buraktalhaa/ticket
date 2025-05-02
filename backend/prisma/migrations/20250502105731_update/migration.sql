/*
  Warnings:

  - Added the required column `day` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hour` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "day" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "hour" INTEGER NOT NULL;
