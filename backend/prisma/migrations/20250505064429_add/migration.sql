/*
  Warnings:

  - Added the required column `companyId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pointRate` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'awaiting';

-- AlterTable
ALTER TABLE "Point" ALTER COLUMN "status" SET DEFAULT 'unused';

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "pointRate" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" TEXT;

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
