/*
  Warnings:

  - You are about to drop the column `orderHour` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `day` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `hour` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `dateTime` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderHour";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "day",
DROP COLUMN "hour",
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;
