/*
  Warnings:

  - Made the column `matchedQuantity` on table `Prediction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Prediction" ALTER COLUMN "matchedQuantity" SET NOT NULL,
ALTER COLUMN "matchedQuantity" SET DEFAULT 1;
