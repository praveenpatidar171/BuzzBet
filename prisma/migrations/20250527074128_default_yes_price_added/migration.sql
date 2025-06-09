/*
  Warnings:

  - You are about to drop the column `noOdds` on the `MarketSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `yesOdds` on the `MarketSnapshot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MarketSnapshot" DROP COLUMN "noOdds",
DROP COLUMN "yesOdds",
ADD COLUMN     "yesPrice" DOUBLE PRECISION NOT NULL DEFAULT 5.0;
