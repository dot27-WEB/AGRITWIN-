import express from "express";
import { recommendIrrigation } from "../controllers/irrigationController.js";

const router = express.Router();

router.post("/recommend", recommendIrrigation);

export default router;
