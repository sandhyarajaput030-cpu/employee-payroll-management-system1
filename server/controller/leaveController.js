import Leave from "../models/Leave.js";
import Notification from "../models/Notification.js";
import Attendance from "../models/Attendance.js";


// ✅ APPLY LEAVE (Employee)
export const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    const leave = new Leave({
      employeeId: req.user.id,
      employeeName: req.user.name,
      department: req.user.department,
      startDate,
      endDate,
      reason,
    });

    await leave.save();

  await Notification.create({
  message: `New leave request from ${req.user.name}`,
  type: "LEAVE_REQUEST",
  recipients: ["admin", "hr"],   // ✅ correct
  link: "/hr-dashboard/leaves",
});

    res.status(201).json({ message: "Leave applied successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ GET MY LEAVES (Employee)
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.user.id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ GET ALL LEAVES (Admin / HR)
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ APPROVE / REJECT (Admin)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

   await Notification.create({
  message: `Your leave request is ${status}`,
  type: "LEAVE_STATUS",
  recipients: ["employee"],   // ✅ correct
  userId: leave.employeeId,
  link: "/employee-dashboard/leaves",
});
    // If approved, create/update attendance records for each date in the range
    if (status === "Approved") {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);

      // normalize time to 00:00 UTC for iteration
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = new Date(d).toLocaleDateString("en-CA");
        const dateObj = new Date(dateStr + "T00:00:00.000Z");

        const existing = await Attendance.findOne({
          employeeId: leave.employeeId,
          dateString: dateStr
        });

        if (!existing) {
          await Attendance.create({
            employeeId: leave.employeeId,
            dateString: dateStr,
            date: dateObj,
            status: "Leave",
            checkIn: null,
            checkOut: null
          });
        } else {
          existing.status = "Leave";
          existing.checkIn = null;
          existing.checkOut = null;
          await existing.save();
        }
      }
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN: Backfill Attendance records for all existing approved leaves
export const backfillLeavesToAttendance = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: "Approved" });
    let created = 0;

    for (const leave of leaves) {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = new Date(d).toLocaleDateString("en-CA");
        const dateObj = new Date(dateStr + "T00:00:00.000Z");

        const existing = await Attendance.findOne({ employeeId: leave.employeeId, dateString: dateStr });
        if (!existing) {
          await Attendance.create({
            employeeId: leave.employeeId,
            dateString: dateStr,
            date: dateObj,
            status: "Leave",
            checkIn: null,
            checkOut: null,
          });
          created++;
        }
      }
    }

    res.json({ message: `Backfilled ${created} attendance records for approved leaves` });
  } catch (err) {
    console.error("Backfill error:", err);
    res.status(500).json({ message: "Error backfilling leave attendance" });
  }
};