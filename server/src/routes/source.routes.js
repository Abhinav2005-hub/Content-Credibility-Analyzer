import { Router } from "express";

import { createSource } from "../controllers/source.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createSource);

export default router;