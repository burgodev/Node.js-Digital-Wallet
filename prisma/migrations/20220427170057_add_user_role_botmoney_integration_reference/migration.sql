/*
  Warnings:

  - A unique constraint covering the columns `[integrated_account_id]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_roles" ADD COLUMN     "integrated_account_id" UUID,
ADD COLUMN     "integrated_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_integrated_account_id_key" ON "user_roles"("integrated_account_id");
