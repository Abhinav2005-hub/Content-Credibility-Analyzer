import { z } from "zod";
import prisma from "../config/database.js";

const createSourceSchema = z.object({
    title: z.string().max(200).optional(),
    url: z.string().url()
});

export async function createSource(req, res) {
    try {
        const data = createSourceSchema.parse(req.body);

        const existingSource = await prisma.source.findUnique({
            where: {
                url: data.url
            }
        });

        if (existingSource) {
            return res.status(200).json({
                success: true,
                message: "Source already exists",
                data: existingSource
            });
        }

        const source = await prisma.source.create({
            data: {
                title: data.title,
                url: data.url
            }
        });

        return res.status(201).json({
            success: true,
            message: "Source created successfully",
            data: source
        });

    } catch (error) {
        console.error("Create source error:", error);

        return res.status(500).json ({
            success: false,
            message: "Failed to create source"
        });
    }
}