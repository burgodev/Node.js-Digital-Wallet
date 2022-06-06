/*
  Warnings:

  - A unique constraint covering the columns `[external_reference]` on the table `transaction_requests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "transaction_requests" ADD COLUMN     "external_reference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "transaction_requests_external_reference_key" ON "transaction_requests"("external_reference");
