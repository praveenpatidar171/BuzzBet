/*
  Warnings:

  - Added the required column `remainingAmount` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "remainingAmount" INTEGER NOT NULL;
