/*
  Warnings:

  - Added the required column `entryPrice` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('PENDING', 'MATCHED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "entryPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "matchedAt" TIMESTAMP(3),
ADD COLUMN     "status" "BetStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
