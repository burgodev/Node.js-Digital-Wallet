-- CreateEnum
CREATE TYPE "REQUEST_TYPE" AS ENUM ('start', 'stop');

-- CreateEnum
CREATE TYPE "REQUEST_STATUS" AS ENUM ('APROVED', 'DENIED');

-- AlterTable
ALTER TABLE "operation_accounts" ADD COLUMN     "is_robot_active" BOOLEAN;

-- CreateTable
CREATE TABLE "robot_operation_requests" (
    "id" UUID NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executed_at" TIMESTAMP(3),
    "request_type" "REQUEST_TYPE" NOT NULL,
    "status" "REQUEST_STATUS" NOT NULL,
    "operation_account_id" UUID NOT NULL,
    "robot_id" UUID NOT NULL,

    CONSTRAINT "robot_operation_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "robot_operation_requests" ADD CONSTRAINT "robot_operation_requests_operation_account_id_fkey" FOREIGN KEY ("operation_account_id") REFERENCES "operation_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "robot_operation_requests" ADD CONSTRAINT "robot_operation_requests_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "robots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
