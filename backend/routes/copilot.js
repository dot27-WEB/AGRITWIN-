import express from "express";
import { chatCopilot } from "../controllers/copilotController.js";

const router = express.Router();

router.post("/chat", chatCopilot);

export default router;
