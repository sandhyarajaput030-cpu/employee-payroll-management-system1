import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Notification from '../models/Notification.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// ✅ REGISTER USER (Admin, HR, Employee)
export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role, department, designation } = req.body;

    email = email.toLowerCase();

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Only one admin allowed
    if (role === 'admin') {
      const adminExists = await User.findOne({ role: 'admin' });
      if (adminExists) {
        return res.status(403).json({
          message: 'Registration Denied: An Admin already exists.'
        });
      }
    }

    // ❌ REMOVE THIS SECTION - DO NOT hash password manually
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Set default values for department/designation
    if (role === 'admin') {
      department = 'Management';
      designation = 'System Admin';
    } else {
      department = department || 'General';
      designation = designation || 'Staff';
    }

    // ✅ Create user WITHOUT manually hashing
    const user = await User.create({
      name,
      email,
      password, // ← Pass plain password, model will hash it
      role: role || 'employee',
      department,
      designation
    });

    // Create employee record for HR and Employee
    if (role === 'hr' || role === 'employee') {
      await Employee.create({
        userId: user._id,
        employeeId: `EMP${user._id.toString().slice(-6)}`,
        department: user.department,
        position: user.designation,
        joiningDate: new Date(),
        salary: {
          basic: role === 'hr' ? 60000 : 50000,
          allowances: 10000,
          deductions: 5000
        },
        isActive: true
      });
      console.log(`✅ Employee/HR record created for: ${user.name}`);
    }

    // 🔔 Notify admins and HR about new registration
    await Notification.create({
      message: `New user registered: ${user.name}`,
      type: 'USER_REGISTERED',
      recipients: ['admin', 'hr'],
      link: '/admin/users'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ LOGIN USER (Admin, HR, Employee)
// ✅ FIXED LOGIN USER
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const user = await User.findOne({ email });

    console.log("User found:", user ? user.email : "No user"); // Debug
    console.log("Password from DB:", user ? "Exists" : "N/A"); // Debug

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await user.comparePassword(password);
    console.log("Password match:", isPasswordMatch); // Debug

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};
export default { registerUser, loginUser };