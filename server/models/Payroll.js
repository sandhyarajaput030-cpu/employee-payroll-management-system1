import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
   employeeId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Employee",
  required: true
},
  employeeName: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      default: ""
    },

    department: {
      type: String,
      default: ""
    },

    totalDays: {
      type: Number,
      default: 0
    },

    presentDays: {
      type: Number,
      default: 0
    },

    performance: {
      type: String,
      default: ""
    },

    startDate: String,
    endDate: String,

    hra: Number,
    bonus: Number,
    deductions: Number,
    overtime: Number,
    overtimeHours: Number,
    extraOrders: Number,

    baseSalary: {
      type: Number,
      default: 30000
    },

    netSalary: Number,

    status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
}
  },
  
  { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);