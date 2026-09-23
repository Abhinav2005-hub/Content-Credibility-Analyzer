import { Router } from "express";

import { createClaim, getClaims } from "../controllers/claim.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/content/:contentId/claims", authMiddleware, createClaim);
router.get("/content/:contentId/claims", authMiddleware, getClaims);

export default router;