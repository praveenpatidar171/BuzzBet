-- CreateEnum
CREATE TYPE "FinalResult" AS ENUM ('LIVE', 'YES', 'NO');

-- AlterTable
ALTER TABLE "Market" ADD COLUMN     "finalResult" "FinalResult" NOT NULL DEFAULT 'LIVE';
