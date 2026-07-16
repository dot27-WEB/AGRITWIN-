import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  logger.warn("GEMINI_API_KEY is not defined in the backend environment!");
}

const ai = new GoogleGenAI({ apiKey });

// Helper to strip markdown formatting blocks
const parseCleanJson = (text) => {
  let cleanJson = text.trim();
  if (cleanJson.startsWith("```")) {
    cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleanJson);
};

export const geminiService = {
  analyzeCropImage: async (fileBuffer, mimeType) => {
    if (!apiKey) {
      throw new Error("AI service is not configured.");
    }

    const promptText = `Analyze this crop leaf image. Identify the crop and the disease if present.
Return a valid JSON object matching the following structure. Do not wrap the JSON in Markdown or backticks, return ONLY the raw JSON string:
{
  "cropName": "Name of the crop",
  "diseaseName": "Name of the disease",
  "confidenceScore": "percentage, e.g. 93%",
  "severity": "low" | "medium" | "high",
  "symptoms": ["symptom 1", "symptom 2"],
  "possibleCause": "What caused it",
  "organicTreatment": "Details of organic spray/treatment",
  "chemicalTreatment": "Details of chemical sprays",
  "preventionTips": ["tip 1", "tip 2"],
  "recoveryTime": "duration, e.g. 10 - 14 Days",
  "advice": "General agricultural recommendation",
  "whyObserved": ["observed symptom 1", "observed symptom 2"]
}

Rules:
1. If the plant is healthy and no disease is detected, set "diseaseName" to "Healthy Plant" and "severity" to "low".
2. If you are not confident or the image is not a plant leaf, set "diseaseName" to "Uncertain".
3. Return ONLY a valid JSON string. No prefix text, no markdown backticks, no comments.`;

    logger.info("Calling Gemini Vision API (gemini-2.0-flash) for disease diagnostics...");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          promptText,
          {
            inlineData: {
              data: fileBuffer.toString("base64"),
              mimeType: mimeType
            }
          }
        ]
      });

      const responseText = response.text;
      return parseCleanJson(responseText);
    } catch (err) {
      logger.error("Gemini Vision Service Error:", err.message || err);
      throw err;
    }
  },

  chatCopilot: async (message, language, farmData) => {
    if (!apiKey) {
      throw new Error("AI service is not configured.");
    }

    const promptText = `You are the AgriTwin AI farming assistant.
User message: "${message}"
Preferred response language: "${language}"

Active Farm Context:
${JSON.stringify(farmData, null, 2)}

Please provide a helpful, natural, and warm response in the requested language (or English if not supported/auto). Keep the tone encouraging, and reference the farm data metrics if relevant to answer the query. Return ONLY the text response.`;

    logger.info(`Calling Gemini API (gemini-2.0-flash) for copilot chat in lang: ${language}...`);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: promptText
      });
      return response.text;
    } catch (err) {
      logger.error("Gemini Chat Service Error:", err.message || err);
      throw err;
    }
  },

  recommendIrrigation: async (crop, soilMoisture, temperature, humidity, rainfall, weatherForecast) => {
    if (!apiKey) {
      throw new Error("AI service is not configured.");
    }

    const promptText = `Generate smart irrigation recommendations based on:
Crop: "${crop}"
Soil Moisture: "${soilMoisture}"
Temperature: "${temperature}°C"
Humidity: "${humidity}%"
Rainfall: "${rainfall}mm"
Weather Forecast: "${weatherForecast}"

Return a valid JSON object matching the following structure. Do not wrap the JSON in Markdown or backticks, return ONLY the raw JSON string:
{
  "status": "safe" | "wait" | "warning",
  "statusLabel": "Status description labels",
  "statusBadge": "Status label with emoji prefix, e.g. 🟢 Safe to Irrigate / 🟡 Wait for Better Conditions / 🔴 Irrigation Not Recommended",
  "statusBg": "tailwind background styles, e.g. 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' for safe, 'border-amber-500/20 bg-amber-500/5 text-amber-400' for wait, 'border-rose-500/20 bg-rose-500/5 text-rose-400' for warning",
  "recText": "Detailed recommendation text",
  "expectedSaving": "Percentage of water saved, e.g. approximately 15%",
  "waterReq": "Water required description, e.g. 21000 Liters",
  "timeSchedule": "watering schedules, e.g. 6:00 AM – 7:30 AM",
  "rainImpact": "Description of rain impact on soil",
  "moistureStatus": "Moisture level description",
  "whyText": "Explanation of why this recommendation was generated"
}`;

    logger.info("Calling Gemini API (gemini-2.0-flash) for irrigation diagnostics...");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: promptText
      });
      return parseCleanJson(response.text);
    } catch (err) {
      logger.error("Gemini Irrigation Service Error:", err.message || err);
      throw err;
    }
  }
};
