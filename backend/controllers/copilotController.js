import { geminiService } from "../services/geminiService.js";
import { logger } from "../utils/logger.js";

export const chatCopilot = async (req, res, next) => {
  logger.info("POST /api/copilot/chat - Request received");
  try {
    const { message, language, farmData } = req.body;
    if (!message) {
      logger.warn("POST /api/copilot/chat - Missing query prompt");
      return res.status(400).json({ error: "Missing message parameters" });
    }

    const aiResponse = await geminiService.chatCopilot(message, language || "en", farmData || {});
    logger.info("POST /api/copilot/chat - Response retrieved successfully");
    res.json({ text: aiResponse });
  } catch (err) {
    next(err);
  }
};
