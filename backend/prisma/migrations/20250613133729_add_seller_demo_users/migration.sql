/*
  Warnings:

  - You are about to drop the column `photoName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "photoName",
ADD COLUMN     "profilPhotoUrl" TEXT;
