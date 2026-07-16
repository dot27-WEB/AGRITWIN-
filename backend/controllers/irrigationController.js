import { geminiService } from "../services/geminiService.js";
import { logger } from "../utils/logger.js";

export const recommendIrrigation = async (req, res, next) => {
  logger.info("POST /api/irrigation/recommend - Request received");
  try {
    const { crop, soilMoisture, temperature, humidity, rainfall, weatherForecast } = req.body;
    
    const recommendation = await geminiService.recommendIrrigation(
      crop || "Unknown Crop",
      soilMoisture || "Normal",
      temperature || 25,
      humidity || 60,
      rainfall || 0,
      weatherForecast || "Sunny"
    );
    
    logger.info("POST /api/irrigation/recommend - Recommendations resolved successfully");
    res.json(recommendation);
  } catch (err) {
    next(err);
  }
};
