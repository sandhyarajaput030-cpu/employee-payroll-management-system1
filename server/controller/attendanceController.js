// server/controller/attendanceController.js
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Leave from "../models/Leave.js";
import { getAttendanceStatus } from "../utils/calculateSalary.js";


// GET attendance (only employees)
export const getAttendance = async (req, res) => {
  try {
    let { date, month } = req.query;

    // If no date or month provided, default to today's dateString (YYYY-MM-DD)
    if (!date && !month) {
      date = new Date().toLocaleDateString("en-CA");
    }

    let records = [];

    if (date) {
      // Strict match using dateString (YYYY-MM-DD)
      records = await Attendance.find({ dateString: date }).populate({
        path: "employeeId",
        select: "name department designation role",
      });
    } else if (month) {
      // month expected as YYYY-MM — return all records for that month
      const [y, m] = month.split("-").map(Number);
      if (!y || !m) return res.status(400).json({ message: "Invalid month format" });

      // Build IST-aware start and end for the month
      const istOffset = 5.5 * 60 * 60 * 1000;
      const startOfMonth = new Date(Date.UTC(y, m - 1, 1));
      startOfMonth.setTime(startOfMonth.getTime() - istOffset);
      const endOfMonth = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));
      endOfMonth.setTime(endOfMonth.getTime() - istOffset);

      records = await Attendance.find({ date: { $gte: startOfMonth, $lte: endOfMonth } }).populate({
        path: "employeeId",
        select: "name department designation role",
      });
    } else {
      return res.status(400).json({ message: "Provide either date (YYYY-MM-DD) or month (YYYY-MM)" });
    }

    // ✅ Only employee records
    const employeeRecords = records.filter(
      (r) => r.employeeId?.role === "employee"
    );

    res.json(employeeRecords);
  } catch (err) {
    console.error("Fetch attendance error:", err);
    res.status(500).json({ message: "Error fetching attendance" });
  }
};

// CHECK IN
export const checkIn = async (req, res) => {
  // allow admins/hr to mark attendance for other employees by passing employeeId in body
  const actorId = req.user._id;
  const targetEmployeeId = req.body.employeeId || actorId;
  try {
   // ===== IST DATE FIX =====
const now = new Date();
const istOffset = 5.5 * 60 * 60 * 1000;
const istNow = new Date(now.getTime() + istOffset);

const startOfDay = new Date(istNow);
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date(istNow);
endOfDay.setHours(23, 59, 59, 999);

const startUTC = new Date(startOfDay.getTime() - istOffset);
const endUTC = new Date(endOfDay.getTime() - istOffset);

    // Allow an explicit date (YYYY-MM-DD) to be provided when marking other days
   if (!req.body.date) {
  return res.status(400).json({ message: "Date is required" });
}

const dateString = req.body.date;

   const existing = await Attendance.findOne({
      employeeId: targetEmployeeId,
      dateString: dateString
    });
    if (existing) {
  return res.status(400).json({ 
    message: "Already checked in",
    existing: {
      id: existing._id,
      date: existing.date,
      checkIn: existing.checkIn,
      checkOut: existing.checkOut,
      status: existing.status
    }
  });
}

    const newRecord = new Attendance({
      employeeId: targetEmployeeId,
      date: new Date(dateString + "T00:00:00.000Z"),
      dateString: dateString,
      checkIn: req.body.checkIn ? new Date(req.body.checkIn) : new Date(),
      status: "Present",
      markedBy: actorId
    });

    await newRecord.save();
    res.json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error checking in" });
  }
};

// CHECK OUT (fixed)

export const checkOut = async (req, res) => {
  try {
    const empId = req.body.employeeId || req.user._id;

    // 🔥 Get the latest attendance record (avoids timezone/date issues)
   // ===== SAME IST LOGIC =====
const now = new Date();
const istOffset = 5.5 * 60 * 60 * 1000;
const istNow = new Date(now.getTime() + istOffset);

const startOfDay = new Date(istNow);
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date(istNow);
endOfDay.setHours(23, 59, 59, 999);

const startUTC = new Date(startOfDay.getTime() - istOffset);
const endUTC = new Date(endOfDay.getTime() - istOffset);

// ✅ FIND RECORD FOR PROVIDED DATE OR TODAY
if (!req.body.date) {
  return res.status(400).json({ message: "Date is required" });
}

const dateString = req.body.date;

const record = await Attendance.findOne({
  employeeId: empId,
  dateString: dateString
});

    if (!record) {
      return res.status(400).json({ message: "No check-in record found" });
    }

    if (record.checkOut) {
      return res.status(400).json({ message: "Already checked out" });
    }

    record.checkOut = req.body.checkOut ? new Date(req.body.checkOut) : new Date();

     // ✅ CALCULATE STATUS HERE
    const hours = (record.checkOut - record.checkIn) / (1000 * 60 * 60);
    // Use 6 hours as full day threshold, 4+ hours as half day
   if (hours >= 6) {
  record.status = "Present";
} else if (hours >= 3 && hours < 6) {
  record.status = "Half Day";
} else {
  record.status = "Absent";
}
record.workHours = hours.toFixed(1);

    await record.save();

    res.status(200).json({ message: "Checked out successfully", record });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Error updating attendance", error: err.message });
  }
};

