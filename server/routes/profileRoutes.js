import express from "express";
import { getProfile, updateProfile } from "../controller/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ GET PROFILE
router.get("/profile", protect, getProfile);

// ✅ UPDATE PROFILE
router.put("/profile", protect, updateProfile);

export default router;