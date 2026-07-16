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
  },

  generateAnalysisReport: async (farmData) => {
    if (!apiKey) {
      throw new Error("AI service is not configured.");
    }

    const promptText = `Generate a farm analysis report for this digital twin field:
Farm Profile:
${JSON.stringify(farmData, null, 2)}

Return a valid JSON object matching the following structure. Do not wrap the JSON in Markdown or backticks, return ONLY the raw JSON string:
{
  "healthScore": 82,
  "soilFertility": {
    "nitrogen": { "value": "240 kg/ha", "status": "Poor" },
    "phosphorus": { "value": "35 kg/ha", "status": "Good" },
    "potassium": { "value": "290 kg/ha", "status": "Good" },
    "pH": { "value": "6.8", "status": "Good" },
    "organicMatter": { "value": "1.8%", "status": "Moderate" }
  },
  "cropHistory": [
    {
      "season": "Season 1",
      "crop": "Rice",
      "nutrientImpact": "Highly depleted Nitrogen (-45 kg/ha) and Potassium (-30 kg/ha)."
    },
    {
      "season": "Season 2",
      "crop": "Cotton",
      "nutrientImpact": "Moderate depletion of Phosphorus (-15 kg/ha) and soil organic matter."
    }
  ],
  "nextCropRecommendation": {
    "cropName": "Chickpea",
    "confidence": 94,
    "expectedYield": "1.8 Tons/Acre",
    "expectedProfit": "₹45,000/Acre",
    "reason": "Rotating with a nitrogen-fixing legume like Chickpea will restore soil fertility, reduce fertilizer costs, and break pest nesting cycles after Cotton."
  },
  "waterUsage": {
    "totalWaterUsed": "450,000 Liters",
    "waterSaved": "85,000 Liters (18%)",
    "irrigationEfficiency": "88%",
    "history": [
      { "week": "Week 1", "usage": 45000, "average": 55000 },
      { "week": "Week 2", "usage": 48000, "average": 55000 },
      { "week": "Week 3", "usage": 42000, "average": 55000 },
      { "week": "Week 4", "usage": 39000, "average": 55000 }
    ]
  },
  "yieldPrediction": {
    "expectedYield": "2.1 Tons/Acre",
    "confidence": 88,
    "riskLevel": "Low Risk"
  },
  "insights": [
    "Soil nitrogen levels have decreased by 15% due to double crop cultivation.",
    "Potassium level remains in the optimal range (290 kg/ha).",
    "Water usage was reduced by 18% using smart drip scheduling.",
    "Leguminous crop rotation is highly recommended for next season."
  ],
  "actionPlan": [
    "Apply organic compost to replenish organic matter to >2.5%.",
    "Reduce irrigation frequency by 10% during early seedling stage.",
    "Sow Chickpea next season to biologically fix atmospheric Nitrogen.",
    "Add 25 kg/ha of potassium fertilizer to sustain current soil levels.",
    "Conduct a comprehensive soil test post-harvest to check nutrient status."
  ]
}

Rules:
1. Customize the values (nutrients status Poor/Moderate/Good, crop names in history and next recommendations, water savings, expected yield/profit) based on the inputs in Farm Profile.
2. Return ONLY a valid JSON string. No prefix text, no markdown backticks, no comments.`;

    logger.info("Calling Gemini API (gemini-2.0-flash) for farm analysis report...");
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: promptText
      });
      return parseCleanJson(response.text);
    } catch (err) {
      logger.error("Gemini Analysis Report Service Error:", err.message || err);
      throw err;
    }
  }
};
