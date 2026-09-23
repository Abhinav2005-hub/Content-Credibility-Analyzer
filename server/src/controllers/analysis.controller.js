import prisma from "../config/database";

export async function createAnalysis(req, res) {
    try {
        const contentId = Number(req.params.contentId);

        if (Number.isNaN(contentId)) {
            return res.status(400).json ({
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
            return res.status(404).json ({
                success: false,
                message: "Content not found"
            });
        }

        const analysis = await prisma.analysis.create({
            data: {
                contentId,
                status: "pending"
            }
        });

        return res.status(201).json({
            success: true,
            message: "Analysis created successfully",
            data: analysis
        });

    } catch (error) {
        console.error("Create analysis error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create analysis"
        });
    }
}

