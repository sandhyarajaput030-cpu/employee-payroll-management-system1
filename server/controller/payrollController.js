import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

const format = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


// ✅ 1. GENERATE PAYSLIP
export const generatePayslip = async (req, res) => {
  try {
    const {
      employeeName,
      startDate,
      endDate,
      hra = 0,
      bonus = 0,
      deductions = 0,
      overtime = 0,
      extraOrders = 0
      
    } = req.body;

   // Fetch User first
const user = await User.findById(employeeName);
if (!user) return res.status(404).json({ message: "User not found ❌" });

// Fetch Employee data using user's _id
const employeeData = await Employee.findOne({ userId: user._id });
if (!employeeData) return res.status(404).json({ message: "Employee data not found ❌" });

// ✅ Then base salary
const baseSalary = employeeData?.baseSalary || 30000;

// ✅ ADD THIS
const designation = employeeData.designation || employeeData.position || "N/A";
const department = employeeData.department || "N/A";

    // Determine date range (use provided startDate/endDate, else default to current month)
    const parseInputDate = (str) => {
      if (!str) return null;
      if (str instanceof Date) return str;
      if (typeof str !== "string") {
        const d = new Date(str);
        return isNaN(d.getTime()) ? null : d;
      }

      const parts = str.split("-");
      if (parts.length === 3) {
        // YYYY-MM-DD
        if (parts[0].length === 4) {
          const d = new Date(str);
          if (!isNaN(d.getTime())) return d;
        }

        // assume DD-MM-YYYY -> convert to YYYY-MM-DD
        const dd = parts[0].padStart(2, "0");
        const mm = parts[1].padStart(2, "0");
        const yyyy = parts[2];
        const iso = `${yyyy}-${mm}-${dd}`;
        const d2 = new Date(iso);
        if (!isNaN(d2.getTime())) return d2;
      }

      // try swapping separators (slashes) as fallback
      const alt = str.replace(/-/g, "/");
      const d3 = new Date(alt);
      return isNaN(d3.getTime()) ? null : d3;
    };

    let start = parseInputDate(startDate);
    let end = parseInputDate(endDate);

    if (!start || !end) {
      const now = new Date();
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // normalize to include full days
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Fetch attendance within the date range
    const attendanceRecords = await Attendance.find({
      employeeId: user._id,
      date: { $gte: start, $lte: end }
    });

    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.floor((end - start) / msPerDay) + 1;

    const presentDays = attendanceRecords.filter((rec) => {
      const value = rec.status || rec.attendanceStatus || rec.isPresent;
      if (typeof value === "boolean") return value === true;
      if (typeof value === "string") {
        return ["present", "p"].includes(value.toLowerCase().trim());
      }
      return false;
    }).length;

    // ✅ Performance logic
    let performance = "Poor";
    if (totalDays > 0) {
      const percentage = (presentDays / totalDays) * 100;
      if (percentage >= 90) performance = "Excellent";
      else if (percentage >= 75) performance = "Good";
      else if (percentage >= 50) performance = "Average";
    }

    let overtimeHours = 0;
    attendanceRecords.forEach((rec) => {
      if (!rec.checkIn || !rec.checkOut) return;
      const checkIn = new Date(rec.checkIn);
      const checkOut = new Date(rec.checkOut);
      const workedHours = (checkOut - checkIn) / (1000 * 60 * 60);
      const standardHours = workedHours >= 6 ? 8 : 4;
      const extraHours = workedHours - standardHours;
      if (extraHours > 0) overtimeHours += extraHours;
    });

    overtimeHours = Number(overtimeHours.toFixed(2));
    console.log("Attendance Records:", attendanceRecords.length);
    console.log("Final Overtime Hours:", overtimeHours);

    const extraOrdersCount = extraOrders || 5;

    // prepare stored date strings (ISO yyyy-mm-dd)
const storedStart = start.toLocaleDateString("en-CA");
const storedEnd = end.toLocaleDateString("en-CA");


// ✅ Rates
const overtimeRate = employeeData?.overtimeRate || 100;   // ₹ per hour
const extraOrderRate = employeeData?.ratePerOrder || 50;  // ₹ per extra order

// ✅ Calculations
const overtimePay = overtimeHours * overtimeRate;
const orderBonus = extraOrdersCount * extraOrderRate;

const grossSalary =
  baseSalary +
  Number(hra) +
  Number(bonus) +
  overtimePay +
  orderBonus;

const netSalary = grossSalary - Number(deductions);

    // ✅ Save to DB
    const payroll = await Payroll.create({
      employeeId: employeeData._id,  
      employeeName: user.name,

      designation,
      department,

      totalDays,
      presentDays,
      performance,

      startDate: storedStart,
      endDate: storedEnd,
      hra,
      bonus,
      deductions,
      // store both fields for compatibility with older clients
      overtime: Number(overtimeHours.toFixed(2)),
      overtimeHours: Number(overtimeHours.toFixed(2)),
      extraOrders: extraOrdersCount,
      baseSalary,
      grossSalary,
      netSalary,
      status: "pending"  
    });

    // 🔔 Create notifications: one for the employee, one for admins to approve
    await Notification.create({
      message: `Payslip generated for ${user.name}`,
      type: "PAYSLIP_GENERATED",
      recipients: ["employee"],
      userId: user._id,
      link: "/employee-dashboard/payslips",
    });

    await Notification.create({
      message: `Payslip pending approval for ${user.name}`,
      type: "PAYSLIP_PENDING_APPROVAL",
      recipients: ["admin"],
      link: "/admin-dashboard/payslips",
    });

    res.json(payroll);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ 2. GET PAYSLIPS BY EMPLOYEE
export const getEmployeePayslips = async (req, res) => {
  try {
    const { name } = req.params;

    const payrolls = await Payroll.find({
      employeeName: name,
      status: "approved"
     }).populate("employeeId", "position department");

    const formatted = payrolls.map(p => ({
  
  period: `${format(p.startDate)} - ${format(p.endDate)}`,
  netSalary: p.netSalary,

  // ✅ ADD THESE (THIS IS THE FIX)
  employeeName: p.employeeName,
  designation: p.designation || p.employeeId?.position,
  department: p.department || p.employeeId?.department,
  employeeId: p.employeeId,

  startDate: p.startDate,
  endDate: p.endDate,
  totalDays: p.totalDays,
  presentDays: p.presentDays,
  performance: p.performance, 

  // existing
  hra: p.hra,
  bonus: p.bonus,
  deductions: p.deductions,
  overtime: p.overtimeHours,
  extraOrders: p.extraOrders,
  baseSalary: p.baseSalary
}));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ✅ 3. SALARY PREDICTION
export const getSalaryPrediction = async (req, res) => {
  try {
    const payrolls = await Payroll.find({ status: "approved" });

    const grouped = {};

    payrolls.forEach(p => {
      if (!grouped[p.employeeName]) {
        grouped[p.employeeName] = [];
      }
      grouped[p.employeeName].push(p);
    });

    const result = [];

    for (let emp in grouped) {
      const records = grouped[emp];

      if (!records.length) continue;

       const sortedRecords = records.sort(
           (a, b) => new Date(b.startDate) - new Date(a.startDate)
         );

     const last = sortedRecords[0];

      
      if (!last) continue;

      const predictedSalary = Math.round(last.netSalary * 1.05);

      result.push({
        employeeName: emp, // ✅ FIX NAME
        lastSalary: last.netSalary,
        period: `${last.startDate} - ${last.endDate}`,
        predictedSalary
      });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ 4. UPDATE PAYSLIP
export const updatePayslip = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      employeeName,
      startDate,
      endDate,
      hra = 0,
      bonus = 0,
      deductions = 0,
      extraOrders = 0
    } = req.body;

    // ✅ FIX: use ID (same as generate)
    const user = await User.findById(employeeName);
    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    const employeeData = await Employee.findOne({ userId: user._id });
    if (!employeeData) {
      return res.status(404).json({ message: "Employee not found ❌" });
    }

    const baseSalary = employeeData?.baseSalary || 30000;

    const overtimeRate = employeeData?.overtimeRate || 100;
    const extraOrderRate = employeeData?.ratePerOrder || 50;

    // ⚠️ IMPORTANT: don't trust frontend overtime
    const overtimeHours = 0; // or recalc from Attendance if needed

    const overtimePay = overtimeHours * overtimeRate;
    const orderBonus = extraOrders * extraOrderRate;

    const grossSalary =
      baseSalary +
      Number(hra) +
      Number(bonus) +
      overtimePay +
      orderBonus;

    const netSalary = grossSalary - Number(deductions);

    const updated = await Payroll.findByIdAndUpdate(
      id,
      {
        employeeId: employeeData._id,
        employeeName: user.name,
        startDate,
        endDate,
        hra,
        bonus,
        deductions,
        overtime: overtimeHours,
        overtimeHours,
        extraOrders,
        baseSalary,
        grossSalary,
        netSalary
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};


// GET /api/payroll/defaults
// When fetching defaults for the employee
export const getPayrollDefaults = async (req, res) => {
  try {
    const { employeeName } = req.query;

   const user = await User.findById(employeeName);
if (!user) return res.status(404).json({ message: "User not found" });

const employee = await Employee.findOne({ userId: user._id });
if (!employee) return res.status(404).json({ message: "Employee not found" });

    // ✅ Get attendance records
    const attendanceRecords = await Attendance.find({
      employeeId: employee.userId || employee.userId
    });

    // ✅ Calculate overtime based on `workHours` field
    let overtime = 0;

    attendanceRecords.forEach((rec) => {
      const worked = Number(rec.workHours || 0);
      const standardHours = worked > 6 ? 8 : 4;
      const extra = worked - standardHours;
      if (extra > 0) overtime += extra;
    });

    const extraOrders = 5; // keep dummy

    res.json({
      hra: employee?.hra || 5000,
      bonus: employee?.bonus || 2000,
      deductions: employee?.deductions || 1000,
      overtime,        // ✅ REAL VALUE
      extraOrders
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updatePayslipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

   if (!["approved", "rejected"].includes(status)){
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Payroll.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    // Notify the specific employee about status change
    const payroll = await Payroll.findById(id).populate({ path: 'employeeId', select: 'userId' });

    if (status === 'approved') {
      await Notification.create({
        message: `Your payslip has been approved for ${payroll.employeeName}`,
        type: 'PAYSLIP_APPROVED',
        recipients: ['employee'],
        userId: payroll.employeeId?.userId || null,
        link: '/employee-dashboard/payslips'
      });
    }

    if (status === 'rejected') {
      await Notification.create({
        message: `Your payslip has been rejected for ${payroll.employeeName}`,
        type: 'PAYSLIP_REJECTED',
        recipients: ['employee'],
        userId: payroll.employeeId?.userId || null,
        link: '/employee-dashboard/payslips'
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL PAYSLIPS (FOR ADMIN)
export const getAllPayrolls = async (req, res) => {
  try {
   const { status } = req.query;

let query = {};

if (status === "pending-approved") {
  query = { status: { $in: ["pending", "approved"] } };
} else if (status) {
  query = { status };
}

    const payrolls = await Payroll.find(query)
      .populate({
        path: "employeeId",
        model: "Employee",
        select: "department position"
      });

    // Log and respond
    console.log("Payrolls sent to admin:", payrolls.length);
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  console.log("Payrolls sent to admin:", payrolls);
};


