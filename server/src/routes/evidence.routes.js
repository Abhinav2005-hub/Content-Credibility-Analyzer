import { Router } from "express";

import { createEvidence, getEvidence } from "../controllers/evidence.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/claims/:claimId/evidence", authMiddleware, createEvidence);

router.get("/claims/:claimId/evidence", authMiddleware, getEvidence);

export default router;