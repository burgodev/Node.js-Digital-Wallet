/*
  Warnings:

  - You are about to drop the column `metatrader_reference` on the `operation_accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "operation_accounts" DROP COLUMN "metatrader_reference",
ADD COLUMN     "account_number" TEXT;
