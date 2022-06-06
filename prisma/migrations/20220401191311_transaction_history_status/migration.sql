-- CreateEnum
CREATE TYPE "TransactionRequestStatus" AS ENUM ('WAITING', 'APPROVED', 'REFUSED');

-- AlterTable
ALTER TABLE "transaction_requests" ADD COLUMN     "processed_at" TIMESTAMP(3),
ADD COLUMN     "status" "TransactionRequestStatus" NOT NULL DEFAULT E'WAITING';
