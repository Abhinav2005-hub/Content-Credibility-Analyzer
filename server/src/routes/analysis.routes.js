import { Router } from "express";
import { createAnalysis, getAnalysis } from "../controllers/analysis.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/content/:contentId/analysis", authMiddleware, createAnalysis);

router.get("/content/:contentId/analysis", authMiddleware, getAnalysis);

export default router;