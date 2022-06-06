/*
  Warnings:

  - A unique constraint covering the columns `[external_reference]` on the table `transaction_history` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "transaction_history_external_reference_key" ON "transaction_history"("external_reference");
