import express from "express";
import {
  getAttendance,
  updateAttendance,
  deleteAttendance,
  checkIn,
  checkOut,
  getTodayRecord,
   getEmployeeAttendance,
   fixOldAttendanceData 
} from "../controller/attendanceController.js";

import protect, { authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/my-attendance", protect, getEmployeeAttendance);

router.get("/today", protect, getTodayRecord);

router.put("/:id", protect, authorize("admin", "hr"), updateAttendance);
router.delete("/:id", protect, authorize("admin", "hr"), deleteAttendance);
router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);

router.get("/", protect, getAttendance);

router.get("/fix-data", protect, authorize("admin"), fixOldAttendanceData);




export default router;