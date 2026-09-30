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

        try {
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

            let claims = [];

            if (extractedClaims.length > 0) {
                claims = await prisma.claim.createManyAndReturn({
                    data: extractedClaims.map((claim) => ({
                        contentId,
                        text: claim.text
                    }))
                });
            }

            console.log(`Claims created: ${claims.length}`);

            for (const claim of claims) {
                console.log(`Verifying claim ${claim.id}`);

                await runRagVerification(
                    analysisId,
                    claim.id
                );
            }

            await prisma.analysis.update({
                where: { id: analysisId },
                data: { status: "completed" }
            });

            console.log(`Analysis ${analysisId} completed`);

            return {
                success: true,
                analysisId,
                claimsProcessed: claims.length
            };

        } catch (error) {
            console.error(
                `Analysis ${analysisId} failed:`,
                error
            );

            try {
                await prisma.analysis.update({
                    where: { id: analysisId },
                    data: { status: "failed" }
                });
            } catch (updateError) {
                console.error(
                    "Failed to update analysis status:",
                    updateError
                );
            }

            throw error;
        }
    },
    {
        connection: redis
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(
        `Job ${job?.id} failed:`,
        error
    );
});

console.log("Analysis worker started");