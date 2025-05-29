/*
  Warnings:

  - You are about to drop the column `external_id` on the `Platform` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Platform` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,provider,scope]` on the table `Platform` will be added. If there are existing duplicate values, this will fail.
  - Made the column `scope` on table `Platform` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Platform_user_id_provider_external_id_key";

-- AlterTable
ALTER TABLE "Platform" DROP COLUMN "external_id",
DROP COLUMN "name",
ALTER COLUMN "scope" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Platform_user_id_provider_scope_key" ON "Platform"("user_id", "provider", "scope");
