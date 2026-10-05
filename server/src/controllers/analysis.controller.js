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

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );

        const skip = (page - 1) * limit;

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

        const [analyses, total] = await Promise.all([
            prisma.analysis.findMany({
                where: {
                    contentId
                },
                orderBy: {
                    createdAt: "desc"
                },
                skip,
                take: limit
            }),

            prisma.analysis.count({
                where: {
                    contentId
                }
            })
        ]);

        return res.status(200).json({
            success: true,
            data: {
                analyses,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error("Get analyses error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get analyses"
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

        const verificationResults = analysis.verificationResults;

        const summary = {
            totalClaims: analysis.content.claims.length,
            supported: verificationResults.filter(
                (result) => result.assessment === "supported"
            ).length,
            contradicted: verificationResults.filter(
                (result) => result.assessment === "contradicted"
            ).length,
            insufficientEvidence: verificationResults.filter(
                (result) => result.assessment === "insufficient_evidence"
            ).length
        };
        
        return res.status(200).json({
            success: true,
            data: {
                ...analysis,
                summary
            }
        });

    } catch (error) {
        console.error("Get analysis error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch analysis"
        });
    }
}

export async function getAnalysisHistory(req, res) {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );

        const skip = (page - 1) * limit;

        const [analyses, total] = await Promise.all([
            prisma.analysis.findMany({
                where: {
                    content: {
                        userId: req.userId
                    }
                },
                include: {
                    content: {
                        select: {
                            id: true,
                            title: true,
                            createdAt: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                skip,
                take: limit
            }),

            prisma.analysis.count({
                where: {
                    content: {
                        userId: req.userId
                    }
                }
            })
        ]);

        return res.status(200).json({
            success: true,
            data: {
                analyses,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error("Get analysis history error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get analysis history"
        });
    }
}