import User from "../models/User.js";

// ✅ GET PROFILE (logged-in user)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// ✅ UPDATE PROFILE (Admin + HR only)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 Allow only Admin & HR
    if (user.role !== "admin" && user.role !== "hr") {
      return res.status(403).json({ message: "Not allowed" });
    }

    // ✅ Update fields
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.department = req.body.department || user.department;
    user.designation = req.body.designation || user.designation;

    // ✅ Profile Image (IMPORTANT)
    if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
};