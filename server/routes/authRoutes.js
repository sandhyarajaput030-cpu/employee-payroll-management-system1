import express from "express";
const router = express.Router();

// ✅ Import controllers (Don't forget the .js extension!)
import { registerUser, loginUser } from "../controller/authController.js";
import User from "../models/User.js"; // ✅ ADD THIS LINE

// ✅ Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/fix-emails", async (req, res) => {
  try {
    const users = await User.find();

    for (let user of users) {
      user.email = user.email.toLowerCase();
      await user.save();
    }

    res.json({ message: "All emails converted to lowercase ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Modern Export
export default router;