import { Router } from "express";

import { createContent, getContents, getContentById, deleteContent } from "../controllers/content.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createContent);

router.get("/", authMiddleware, getContents);

router.get("/:id", authMiddleware, getContentById);

router.delete("/:id", authMiddleware, deleteContent);

export default router;