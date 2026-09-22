-- CreateTable
CREATE TABLE "Claim" (
    "id" SERIAL NOT NULL,
    "contentId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Claim_contentId_idx" ON "Claim"("contentId");

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
