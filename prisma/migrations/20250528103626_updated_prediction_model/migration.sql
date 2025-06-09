-- DropIndex
DROP INDEX "Prediction_userId_marketId_key";

-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "parentPredictionId" INTEGER;

-- CreateIndex
CREATE INDEX "Prediction_userId_marketId_idx" ON "Prediction"("userId", "marketId");

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_parentPredictionId_fkey" FOREIGN KEY ("parentPredictionId") REFERENCES "Prediction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
