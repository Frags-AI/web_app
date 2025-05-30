/*
  Warnings:

  - A unique constraint covering the columns `[user_id,provider,scope,external_id]` on the table `Platform` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_id` to the `Platform` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Platform_user_id_provider_scope_email_key";

-- AlterTable
ALTER TABLE "Platform" ADD COLUMN     "external_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Platform_user_id_provider_scope_external_id_key" ON "Platform"("user_id", "provider", "scope", "external_id");
