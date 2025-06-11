/*
  Warnings:

  - You are about to drop the column `job_id` on the `Project` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Project_job_id_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "job_id",
ADD COLUMN     "task_id" TEXT,
ALTER COLUMN "status" SET DEFAULT 'SUCCESS';

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'SUCCESS',
ADD COLUMN     "task_id" TEXT;
