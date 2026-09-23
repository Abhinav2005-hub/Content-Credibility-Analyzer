import { Router } from "express";

import { createEvidence } from "../controllers/evidence.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/claims/:claimId/evidence", authMiddleware, createEvidence);

export default router;