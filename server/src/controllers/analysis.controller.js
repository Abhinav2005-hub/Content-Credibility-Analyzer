import prisma from "../config/database.js";
import { analysisQueue } from "../queues/analysis.queue.js";

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

        const existingAnalysis = await prisma.analysis.findFirst({
            where: {
                contentId,
                status: {
                    in: ["pending", "processing"]
                }
            }
        });
        
        if (existingAnalysis) {
            return res.status(409).json({
                success: false,
                message: "An analysis is already in progress for this content",
                data: {
                    analysis: existingAnalysis
                }
            });
        }

        const analysis = await prisma.analysis.create({
            data: {
                contentId,
                status: "pending"
            }
        });

        const job = await analysisQueue.add("verify-content", {
            analysisId: analysis.id,
            contentId
        });

        return res.status(202).json({
            success: true,
            message: "Analysis started",
            data: {
                analysis,
                jobId: job.id
            }
        });

    } catch (error) {
        console.error("Create analysis error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to start analysis"
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

export async function getAnalysisById(req, res) {
    try {
        const analysisId = Number(req.params.analysisId);

        if (Number.isNaN(analysisId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid analysis ID"
            });
        }

        const analysis = await prisma.analysis.findFirst({
            where: {
                id: analysisId,
                content: {
                    userId: req.userId
                }
            },
            include: {
                content: {
                    include: {
                        claims: {
                            include: {
                                evidence: {
                                    include: {
                                        source: true
                                    },
                                    orderBy: {
                                        createdAt: "desc"
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: "asc"
                            }
                        }
                    }
                },
                verificationResults: {
                    include: {
                        claim: true
                    }
                }
            }
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: "Analysis not found"
            });
        }

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