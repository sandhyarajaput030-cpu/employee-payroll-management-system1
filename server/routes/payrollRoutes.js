import express from "express";
import {
  generatePayslip,
  getEmployeePayslips,
  getSalaryPrediction,
  updatePayslip,
  getPayrollDefaults,
  updatePayslipStatus,
  getAllPayrolls
} from "../controller/payrollController.js";

const router = express.Router();

router.get("/defaults", getPayrollDefaults); 
// ✅ Generate payslip
router.post("/generate", generatePayslip);

// ✅ Salary prediction (MUST BE ABOVE /:name)
router.get("/prediction", getSalaryPrediction);

// ✅ Get payslips by employee name
router.get("/:name", getEmployeePayslips);

// ✅ New update route
router.put("/update/:id", updatePayslip);

router.put("/status/:id", updatePayslipStatus);

router.get("/", getAllPayrolls);

router.get("/employee/:name", getEmployeePayslips);

export default router;