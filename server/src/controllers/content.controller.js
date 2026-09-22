import { z } from "zod";
import prisma from "../config/database.js";

const createContentSchema =  z.object({
    title: z.string().max(200).optional(),
    text: z.string().min(1),
    sourceUrl: z.string().url().optional()
});

export async function createContent(req, res) {
    try {

        console.log("Request body:", req.body);
        console.log("Content-Type:", req.headers["content-type"]);
        console.log("User ID:", req.userId);
        
        const data = createContentSchema.parse(req.body);

        const content = await prisma.content.create({
            data: {
                userId: req.userId,
                title: data.title,
                text: data.text,
                sourceUrl: data.sourceUrl
            }
        });

        return res.status(201).json({
            success: true,
            message: "Content created successfully",
            data: content
        });

    } catch (error) {
        console.error("Create content error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create content"
        });
    }
}

export async function getContents(req, res) {
    try {
        const contents = await prisma.content.findMany({
            where: {
                userId: req.userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            success: true,
            data: contents
        });

    } catch (error) {
        console.error("Get contents error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch content"
        });
    }
}

export async function getContentById(req, res) {
    try {
        const contentId = Number(req.params.id);

        if (Number .isNaN(contentId)) {
            return res.status(400).json ({
                success: false,
                message: "Invalid content Id"
            });
        }

        const content = await prisma.content.findFirst({
            where: {
                id: contentId,
                userId: req.userId
            }
        });

        if(!content) {
            return res.status(404).json ({
                success: false,
                message: "Content not found"
            });
        }

        return res.status(200).json ({
            success: true,
            data: content
        });

    } catch (error) {
        console.error("Get content by ID error:", error);

        return res.status(500).json ({
            success: false,
            message: "Failed to fetch content"
        });
    }
}

export async function deleteContent (req, res) {
    try {
        const contentId = Number(req.params.id);

        if (Number .isNaN(contentId)) {
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
            return res.status(404).json ({
                success: false,
                message: "Content not found"
            });
        }

        await prisma.content.delete({
            where: {
                id: contentId
            }
        });

        return res.status(200).json({
            success: true,
            message: "Content deleted successfully"
        });

    } catch (error) {
        console.error("Delete content error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete content"
        });
    }
}