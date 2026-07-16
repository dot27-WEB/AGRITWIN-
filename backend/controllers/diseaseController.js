import { geminiService } from "../services/geminiService.js";
import { logger } from "../utils/logger.js";

export const analyzeDisease = async (req, res, next) => {
  logger.info("POST /api/disease/analyze - Request received");
  try {
    if (!req.file) {
      logger.warn("POST /api/disease/analyze - Missing visual attachment payload");
      return res.status(400).json({ error: "Invalid Image" });
    }

    logger.info("Image Uploaded");

    const report = await geminiService.analyzeCropImage(req.file.buffer, req.file.mimetype);
    
    res.json(report);
  } catch (err) {
    logger.error("POST /api/disease/analyze - Unexpected controller pipeline error: ", err.message || err);
    next(err);
  }
};
