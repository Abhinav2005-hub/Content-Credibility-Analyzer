import { z } from "zod";
import prisma from "../config/database.js";

const createClaimSchema = z.object({
    text: z.string().min(1)
});

export async function createClaim(req, res) {
    try {

        console.log("Params:", req.params);
        console.log("Body:", req.body);
        console.log("Content-Type:", req.headers["content-type"]);
        console.log("User ID:", req.userId);
        
        const contentId = Number(req.params.contentId);

        if (Number.isNaN(contentId)) {
            return res.status(400).json ({
                success: false,
                message: "Invalid content ID"
            });
        }

        const data = createClaimSchema.parse(req.body);

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

        const claim = await prisma.claim.create({
            data: {
                contentId,
                text: data.text
            }
        });

        return res.status(201).json ({
            success: true,
            message: "Claim created successfully",
            data: claim
        });

    } catch (error) {
        console.error("Create claim error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create claim"
        });
    }
}

export async function getClaims(req, res) {
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

        if(!content) {
            return res.status(404).json ({
                success: false,
                message: "Content  not found"
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

         return res.status(200).json ({
            success: true,
            data: claims
         });

    } catch (error) {
        console.error("Get claims error:", error);

        return res.status(500).json ({
            success: false,
            message: "Failed to fetch claims"
        });
    }
}