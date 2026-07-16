import { geminiService } from "../services/geminiService.js";
import { logger } from "../utils/logger.js";

export const analyzeDisease = async (req, res, next) => {
  logger.info("POST /api/disease/analyze - Request received");
  try {
    if (!req.file) {
      logger.warn("POST /api/disease/analyze - Missing visual attachment payload");
      return res.status(400).json({ error: "Invalid Image" });
    }

    const report = await geminiService.analyzeCropImage(req.file.buffer, req.file.mimetype);
    logger.info("POST /api/disease/analyze - Diagnostics resolved successfully");
    res.json(report);
  } catch (err) {
    next(err);
  }
};
