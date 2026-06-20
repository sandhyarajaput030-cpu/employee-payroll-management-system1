import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },

  contact: {
  type: String,
  default: ""
},

  department: {
    type: String,
    default: "General"
  },
  position: {
    type: String,
    default: "Staff"
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    basic: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 }
  },
  bankDetails: {
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    accountHolderName: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;