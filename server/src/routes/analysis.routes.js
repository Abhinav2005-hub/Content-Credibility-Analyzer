import { Router } from "express";

import {
    createAnalysis,
    getAnalysis,
    getAnalysisById,
    getAnalysisHistory
} from "../controllers/analysis.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
    "/content/:contentId/analysis",
    authMiddleware,
    createAnalysis
);

router.get(
    "/content/:contentId/analysis",
    authMiddleware,
    getAnalysis
);

router.get(
    "/analysis/history",
    authMiddleware,
    getAnalysisHistory
);

router.get(
    "/analysis/:analysisId",
    authMiddleware,
    getAnalysisById
);

export default router;