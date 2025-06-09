/*
  Warnings:

  - A unique constraint covering the columns `[userId,marketId]` on the table `Prediction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `noOdds` to the `MarketSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yesOdds` to the `MarketSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MarketSnapshot" ADD COLUMN     "noOdds" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "yesOdds" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_userId_marketId_key" ON "Prediction"("userId", "marketId");
