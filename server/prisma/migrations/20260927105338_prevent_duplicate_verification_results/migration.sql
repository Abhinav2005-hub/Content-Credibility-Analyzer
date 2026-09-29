/*
  Warnings:

  - A unique constraint covering the columns `[analysisId,claimId]` on the table `VerificationResult` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VerificationResult_analysisId_claimId_key" ON "VerificationResult"("analysisId", "claimId");
