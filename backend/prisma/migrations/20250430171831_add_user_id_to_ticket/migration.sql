/*
  Warnings:

  - The `status` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('processing', 'approve', 'deleted', 'cancelling');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'processing';

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_userId_key" ON "Ticket"("userId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
