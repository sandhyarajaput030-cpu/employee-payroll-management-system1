import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { 
  getDashboardStats, 
  getEmployees, 
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controller/employeeController.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

const router = express.Router();

// ✅ TEMPORARY FIX ROUTE - To fix existing employee data
router.get('/fix-employees', async (req, res) => {
  try {
    const users = await User.find({ role: "employee" });
    
    let created = 0;
    let alreadyExists = 0;
    let failed = 0;

    for (const user of users) {
      const existingEmployee = await Employee.findOne({ userId: user._id });
      
      if (!existingEmployee) {
        try {
          await Employee.create({
            userId: user._id,
            employeeId: `EMP${user._id.toString().slice(-6)}`,
            department: user.department || "General",
            position: user.designation || "Staff",
            joiningDate: user.createdAt || new Date(),
            salary: {
              basic: 50000,
              allowances: 10000,
              deductions: 5000
            },
            bankDetails: {
              accountNumber: "Not Provided",
              bankName: "Not Provided",
              ifscCode: "Not Provided"
            },
            emergencyContact: {
              name: "Not Provided",
              relationship: "Not Provided",
              phone: "Not Provided"
            },
            isActive: true
          });
          created++;
        } catch (err) {
          failed++;
        }
      } else {
        alreadyExists++;
      }
    }

    res.json({
      success: true,
      message: "Employee data fix completed",
      stats: {
        totalEmployees: users.length,
        created,
        alreadyExists,
        failed
      }
    });
    
  } catch (error) {
    console.error("Error fixing employees:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ✅ Dashboard stats route
router.get('/dashboard-stats', protect, authorize('admin', 'hr'), getDashboardStats);


// ✅ Employee CRUD routes (UPDATED - admin + hr access)
router.route('/')
  .get(protect, authorize('admin', 'hr'), getEmployees)
  .post(protect, authorize('admin', 'hr'), createEmployee);

router.route('/:id')
  .get(protect, authorize('admin', 'hr'), getEmployeeById)
  .put(protect, authorize('admin', 'hr'), updateEmployee)
  .delete(protect, authorize('admin', 'hr'), deleteEmployee);


export default router;