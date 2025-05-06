/*
  Warnings:

  - A unique constraint covering the columns `[userId,categoryId]` on the table `Point` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Point_userId_categoryId_key" ON "Point"("userId", "categoryId");
