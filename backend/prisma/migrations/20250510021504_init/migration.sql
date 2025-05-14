/*
  Warnings:

  - You are about to drop the column `periodEnd` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `periodStart` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `trialEnd` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `trialStart` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `period_end` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period_start` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trial_end` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trial_start` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_userId_fkey";

-- DropIndex
DROP INDEX "Subscription_userId_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "periodEnd",
DROP COLUMN "periodStart",
DROP COLUMN "trialEnd",
DROP COLUMN "trialStart",
DROP COLUMN "userId",
ADD COLUMN     "period_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "period_start" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "trial_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "trial_start" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "project_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_user_id_key" ON "Subscription"("user_id");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
