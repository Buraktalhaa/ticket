-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'approved';

-- CreateTable
CREATE TABLE "googleToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "googleAccessToken" TEXT NOT NULL,
    "googleRefreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "googleToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "googleToken_userId_key" ON "googleToken"("userId");

-- AddForeignKey
ALTER TABLE "googleToken" ADD CONSTRAINT "googleToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
