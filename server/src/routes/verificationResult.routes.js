import { Router } from "express";
import { createVerificationResult, getVerificationResults } from "../controllers/verificationResult.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/analysis/:analysisId/results", authMiddleware, createVerificationResult);

router.get("/analysis/:analysisId/results", authMiddleware, getVerificationResults);

export default router;