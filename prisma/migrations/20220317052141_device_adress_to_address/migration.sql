/*
  Warnings:

  - You are about to drop the column `mac_adress` on the `devices` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "action_type" ADD VALUE 'REGISTER';

-- AlterTable
ALTER TABLE "devices" DROP COLUMN "mac_adress",
ADD COLUMN     "mac_address" TEXT;
