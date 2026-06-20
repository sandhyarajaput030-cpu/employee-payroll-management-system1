import express from "express";
import {
  getAllHRManagers,
  createHR,
  deleteHR,
  getHRById,
  updateHR,
} from "../controller/hrController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js"

const router = express.Router();

// All routes protected & admin-only
router.use(protect, authorize("admin"));

// List HRs
router.get("/", getAllHRManagers);

// Create HR
router.post("/", createHR);

// View single HR
router.get("/:id", getHRById);

// Update HR
router.put("/:id", updateHR);

// Delete HR
router.delete("/:id", deleteHR);

export default router;