import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../config/database.js";
import jwt from "jsonwebtoken";

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

export async function login(req, res) {
    try {

        const data = z.object({
            email: z.string().email(),
            password: z.string().min(8)
        }).parse(req.body);

        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.passwordHash
        );

        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
}

export async function getMe(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error("Get me error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get user"
        });
    }
}