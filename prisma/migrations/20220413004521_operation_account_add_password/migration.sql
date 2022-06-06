-- AlterTable
ALTER TABLE "operation_accounts" ADD COLUMN     "investor_password" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "main_password" TEXT NOT NULL DEFAULT E'';
