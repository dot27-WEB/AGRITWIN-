import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_PRIMARY;

// Map languages to Google Cloud Text-to-Speech standard/Wavenet voices
const LANGUAGE_VOICE_MAP = {
  en: { languageCode: "en-IN", name: "en-IN-Wavenet-B" }, // English (India)
  te: { languageCode: "te-IN", name: "te-IN-Standard-A" }, // Telugu
  hi: { languageCode: "hi-IN", name: "hi-IN-Wavenet-B" }, // Hindi
  ta: { languageCode: "ta-IN", name: "ta-IN-Standard-A" }, // Tamil
  kn: { languageCode: "kn-IN", name: "kn-IN-Standard-A" }, // Kannada
  ml: { languageCode: "ml-IN", name: "ml-IN-Standard-A" }  // Malayalam
};

// Map languages to Google Translate language codes
const GOOGLE_TRANSLATE_LANG_MAP = {
  en: "en",
  te: "te",
  hi: "hi",
  ta: "ta",
  kn: "kn",
  ml: "ml"
};

export const ttsService = {
  synthesizeSpeech: async (text, language) => {
    const cleanText = text
      .replace(/[*#_`~]/g, "")
      .replace(/[\uD800-\uDFFF]./g, "")
      .trim();

    if (!cleanText) {
      return null;
    }

    const normalizedLang = ["en", "te", "hi", "ta", "kn", "ml"].includes(language) ? language : "en";

    // --- Layer 1: Google Cloud Text-to-Speech REST API ---
    if (apiKey) {
      try {
        logger.info(`Layer 1 TTS: Synthesizing via Google Cloud TTS for language: ${normalizedLang}`);
        const voiceConfig = LANGUAGE_VOICE_MAP[normalizedLang];
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
        
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            input: { text: cleanText },
            voice: voiceConfig,
            audioConfig: { audioEncoding: "MP3" }
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.audioContent) {
            logger.info("Layer 1 TTS: Success");
            return data.audioContent;
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          logger.warn(`Layer 1 TTS failed with status ${response.status}: ${JSON.stringify(errorData)}`);
        }
      } catch (err) {
        logger.error(`Layer 1 TTS Exception: ${err.message || err}`);
      }
    }

    // --- Layer 2: Google Translate Public Speech Synthesis API ---
    try {
      logger.info(`Layer 2 TTS: Synthesizing via Google Translate TTS for language: ${normalizedLang}`);
      const ttsLang = GOOGLE_TRANSLATE_LANG_MAP[normalizedLang];
      
      // Request audio stream from Google Translate TTS service
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLang}&q=${encodeURIComponent(cleanText)}&client=tw-ob`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(buffer).toString("base64");
        logger.info("Layer 2 TTS: Success");
        return base64Audio;
      } else {
        logger.warn(`Layer 2 TTS failed with status: ${response.status}`);
      }
    } catch (err) {
      logger.error(`Layer 2 TTS Exception: ${err.message || err}`);
    }

    // Return null to allow client to gracefully fallback if needed
    return null;
  }
};
