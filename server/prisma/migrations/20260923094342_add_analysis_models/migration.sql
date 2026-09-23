-- CreateTable
CREATE TABLE "Analysis" (
    "id" SERIAL NOT NULL,
    "contentId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationResult" (
    "id" SERIAL NOT NULL,
    "analysisId" INTEGER NOT NULL,
    "claimId" INTEGER NOT NULL,
    "assessment" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "confidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Analysis_contentId_idx" ON "Analysis"("contentId");

-- CreateIndex
CREATE INDEX "VerificationResult_analysisId_idx" ON "VerificationResult"("analysisId");

-- CreateIndex
CREATE INDEX "VerificationResult_claimId_idx" ON "VerificationResult"("claimId");

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationResult" ADD CONSTRAINT "VerificationResult_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationResult" ADD CONSTRAINT "VerificationResult_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;
