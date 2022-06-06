/*
  Warnings:

  - Added the required column `user_role_id` to the `transaction_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_role_id` to the `transaction_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction_history" ADD COLUMN     "user_role_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "transaction_requests" ADD COLUMN     "user_role_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction_requests" ADD CONSTRAINT "transaction_requests_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_history" ADD CONSTRAINT "transaction_history_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
