/*
  Warnings:

  - You are about to drop the column `stripeId` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[razorpayId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `razorpayId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Subscription_stripeId_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "stripeId",
ADD COLUMN     "razorpayId" TEXT NOT NULL,
ADD COLUMN     "razorpayOrderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_razorpayId_key" ON "Subscription"("razorpayId");
