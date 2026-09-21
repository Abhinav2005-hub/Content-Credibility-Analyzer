import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../config/database.js";

const registerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8)
});

export async function register(req, res) {
    try {
        const data = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const passwordHash = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email:data.email,
                passwordHash
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });

    } catch (error) {
        console.error("Registered error:", error);

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
}