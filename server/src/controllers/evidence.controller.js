import { z } from "zod";
import prisma from "../config/database.js";

const createEvidenceSchema = z.object({
    sourceId: z.number().int().positive(),
    text: z.string().min(1)
});

export async function createEvidence(req, res) {
    try {
        
        const claimId = Number(req.params.claimId);

        if (Number.isNaN(claimId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid claim ID"
            });
        }

        const data = createEvidenceSchema.parse(req.body);

        const claim = await prisma.claim.findFirst({
            where: {
                id: claimId,
                content: {
                    userId: req.userId
                }
            }
        });

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });
        }

        const source = await prisma.source.findUnique({
            where: {
                id: data.sourceId
            }
        });

        if (!source) {
            return res.status(404).json ({
                success: false,
                message: "Source not found"
            });
        }

        const evidence = await prisma.evidence.create({
            data: {
                claimId,
                sourceId: data.sourceId,
                text: data.text
            }
        });

        return res.status(201).json ({
            success: true,
            message: "Evidence created successfully",
            data: evidence
        });

    } catch (error) {
        console.error("Create evidence error:", error);

        return res.status(500).json ({
            success: false,
            message: "Failed to create evidence"
        });
    }
}

export async function getEvidence(req, res) {
    try {
        const claimId = Number(req.params.claimId);

        if (Number.isNaN(claimId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid claim ID"
            });
        }

        const claim = await prisma.claim.findFirst({
            where: {
                id: claimId,
                content: {
                    userId: req.userId
                }
            }
        });

        if (!claim) {
            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });
        }

        const evidence = await prisma.evidence.findMany({
            where: {
                claimId
            },
            include: {
                source: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            success: true,
            data: evidence
        });

    } catch (error) {
        console.error("Get evidence error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch evidence"
        });
    }
}