/*
  Warnings:

  - Added the required column `matchedQuantity` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "matchedQuantity" DOUBLE PRECISION NOT NULL;
