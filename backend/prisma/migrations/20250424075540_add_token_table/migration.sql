/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `Auth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "refreshToken";

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
