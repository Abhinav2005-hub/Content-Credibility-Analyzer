import express from "express";
import prisma from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";

const app = express();

const PORT = 5000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Content Credibility Analyzer is running"
    });
});

app.get("/api/users", async(req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});