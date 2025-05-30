/*
  Warnings:

  - Added the required column `details` to the `Platform` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Platform" ADD COLUMN     "details" TEXT NOT NULL;
