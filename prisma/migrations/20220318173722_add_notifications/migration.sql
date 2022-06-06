-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "subject_key" TEXT NOT NULL,
    "subject_args" JSONB NOT NULL,
    "text_key" TEXT NOT NULL,
    "text_args" JSONB NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "user_role_id" UUID NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_role_id_fkey" FOREIGN KEY ("user_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
