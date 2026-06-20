import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true, 
    unique: true,
    lowercase: true
  },

  contact: {
  type: String,
  default: ""
},

  password: {
    type: String, 
    required: true 
  },
  role: {
    type: String, 
    enum: ["admin", "hr", "employee"], 
    default: "employee" 
  },
  department: { 
    type: String, 
    default: "General"
  },
  designation: {
    type: String, 
    default: "Staff"
  },

  profileImage: {
  type: String,
  default: ""
},

  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// ✅ Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ✅ Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;