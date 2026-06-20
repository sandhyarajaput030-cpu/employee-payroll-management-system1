import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET all HR managers
export const getAllHRManagers = async (req, res) => {
  try {
    const hrManagers = await User.find({ role: "hr" }).select(
      "name email department designation contact"
    );
    res.json(hrManagers);
  } catch (error) {
    console.error("HR Controller Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// CREATE HR (Admin only)
export const createHR = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // ✅ DEBUG

    const { name, email, password, department, designation, contact } = req.body;

    // ✅ Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // ✅ Check existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    

    // ✅ Create HR
    const hr = await User.create({
      name,
      email,
      password,
      role: "hr",
      department,
      designation,
      contact
    });


      // ✅ Also create employee record for HR
    try {
      const Employee = (await import("../models/Employee.js")).default;
      await Employee.create({
        userId: hr._id,
        employeeId: `HR${hr._id.toString().slice(-6)}`,
        department: hr.department,
        position: hr.designation,
        joiningDate: new Date(),
        contact: contact || '',
        salary: {
          basic: 60000,
          allowances: 10000,
          deductions: 5000
        },
        isActive: true
      });
      console.log("✅ Employee record created for HR");
    } catch (empError) {
      console.log("Employee record creation skipped:", empError.message);
    }

    res.status(201).json(hr);

  } catch (error) {
    console.error("Create HR Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// DELETE HR
// DELETE HR
export const deleteHR = async (req, res) => {
  try {
    const hr = await User.findByIdAndDelete(req.params.id);
    if (!hr) return res.status(404).json({ success: false, message: "HR not found" });
    
    // Also delete employee record
    const Employee = (await import("../models/Employee.js")).default;
    await Employee.findOneAndDelete({ userId: req.params.id });
    
    res.json({ success: true, message: "HR deleted" });
  } catch (error) {
    console.error("Delete HR Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET single HR (for view/edit)
export const getHRById = async (req, res) => {
  try {
    const hr = await User.findById(req.params.id).select("-password");
    if (!hr) return res.status(404).json({ success: false, message: "HR not found" });
    res.json({ success: true, hr });
  } catch (error) {
    console.error("Get HR Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE HR
export const updateHR = async (req, res) => {
  try {
    const hr = await User.findById(req.params.id);
    if (!hr) return res.status(404).json({ success: false, message: "HR not found" });

    const { name, email, department, designation, contact } = req.body;
    hr.name = name || hr.name;
    hr.email = email || hr.email;
    hr.department = department || hr.department;
    hr.designation = designation || hr.designation;
    hr.contact = contact || hr.contact;

    await hr.save();
    res.json({ success: true, hr });
  } catch (error) {
    console.error("Update HR Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};