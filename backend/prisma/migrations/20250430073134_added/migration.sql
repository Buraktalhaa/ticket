/*
  Warnings:

  - A unique constraint covering the columns `[photoName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `photoName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photoName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_photoName_key" ON "User"("photoName");
