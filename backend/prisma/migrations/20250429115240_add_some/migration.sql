/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Permission_url_key" ON "Permission"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
