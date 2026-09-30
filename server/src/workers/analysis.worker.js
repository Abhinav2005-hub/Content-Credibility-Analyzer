import { Worker } from "bullmq";
import redis from "../config/redis.js";
import prisma from "../config/database.js";
import { extractClaims } from "../services/claimExtraction.service.js";
import { runRagVerification } from "../services/ragVerification.service.js";

const worker = new Worker(
    "analysis",
    async (job) => {
        const { analysisId, contentId } = job.data;

        console.log(`Processing job: ${job.id}`);

        await prisma.analysis.update({
            where: { id: analysisId },
            data: { status: "processing" }
        });

        const content = await prisma.content.findUnique({
            where: { id: contentId }
        });

        if (!content) {
            throw new Error("Content not found");
        }

        const extractedClaims = extractClaims(content.text);

        console.log(`Claims extracted: ${extractedClaims.length}`);

        if (extractedClaims.length > 0) {
            await prisma.claim.createMany({
                data: extractedClaims.map((claim) => ({
                    contentId,
                    analysisId,
                    text: claim.text
                }))
            });
        }

        const claims = await prisma.claim.findMany({
            where: { analysisId },
            orderBy: { createdAt: "asc" }
        });

        for (const claim of claims) {
            console.log(`Verifying claim ${claim.id}`);

            await runRagVerification(
                analysisId,
                claim.id
            );
        }

        const completedAnalysis = await prisma.analysis.update({
            where: { id: analysisId },
            data: { status: "completed" }
        });

        console.log(`Analysis ${analysisId} completed`);

        return {
            success: true,
            analysisId,
            claimsProcessed: claims.length
        };
    },
    {
        connection: redis
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed:`, error);
});

console.log("Analysis worker started");