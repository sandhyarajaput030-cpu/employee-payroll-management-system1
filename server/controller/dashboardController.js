import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Payroll from "../models/Payroll.js";
import Attendance from "../models/Attendance.js";
import Notice from "../models/Notice.js";
import Leave from "../models/Leave.js";


export const getDashboardStats = async (req, res) => {
  console.log("Dashboard API HIT ✅");

  try {
    // 👥 Total Employees
const employees = await User.countDocuments({
  role: { $in: ["employee", "Employee"] }
});

    // 👩‍💼 HR Count
   const hr = await User.countDocuments({
  role: { $in: ["hr", "HR"] }
});

    // 💰 Total Payroll
   const payrollData = await Payroll.aggregate([
  {
    $match: { status: "approved" }
  },
  {
    $group: {
      _id: null,
      total: { $sum: "$netSalary" }
    }
  }
]);
    const payroll = payrollData.length > 0 ? payrollData[0].total : 0;

    // 📅 Attendance % — count by date range (Attendance.date is a Date)
    const now = new Date();
    // Use dateString (YYYY-MM-DD) to match Attendance API behavior and avoid timezone drift
    const todayStr = now.toLocaleDateString("en-CA");

    // To match client logic, compute per-employee status for today
    const employeeDocs = await User.find({ role: { $in: ['employee', 'Employee'] } }).select('_id');
    const empIds = employeeDocs.map((e) => e._id.toString());

    const todaysRecords = await Attendance.find({ dateString: todayStr }).select('employeeId status checkIn checkOut date');
    const recByEmp = new Map();
    todaysRecords.forEach((r) => {
      recByEmp.set(r.employeeId.toString(), r);
    });

    let presentCount = 0;
    let halfDayCount = 0;
    let leaveCount = 0;
    let absentCount = 0;

    empIds.forEach((id) => {
      const r = recByEmp.get(id);
      if (!r) {
        absentCount += 1;
        return;
      }

      const status = (r.status || '').toLowerCase();
      if (status === 'leave') {
        leaveCount += 1;
        return;
      }

      // If missing checkIn or checkOut, treat as Present (matches client)
      if (!r.checkIn || !r.checkOut) {
        presentCount += 1;
        return;
      }

      const hours = (new Date(r.checkOut) - new Date(r.checkIn)) / (1000 * 60 * 60);
      if (hours >= 4) presentCount += 1;
      else if (hours > 0) halfDayCount += 1;
      else absentCount += 1;
    });

    const attendance = employees > 0 ? Math.round((presentCount / employees) * 100) : 0;

    // 📄 Payslips
   const payslips = await Payroll.countDocuments({
  status: "approved"
});

// 📄 Leaves Count
// 📄 Leaves Count (case-insensitive fix)
const leaves = await Leave.countDocuments({
  status: { $regex: "^pending$", $options: "i" }
});

// 📢 Notice Board Count
const noticeBoard = await Notice.countDocuments();

    // 📊 Chart Data (Monthly Payroll)
    const chartData = await Payroll.aggregate([
  {
    $match: { status: "approved" }
  },
  {
    $group: {
      _id: "$month",
      salary: { $sum: "$netSalary" }
    }
  },
  { $sort: { _id: 1 } }
]);

    const formattedChart = chartData.map((item) => ({
      month: item._id,
      salary: item.salary
    }));

    // ✅ Response
   res.status(200).json({
  success: true,
  data: {
    employees,
    hr,
    payroll,
    attendance,
    payslips,
    noticeBoard,
    leaves,
    chartData: formattedChart
  }
});

  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};