/*
  Warnings:

  - A unique constraint covering the columns `[manager_code]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_roles" ADD COLUMN     "manager_code" CHAR(6);

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_manager_code_key" ON "user_roles"("manager_code");
