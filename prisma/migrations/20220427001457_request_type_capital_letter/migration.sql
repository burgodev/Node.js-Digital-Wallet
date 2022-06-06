/*
  Warnings:

  - The values [start,stop] on the enum `REQUEST_TYPE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "REQUEST_TYPE_new" AS ENUM ('START', 'STOP');
ALTER TABLE "robot_operation_requests" ALTER COLUMN "request_type" TYPE "REQUEST_TYPE_new" USING ("request_type"::text::"REQUEST_TYPE_new");
ALTER TYPE "REQUEST_TYPE" RENAME TO "REQUEST_TYPE_old";
ALTER TYPE "REQUEST_TYPE_new" RENAME TO "REQUEST_TYPE";
DROP TYPE "REQUEST_TYPE_old";
COMMIT;
