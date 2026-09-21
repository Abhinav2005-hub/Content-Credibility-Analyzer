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