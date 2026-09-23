import { Router } from "express";
import { createAnalysis } from "../controllers/analysis.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/content/:contentId/analysis", authMiddleware, createAnalysis);

export default router;