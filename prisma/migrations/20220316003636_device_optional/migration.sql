-- DropForeignKey
ALTER TABLE "actions_logs" DROP CONSTRAINT "actions_logs_device_id_fkey";

-- AlterTable
ALTER TABLE "actions_logs" ALTER COLUMN "device_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "actions_logs" ADD CONSTRAINT "actions_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
