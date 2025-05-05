/*
  Warnings:

  - A unique constraint covering the columns `[pnr]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pnr` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "pnr" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_pnr_key" ON "Ticket"("pnr");
