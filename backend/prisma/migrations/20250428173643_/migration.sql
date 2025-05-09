/*
  Warnings:

  - Added the required column `periodEnd` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodStart` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trialEnd` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trialStart` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "periodEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "periodStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "plan" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "trialEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "trialStart" TIMESTAMP(3) NOT NULL;
