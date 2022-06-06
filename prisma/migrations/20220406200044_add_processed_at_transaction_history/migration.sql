-- AlterTable
ALTER TABLE "transaction_history" ADD COLUMN     "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
