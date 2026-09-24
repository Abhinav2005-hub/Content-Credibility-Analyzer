import { z } from "zod";
import prisma from "../config/database.js";

const createVerificationResultSchema = z.object({
    claimId: z.number().int().positive(),
    assessment: z.string().min(1),
    explanation: z.string().min(1),
    confidence: z.string().optional()
});

export async function createVerificationResult(req, res) {
    try {
        const analysisId = Number(req.params.analysisId);

        if (Number.isNaN(analysisId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid analysis ID"
            });
        }

        const data = createVerificationResultSchema.parse(req.body);

        const analysis = await prisma.analysis.findFirst({
            where: {
                id: analysisId,
                content: {
                    userId: req.userId
                }
            }
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found"
            });
        }

        const claim = await prisma.claim.findFirst({
            where: {
                id: data.claimId,
                contentId: analysis.contentId
            }
        });

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim not found for this analysis"
            });
        }

        const result = await prisma.verificationResult.create({
            data: {
                analysisId,
                claimId: data.claimId,
                assessment: data.assessment,
                explanation: data.explanation,
                confidence: data.confidence
            }
        });

        return res.status(201).json({
            success: true,
            message: "Verification result created successfully",
            data: result
        });

    } catch (error) {
        console.error("Create verification result error:", error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Invalid request data",
                errors: error.issues
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create verification result"
        });
    }
}