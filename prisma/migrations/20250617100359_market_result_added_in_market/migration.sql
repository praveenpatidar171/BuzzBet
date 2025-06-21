-- CreateEnum
CREATE TYPE "MarketResult" AS ENUM ('LIVE', 'YES', 'NO');

-- AlterTable
ALTER TABLE "MarketSnapshot" ADD COLUMN     "finalResult" "MarketResult" NOT NULL DEFAULT 'LIVE';
