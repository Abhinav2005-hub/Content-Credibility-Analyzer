import { Router } from "express";
import { createVerificationResult } from "../controllers/verificationResult.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/analysis/:analysisId/results", authMiddleware, createVerificationResult);

export default router;