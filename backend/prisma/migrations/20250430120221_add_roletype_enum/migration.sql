/*
  Warnings:

  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Permit" DROP CONSTRAINT "Permit_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- AlterTable
ALTER TABLE "Permit" ALTER COLUMN "roleId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Role_id_seq";

-- AlterTable
ALTER TABLE "UserRole" ALTER COLUMN "roleId" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "descripton" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "sold" BOOLEAN NOT NULL,
    "images" TEXT[],
    "discount" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permit" ADD CONSTRAINT "Permit_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
