/*
  Warnings:

  - You are about to drop the column `operation_account_id` on the `transaction_requests` table. All the data in the column will be lost.
  - You are about to drop the column `wallet_id` on the `transaction_requests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `transaction_types` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `transaction_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `transaction_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transaction_requests" DROP CONSTRAINT "transaction_requests_operation_account_id_fkey";

-- DropForeignKey
ALTER TABLE "transaction_requests" DROP CONSTRAINT "transaction_requests_wallet_id_fkey";

-- AlterTable
ALTER TABLE "transaction_history" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "transaction_requests" DROP COLUMN "operation_account_id",
DROP COLUMN "wallet_id",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transaction_types_name_key" ON "transaction_types"("name");
