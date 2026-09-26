import prisma from "../config/database";
import { verifyClaimForAnalysis } from "../services/verificationPipeline.service.js";
import { extractClaims } from "../services/claimExtraction.service.js";

export async function createAnalysis(req, res) {
    try {
        const contentId = Number(req.params.contentId);

        if (Number.isNaN(contentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid content ID"
            });
        }

        const content = await prisma.content.findFirst({
            where: {
                id: contentId,
                userId: req.userId
            }
        });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found"
            });
        }

        const analysis = await prisma.analysis.create({
            data: {
                contentId,
                status: "processing"
            }
        });

        const extractedClaims = extractClaims(content.text);

        if (extractedClaims.length > 0) {
            await prisma.claim.createMany({
                data: extractedClaims.map((claim) => ({
                    contentId,
                    text: claim.text
                }))
            });
        }

        const claims = await prisma.claim.findMany({
            where: {
                contentId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const verificationResults = [];

        for (const claim of claims) {
            const result = await verifyClaimForAnalysis(
                analysis.id,
                claim.id
            );

            verificationResults.push(result);
        }

        const completedAnalysis = await prisma.analysis.update({
            where: {
                id: analysis.id
            },
            data: {
                status: "completed"
            }
        });

        return res.status(201).json({
            success: true,
            message: "Analysis completed successfully",
            data: {
                analysis: completedAnalysis,
                claimsExtracted: extractedClaims.length,
                verificationResults
            }
        });

    } catch (error) {
        console.error("Create analysis error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to complete analysis"
        });
    }
}

export async function getAnalysis(req, res) {
    try {
        const contentId = Number(req.params.contentId);

        if (Number.isNaN(contentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid content ID"
            });
        }

        const content = await prisma.content.findFirst({
            where: {
                id: contentId,
                userId: req.userId
            }
        });

        if (!content) {
            return res.status(404).json({
                success: false,
                message: "Content not found"
            });
        }

        const analysis = await prisma.analysis.findMany({
            where: {
                contentId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error("Get analysis error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch analysis"
        });
    }
}