import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createNotice,
  getNotices,
  deleteNotice
} from "../controller/noticeController.js";

const router = express.Router();

// Create notice (Admin/HR)
router.post("/", authMiddleware, createNotice);

// Get all notices (All roles)
router.get("/", authMiddleware, getNotices);

// Delete notice (Admin)
router.delete("/:id", authMiddleware, deleteNotice);

export default router;