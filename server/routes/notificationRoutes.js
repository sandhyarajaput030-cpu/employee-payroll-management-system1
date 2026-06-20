import express from "express";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  clearNotifications,
} from "../controller/notificationController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);

// ✅ IMPORTANT: clear must come BEFORE :id
router.delete("/clear", protect, clearNotifications);
router.delete("/:id", protect, deleteNotification);

export default router;