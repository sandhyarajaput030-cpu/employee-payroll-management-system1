import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";

// Load environment variables FIRST
dotenv.config();

// Routes
import authRoutes from "./routes/authRoutes.js"; 
import employeeRoutes from "./routes/employeeRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";

import profileRoutes from "./routes/profileRoutes.js";

import notificationRoutes from "./routes/notificationRoutes.js";


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);  // ✅ Keep as is
app.use("/api/payroll", payrollRoutes);     // ✅ Changed from /payrolls to /payroll for consistency
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/hr", hrRoutes);

app.use("/api/leave", leaveRoutes);
app.use("/api/notices", noticeRoutes);

app.use("/api/users", profileRoutes);
app.use("/api/notifications", notificationRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Error handling middleware (catch all)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Port & DB URL
const PORT = process.env.PORT || 8000;
const URL = process.env.MONGOURL;

// DB Connection
mongoose.connect(URL)
  .then(() => {
    console.log("DB connected successfully ✅");
    app.listen(PORT, () => {
      console.log(`Server is running on Port: ${PORT} 🚀`);
    });
  })
  .catch((error) => console.log(error));