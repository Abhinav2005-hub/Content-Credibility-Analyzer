import { Router } from "express";

import { createContent } from "../controllers/content.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createContent);

export default router;