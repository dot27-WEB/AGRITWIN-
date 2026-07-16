import express from "express";
import { getAnalysisReport } from "../controllers/analysisController.js";

const router = express.Router();

router.post("/report", getAnalysisReport);

export default router;
