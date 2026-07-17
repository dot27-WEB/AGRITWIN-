import { geminiService } from "../services/geminiService.js";
import { ttsService } from "../services/ttsService.js";
import { logger } from "../utils/logger.js";

export const chatCopilot = async (req, res, next) => {
  logger.info("POST /api/copilot/chat - Request received");
  const { message, language, farmData, history } = req.body || {};
  try {
    if (!message) {
      logger.warn("POST /api/copilot/chat - Missing query prompt");
      return res.status(400).json({ error: "Missing message parameters" });
    }

    logger.info("User Message Received");

    // Generate final text response
    const aiResponse = await geminiService.chatCopilot(message, language || "en", farmData || {}, history || []);
    
    // Synthesize speech using Google Cloud Text-to-Speech
    let audioBase64 = null;
    try {
      audioBase64 = await ttsService.synthesizeSpeech(aiResponse, language || "en");
      logger.info("Voice Generated");
    } catch (ttsErr) {
      logger.error("TTS Synthesis skipped/failed inside controller:", ttsErr.message || ttsErr);
    }

    logger.info("Response Sent");
    res.json({ text: aiResponse, audio: audioBase64 });
  } catch (err) {
    logger.error("POST /api/copilot/chat - Controller pipeline error:", err.message || err);
    try {
      const fallback = geminiService.chatCopilotFallback(message, language || "en", farmData || {}, history || []);
      
      let fallbackAudioBase64 = null;
      try {
        fallbackAudioBase64 = await ttsService.synthesizeSpeech(fallback, language || "en");
        logger.info("Voice Generated");
      } catch (ttsErr) {
        logger.error("TTS Synthesis skipped/failed for fallback inside controller:", ttsErr.message || ttsErr);
      }

      logger.info("Response Sent");
      return res.json({ text: fallback, audio: fallbackAudioBase64 });
    } catch (e) {
      next(err);
    }
  }
};
