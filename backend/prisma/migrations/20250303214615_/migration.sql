/*
  Warnings:

  - You are about to drop the column `productId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_productId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_productId_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "productId";

-- DropTable
DROP TABLE "Price";

-- DropTable
DROP TABLE "Product";
