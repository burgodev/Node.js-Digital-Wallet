/*
  Warnings:

  - The `account_number` column on the `operation_accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "operation_accounts" DROP COLUMN "account_number",
ADD COLUMN     "account_number" INTEGER;
