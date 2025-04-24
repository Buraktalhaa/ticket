-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('USER', 'SELLER', 'ADMIN');

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "authId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardInformation" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "roleId" TEXT NOT NULL,
    "roleType" "RoleType" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;
