// routes/aiRoutes.ts
import express from "express";
import { aiStream } from "../controllers/aiController";

const router = express.Router();

router.get("/ai-stream", aiStream);

export default router;
