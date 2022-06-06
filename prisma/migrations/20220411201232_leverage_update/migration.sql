/*
  Warnings:

  - The values [ONE_TO_3000,ONE_TO_5000] on the enum `LEVERAGE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LEVERAGE_new" AS ENUM ('ONE_TO_100', 'ONE_TO_300', 'ONE_TO_1000');
ALTER TABLE "operation_accounts" ALTER COLUMN "leverage" TYPE "LEVERAGE_new" USING ("leverage"::text::"LEVERAGE_new");
ALTER TYPE "LEVERAGE" RENAME TO "LEVERAGE_old";
ALTER TYPE "LEVERAGE_new" RENAME TO "LEVERAGE";
DROP TYPE "LEVERAGE_old";
COMMIT;
