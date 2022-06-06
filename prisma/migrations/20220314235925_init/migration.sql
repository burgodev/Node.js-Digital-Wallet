-- CreateEnum
CREATE TYPE "user_role_request_status" AS ENUM ('APPROVED', 'REFUSED', 'AWAITING');

-- CreateEnum
CREATE TYPE "user_role_request_type" AS ENUM ('CREATE', 'DELETE');

-- CreateEnum
CREATE TYPE "UserRoleStatus" AS ENUM ('ACTIVE', 'REFUSED', 'WAITING');

-- CreateEnum
CREATE TYPE "theme" AS ENUM ('DEFAULT');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('WAITING_UPLOAD', 'WAITING_VALIDATION', 'DENIED', 'APPROVED');

-- CreateEnum
CREATE TYPE "action_type" AS ENUM ('LOGIN', 'LOGOUT', 'RECOVERY_PASSWORD');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('PC', 'MOBILE');

-- CreateEnum
CREATE TYPE "profit_or_loss" AS ENUM ('PROFIT', 'LOSS');

-- CreateEnum
CREATE TYPE "robot_origin" AS ENUM ('BOTMONEY', 'OTHER');

-- CreateEnum
CREATE TYPE "account_type" AS ENUM ('REAL', 'DEMO');

-- CreateEnum
CREATE TYPE "operation_type" AS ENUM ('TRADER', 'ROBOT');

