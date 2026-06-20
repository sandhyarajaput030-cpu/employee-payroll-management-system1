import express from "express";
import { getDashboardStats } from "../controller/dashboardController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔐 Protected Route
router.get("/", protect, getDashboardStats);

export default router;