// EDIT ATTENDANCE (Admin + HR)
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
   const { status } = req.body;

    // ✅ ADD VALIDATION HERE
    const allowedStatus = ["Present", "Half Day", "Leave", "Absent"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

const updated = await Attendance.findByIdAndUpdate(
  id,
  { status },
  { new: true }
);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating attendance" });
  }
};

// DELETE ATTENDANCE (Admin + HR)
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    await Attendance.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting attendance" });
  }
};

// DEBUG: Get today's attendance record for an employee (protected)
export const getTodayRecord = async (req, res) => {
  try {
    const employeeId = req.user._id;

    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

    const record = await Attendance.findOne({
      employeeId: employeeId,
      dateString: today
    });

    res.json(record || null);

  } catch (err) {
    console.error("Error fetching today record:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET logged-in employee attendance (ONLY THEIR DATA)
export const getEmployeeAttendance = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { month } = req.query; // YYYY-MM

    let filter = { employeeId };

    // ✅ APPLY MONTH FILTER
    if (month) {
      const [year, m] = month.split("-").map(Number);

     const start = new Date(`${month}-01T00:00:00.000Z`);
     const end = new Date(`${month}-31T23:59:59.999Z`);

      filter.date = {
        $gte: start,
        $lte: end,
      };
    }

    const today = new Date();

const records = await Attendance.find({
  ...filter,
  date: { ...filter.date, $lte: today } // ❗ BLOCK FUTURE
})
      .sort({ date: 1 })
      .populate({
        path: "employeeId",
        select: "name department designation",
      });

    // ✅ APPLY LEAVE OVERRIDE (IMPORTANT)

// Step 1: Get attendance
const attendanceRecords = await Attendance.find({
  ...filter,
  date: { ...filter.date, $lte: today }
}).lean();

// Step 2: Get approved leaves for this employee
const leaves = await Leave.find({
  employeeId,
  status: "Approved"
});

// Step 3: Convert attendance to map
const attendanceMap = {};
attendanceRecords.forEach((rec) => {
  attendanceMap[rec.dateString] = rec;
});

// Step 4: Add leave days (even if no attendance exists)
leaves.forEach((leave) => {
  let current = new Date(leave.startDate);

  while (current <= leave.endDate && current <= today) {
    const dateStr = current.toLocaleDateString("en-CA");

    // If no attendance exists, create leave entry
    if (!attendanceMap[dateStr]) {
      attendanceMap[dateStr] = {
        date: current,
        dateString: dateStr,
        status: "Leave",
        checkIn: null,
        checkOut: null,
      };
    } else {
      // Override existing attendance with leave
      attendanceMap[dateStr].status = "Leave";
    }

    current.setDate(current.getDate() + 1);
  }
});

// Step 5: Convert map back to array
const finalRecords = Object.values(attendanceMap).sort(
  (a, b) => new Date(a.date) - new Date(b.date)
);

res.json(finalRecords);
  } catch (err) {
    console.error("Employee attendance error:", err);
    res.status(500).json({ message: "Error fetching employee attendance" });
  }
};

export const syncTodayLeaveToAttendance = async () => {
  const todayStr = new Date().toLocaleDateString("en-CA");
  const todayDate = new Date(todayStr + "T00:00:00.000Z");

  const leaves = await Leave.find({
    startDate: { $lte: todayDate },
    endDate: { $gte: todayDate },
    status: "Approved",
  });

  for (const leave of leaves) {
    const existing = await Attendance.findOne({
      employeeId: leave.employeeId,
      dateString: todayStr,
    });

    if (!existing) {
      await Attendance.create({
        employeeId: leave.employeeId,
        dateString: todayStr,
        date: todayDate,
        status: "Leave",
        checkIn: null,
        checkOut: null,
      });
    } else {
      existing.status = "Leave";
      await existing.save();
    }
  }
};

// 🔧 FIX OLD ATTENDANCE DATA (RUN ONCE)
export const fixOldAttendanceData = async (req, res) => {
  try {
    const records = await Attendance.find();

    for (let r of records) {
      if (r.checkIn && r.checkOut) {
        const hours = (r.checkOut - r.checkIn) / (1000 * 60 * 60);

        if (hours >= 6) r.status = "Present";
        else if (hours >= 3) r.status = "Half Day";
        else r.status = "Absent";

        await r.save();
      }
    }

    res.json({ message: "✅ Attendance data fixed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fixing data" });
  }
};