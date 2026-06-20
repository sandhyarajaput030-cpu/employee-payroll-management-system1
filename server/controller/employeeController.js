import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Payroll from "../models/Payroll.js";
import Attendance from "../models/Attendance.js";
import Notification from "../models/Notification.js";


// ✅ GET DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: "employee" });
    console.log("Total Employees Count:", totalEmployees);

    const hrManagers = await User.countDocuments({ role: "hr" });

    const payrollData = await Payroll.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$netSalary" }
        }
      }
    ]);

    const totalPayroll = payrollData[0]?.total || 0;

    const totalAttendance = await Attendance.countDocuments();
    const presentCount = await Attendance.countDocuments({ status: "Present" });

    const attendancePercentage =
      totalAttendance > 0
        ? Math.round((presentCount / totalAttendance) * 100)
        : 0;

    const payslipsCount = await Payroll.countDocuments();

    res.json({
      success: true,
      data: {
        employees: totalEmployees,
        hr: hrManagers,
        payroll: totalPayroll,
        attendance: attendancePercentage,
        reports: 12,
        leaves: 0,
        payslips: payslipsCount,
        chartData: [
          { month: "Jan", salary: 40000 },
          { month: "Feb", salary: 30000 },
          { month: "Mar", salary: 60000 },
          { month: "Apr", salary: 50000 }
        ]
      }
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ GET ALL EMPLOYEES
export const getEmployees = async (req, res) => {
  try {
    const users = await User.find({ role: "employee" }).select("-password");

    const employeesWithDetails = await Promise.all(
      users.map(async (user) => {
        const employeeDetails = await Employee.findOne({ userId: user._id });

        return {
          _id: user._id,
          employeeId:
            employeeDetails?.employeeId ||
            `EMP${user._id.toString().slice(-6)}`,

          name: user.name,
          email: user.email,

          contact: employeeDetails?.contact || "",

          department:
            employeeDetails?.department || user.department || "Not Assigned",

          position:
            employeeDetails?.position || user.designation || "Not Assigned",

          joiningDate:
            employeeDetails?.joiningDate || user.createdAt || new Date(),

          salary:
            employeeDetails?.salary || {
              basic: 0,
              allowances: 0,
              deductions: 0
            },

          bankDetails: employeeDetails?.bankDetails || {},
          emergencyContact: employeeDetails?.emergencyContact || {},

          isActive:
            employeeDetails?.isActive !== undefined
              ? employeeDetails.isActive
              : true,

          role: user.role
        };
      })
    );

    res.json({
      success: true,
      count: employeesWithDetails.length,
      data: employeesWithDetails
    });
  } catch (error) {
    console.error("Get Employees Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ GET EMPLOYEE BY ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    const employeeDetails = await Employee.findOne({ userId: user._id });

    const employeeData = {
      _id: user._id,
      employeeId:
        employeeDetails?.employeeId ||
        `EMP${user._id.toString().slice(-6)}`,

      name: user.name,
      email: user.email,

      contact: employeeDetails?.contact || "",

      department:
        employeeDetails?.department || user.department || "Not Assigned",

      position:
        employeeDetails?.position || user.designation || "Not Assigned",

      joiningDate: employeeDetails?.joiningDate || user.createdAt,

      salary:
        employeeDetails?.salary || {
          basic: 0,
          allowances: 0,
          deductions: 0
        },

      bankDetails: employeeDetails?.bankDetails || {},
      emergencyContact: employeeDetails?.emergencyContact || {},

      isActive:
        employeeDetails?.isActive !== undefined
          ? employeeDetails.isActive
          : true,

      role: user.role
    };

    res.json({
      success: true,
      data: employeeData
    });
  } catch (error) {
    console.error("Get Employee By ID Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ CREATE EMPLOYEE
export const createEmployee = async (req, res) => {
  try {
   const { name, email, password, department, position, salary, contact } = req.body;

const normalizedEmail = email.toLowerCase();
    console.log("REQ BODY:", req.body);

   if (!name || !email || !password || password.trim() === "") {
  return res.status(400).json({
    success: false,
    message: "Name, email and valid password are required"
  });
}

console.log("REQ BODY:", req.body);
console.log("Password received:", password);

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }


    const user = await User.create({
      name,
     email: normalizedEmail,
      password: password,
      role: "employee".toLowerCase(),
      department: department || "General",
      designation: position || "Staff",
      contact: contact || "" 
    });

    const employee = await Employee.create({
      userId: user._id,
      employeeId: `EMP${user._id.toString().slice(-6)}`,
      department: department || "General",
      position: position || "Staff",
      joiningDate: new Date(),

      contact: contact || "",

      salary:
        typeof salary === "object"
          ? salary
          : {
              basic: salary || 0,
              allowances: 0,
              deductions: 0
            },

      isActive: true
    });

   res.status(201).json({
  success: true,
  data: {
    _id: user._id,
    name: user.name,
    email: user.email,
    employeeId: employee.employeeId
  }
});

// 🔔 ADD NOTIFICATION HERE (IMPORTANT)
await Notification.create({
  message: `New employee registered: ${user.name}`,
  type: "EMPLOYEE_REGISTERED",
  recipients: ["admin", "hr"],
  link: "/hr-dashboard/employees",
});

  } catch (error) {
    console.error("Create Employee Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ UPDATE EMPLOYEE
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("Updating Data:", updateData);

    await User.findByIdAndUpdate(id, {
      name: updateData.name,
      email: updateData.email,
      department: updateData.department,
      designation: updateData.position,
      contact: updateData.contact 
    });

    await Employee.findOneAndUpdate(
      { userId: id },
      {
        department: updateData.department,
        position: updateData.position,
        joiningDate: updateData.joiningDate,
        contact: updateData.contact,
        salary: updateData.salary,
        bankDetails: updateData.bankDetails,
        emergencyContact: updateData.emergencyContact
      },
      { new: true } // ✅ FIXED HERE
    );

    res.json({
      success: true,
      message: "Employee updated successfully"
    });
  } catch (error) {
    console.error("Update Employee Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ DELETE EMPLOYEE
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    await Employee.findOneAndDelete({ userId: id });
    await User.findByIdAndDelete(id);

    res.json({
  success: true,
  message: "Employee deleted successfully"
});

// 🔔 ADD NOTIFICATION HERE
await Notification.create({
  message: `Employee removed from system`,
  type: "EMPLOYEE_DELETED",
  recipients: ["admin", "hr"],
  link: "/hr-dashboard/employees",
});

  } catch (error) {
    console.error("Delete Employee Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};