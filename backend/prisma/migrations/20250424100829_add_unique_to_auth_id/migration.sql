/*
  Warnings:

  - A unique constraint covering the columns `[authId]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_authId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Token_authId_key" ON "Token"("authId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
