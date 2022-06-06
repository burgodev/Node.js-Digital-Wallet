/*
  Warnings:

  - You are about to drop the column `type` on the `operation_accounts` table. All the data in the column will be lost.
  - The `operation_type` column on the `operation_accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "LEVERAGE" AS ENUM ('ONE_TO_1000', 'ONE_TO_3000', 'ONE_TO_5000');

-- CreateEnum
CREATE TYPE "SPREAD_TYPE" AS ENUM ('STANDARD', 'RAW_SPREAD');

-- CreateEnum
CREATE TYPE "OPERATION_TYPE" AS ENUM ('METATRADER', 'BOTMONEY');

-- AlterTable
ALTER TABLE "operation_accounts" DROP COLUMN "type",
ADD COLUMN     "is_demo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "leverage" "LEVERAGE",
ADD COLUMN     "spread_type" "SPREAD_TYPE",
DROP COLUMN "operation_type",
ADD COLUMN     "operation_type" "OPERATION_TYPE" NOT NULL DEFAULT E'METATRADER';

-- DropEnum
DROP TYPE "account_type";

-- DropEnum
DROP TYPE "operation_type";
