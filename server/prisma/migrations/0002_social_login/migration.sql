-- AlterTable: Add social login fields to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "provider" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "social_id" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;

-- CreateIndex: unique constraint on provider + social_id
CREATE UNIQUE INDEX IF NOT EXISTS "User_provider_social_id_key" ON "User"("provider", "social_id");
