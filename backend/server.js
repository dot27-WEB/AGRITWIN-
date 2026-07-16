import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

import diseaseRouter from "./routes/disease.js";
import copilotRouter from "./routes/copilot.js";
import irrigationRouter from "./routes/irrigation.js";
import analysisRouter from "./routes/analysis.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Standard logger middleware for incoming API dispatches
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Mounting Router modules
app.use("/api/disease", diseaseRouter);
app.use("/api/copilot", copilotRouter);
app.use("/api/irrigation", irrigationRouter);
app.use("/api/analysis", analysisRouter);

// Basic health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Standard Error Handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info("Backend Started");
  logger.info(`AgriTwin secure backend successfully listening on port ${PORT}`);
});
