import express from "express";
import { analyzeDisease } from "../controllers/diseaseController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/analyze", upload.single("image"), analyzeDisease);

export default router;
