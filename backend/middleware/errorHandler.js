import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.url} - Internal Exception:`, err.message || err);

  const errMsg = (err.message || "").toLowerCase();
  
  if (errMsg.includes("api key not valid") || errMsg.includes("api_key_invalid") || errMsg.includes("invalid api key")) {
    return res.status(401).json({ error: "Invalid API Key" });
  }

  if (errMsg.includes("not configured") || errMsg.includes("missing api key")) {
    return res.status(401).json({ error: "AI service is not configured." });
  }

  if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("limit") || errMsg.includes("resource_exhausted") || errMsg.includes("busy")) {
    return res.status(429).json({ error: "AI service busy" });
  }

  if (errMsg.includes("invalid image") || errMsg.includes("unsupported image") || errMsg.includes("multipart") || errMsg.includes("multer") || errMsg.includes("no image uploaded")) {
    return res.status(400).json({ error: "Invalid Image" });
  }

  if (err instanceof SyntaxError && (errMsg.includes("json") || errMsg.includes("position"))) {
    return res.status(502).json({ error: "Invalid JSON response from AI model" });
  }

  if (errMsg.includes("timeout") || errMsg.includes("deadline")) {
    return res.status(504).json({ error: "AI service timed out" });
  }

  if (errMsg.includes("fetch") || errMsg.includes("network") || errMsg.includes("econn") || errMsg.includes("request failed")) {
    return res.status(502).json({ error: "AI service connection failed" });
  }

  res.status(500).json({ error: "Internal Server Error" });
};