-- CreateEnum
CREATE TYPE "transaction_entity" AS ENUM ('WALLET', 'OPERATION_ACCOUNT', 'BINANCE_SMART_CHAIN');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT NOT NULL,
    "email_checked_at" TIMESTAMP(3),
    "birth_date" TIMESTAMP(3),
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "nationality_id" CHAR(2),
    "region_id" CHAR(2),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" UUID NOT NULL,
    "password" TEXT NOT NULL,
    "status" "UserRoleStatus" NOT NULL DEFAULT E'WAITING',
    "integration_token" TEXT NOT NULL,
    "manager_id" UUID,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role_requests" (
    "id" UUID NOT NULL,
    "status" "user_role_request_status" NOT NULL,
    "type" "user_role_request_type" NOT NULL,
    "user_id" UUID NOT NULL,
    "user_role_id" UUID NOT NULL,

    CONSTRAINT "user_role_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "cep" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country_id" CHAR(2) NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "complement" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "user_id" UUID NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "iso_code" CHAR(2) NOT NULL,
    "name" TEXT NOT NULL,
    "ddi" TEXT,
    "is_support_as_region" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("iso_code")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferences_config" (
    "id" UUID NOT NULL,
    "theme" "theme" NOT NULL DEFAULT E'DEFAULT',
    "anti_fishing_argument" TEXT,

    CONSTRAINT "preferences_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_document_types" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "document_type_id" UUID NOT NULL,

    CONSTRAINT "role_document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "user_validated_id" UUID,
    "document_type_id" UUID NOT NULL,
    "route_url" TEXT NOT NULL,
    "document_status" "DocumentStatus" NOT NULL DEFAULT E'WAITING_VALIDATION',
    "comment" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validated_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "reject_reason_id" UUID,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reject_reasons" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "reject_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_recoveries" (
    "id" UUID NOT NULL,
    "user_role_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_valid" BOOLEAN NOT NULL DEFAULT true,
    "token" TEXT NOT NULL,

    CONSTRAINT "password_recoveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actions_logs" (
    "id" UUID NOT NULL,
    "ip" TEXT NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "action" "action_type" NOT NULL,
    "device_id" UUID NOT NULL,
    "user_role_id" UUID NOT NULL,

    CONSTRAINT "actions_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acceptance_term_histories" (
    "id" UUID NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL,
    "user_id" UUID NOT NULL,
    "acceptance_term_id" UUID NOT NULL,

    CONSTRAINT "acceptance_term_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acceptance_terms" (
    "id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expiry_date" TIMESTAMP(3),
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,
    "deactivated_at" TIMESTAMP(3),

    CONSTRAINT "acceptance_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_validations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "checked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_validations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" UUID NOT NULL,
    "mac_adress" TEXT NOT NULL,
    "type" "DeviceType" NOT NULL,
    "user_role_id" UUID NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet" (
    "id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "private_key" TEXT,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "user_role_id" UUID NOT NULL,

    CONSTRAINT "wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operation_accounts" (
    "id" UUID NOT NULL,
    "balance" DOUBLE PRECISION,
    "metatrader_reference" TEXT,
    "operation_type" "operation_type" NOT NULL DEFAULT E'TRADER',
    "type" "account_type" NOT NULL DEFAULT E'DEMO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "user_role_id" UUID NOT NULL,
    "robot_id" UUID,

    CONSTRAINT "operation_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operation_account_processes" (
    "id" UUID NOT NULL,
    "data" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "operation_account_id" UUID NOT NULL,

    CONSTRAINT "operation_account_processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funds_history" (
    "id" UUID NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,
    "profit_or_loss" "profit_or_loss" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "operation_account_id" UUID NOT NULL,

    CONSTRAINT "funds_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "robots" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "origin" "robot_origin" NOT NULL,
    "origin_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "robots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_requests" (
    "id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type_id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "operation_account_id" UUID NOT NULL,

    CONSTRAINT "transaction_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_history" (
    "id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "type_id" UUID NOT NULL,

    CONSTRAINT "transaction_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "from" "transaction_entity" NOT NULL,
    "to" "transaction_entity" NOT NULL,

    CONSTRAINT "transaction_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trader_history" (
    "id" UUID NOT NULL,
    "operation_account_id" UUID NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trader_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "document_types_name_key" ON "document_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "password_recoveries_token_key" ON "password_recoveries"("token");

-- CreateIndex
CREATE UNIQUE INDEX "email_validations_token_key" ON "email_validations"("token");

-- CreateIndex
CREATE UNIQUE INDEX "email_validations_user_id_key" ON "email_validations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_user_role_id_key" ON "wallet"("user_role_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "countries"("iso_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "countries"("iso_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "user_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role_requests" ADD CONSTRAINT "user_role_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role_requests" ADD CONSTRAINT "user_role_requests_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("iso_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_document_types" ADD CONSTRAINT "role_document_types_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_document_types" ADD CONSTRAINT "role_document_types_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_reject_reason_id_fkey" FOREIGN KEY ("reject_reason_id") REFERENCES "reject_reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_recoveries" ADD CONSTRAINT "password_recoveries_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions_logs" ADD CONSTRAINT "actions_logs_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions_logs" ADD CONSTRAINT "actions_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acceptance_term_histories" ADD CONSTRAINT "acceptance_term_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acceptance_term_histories" ADD CONSTRAINT "acceptance_term_histories_acceptance_term_id_fkey" FOREIGN KEY ("acceptance_term_id") REFERENCES "acceptance_terms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_validations" ADD CONSTRAINT "email_validations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_accounts" ADD CONSTRAINT "operation_accounts_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_accounts" ADD CONSTRAINT "operation_accounts_robot_id_fkey" FOREIGN KEY ("robot_id") REFERENCES "robots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_account_processes" ADD CONSTRAINT "operation_account_processes_operation_account_id_fkey" FOREIGN KEY ("operation_account_id") REFERENCES "operation_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funds_history" ADD CONSTRAINT "funds_history_operation_account_id_fkey" FOREIGN KEY ("operation_account_id") REFERENCES "operation_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_requests" ADD CONSTRAINT "transaction_requests_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_requests" ADD CONSTRAINT "transaction_requests_operation_account_id_fkey" FOREIGN KEY ("operation_account_id") REFERENCES "operation_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_requests" ADD CONSTRAINT "transaction_requests_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "transaction_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_history" ADD CONSTRAINT "transaction_history_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "transaction_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trader_history" ADD CONSTRAINT "trader_history_operation_account_id_fkey" FOREIGN KEY ("operation_account_id") REFERENCES "operation_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
