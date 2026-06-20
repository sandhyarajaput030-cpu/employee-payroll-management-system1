import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  backfillLeavesToAttendance,
} from "../controller/leaveController.js";

import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/apply", auth, applyLeave);
router.get("/my", auth, getMyLeaves);
router.get("/all", auth, getAllLeaves);
router.put("/:id", auth, updateLeaveStatus);
router.post("/backfill", auth, backfillLeavesToAttendance);

export default router;