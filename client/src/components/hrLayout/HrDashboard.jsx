import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaFileAlt,
  FaClipboardList 
} from "react-icons/fa";
// ResponsiveContainer removed to fix eslint unused import warning

const HrDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    employees: 0,
    payroll: 0,
    attendance: 0,
    payslips: 0,
    leaves: 0,
    noticeBoard: 0,
    chartData: []
  });

  // ✅ ADD THESE STATES
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:8000/api";

  const axiosConfig = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`
    }
  }), [token]);

  // ✅ Fetch Dashboard Data
  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard`, axiosConfig);

      console.log("API RESPONSE:", res.data);

      if (res.data.success) {
        setDashboardData(res.data.data);
        console.log("📊 Dashboard Data:", res.data.data);
      }

    } catch (err) {
      console.error("Dashboard error:", err);

      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [API_URL, axiosConfig, navigate]);

  // ✅ ADD THESE FUNCTIONS
  const fetchEmployees = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/employees`, axiosConfig);
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  }, [API_URL, axiosConfig]);

  const fetchAttendance = useCallback(async () => {
    try {
      const formattedDate = new Date().toLocaleDateString("en-CA");
      const res = await axios.get(`${API_URL}/attendance?date=${formattedDate}`, axiosConfig);
      // API may return either raw array or { success: true, data: [...] }
      setAttendanceData(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching attendance", err);
    }
  }, [API_URL, axiosConfig]);

 
  // ✅ UPDATED useEffect
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchDashboardData();
    fetchEmployees();     // ✅ ADDED
    fetchAttendance();    // ✅ ADDED

  }, [token, fetchDashboardData, fetchEmployees, fetchAttendance, navigate]);

  console.log("Employees:", employees);
 console.log("Attendance:", attendanceData);

  // ✅ ADD REAL ATTENDANCE CALCULATION 

// ✅ ATTENDANCE CALCULATION (CORRECT ORDER)

const today = new Date();
today.setHours(0, 0, 0, 0);

const todayAttendance = attendanceData.filter((a) => {
  const recordDate = new Date(a.date);
  recordDate.setHours(0, 0, 0, 0);
  return recordDate.getTime() === today.getTime();
});

const presentCount = todayAttendance.filter((a) => {
  const status = (a.status || "").toLowerCase().trim();
  if (status === "leave") return false;
  if (status === "present") return true;
  // If missing checkIn or checkOut, treat as Absent (match Attendance.jsx)
  if (!a.checkIn || !a.checkOut) return false;
  const hours = (new Date(a.checkOut) - new Date(a.checkIn)) / (1000 * 60 * 60);
  return hours >= 6; // match Attendance.jsx threshold for full day
}).length;

const totalEmployees = employees.length;

const attendancePercent = totalEmployees
  ? Math.round((presentCount / totalEmployees) * 100)
  : 0;

// Prefer server-provided dashboard value when available (keeps dashboards consistent)
// prefer server-provided value when available; use local calculation otherwise
// (we display `attendancePercent` below)

// ✅ DEBUG (AFTER declaration only)
console.log("Today Attendance:", todayAttendance);
console.log("Present Count:", presentCount);
console.log("Total Employees:", totalEmployees);


  // Hover effects
  const handleHover = (e) => {
    e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
    e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";
  };

  const handleLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>HR Dashboard</h2>

      <div style={styles.cardContainer}>
        
        <div
          style={{ ...styles.card, background: "linear-gradient(135deg,#4facfe,#00f2fe)" }}
          onClick={() => navigate("/hr-dashboard/employees")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <FaUsers size={30} />
          <h4>Total Employees</h4>
          <p style={styles.number}>{dashboardData.employees || 0}</p>
        </div>

        <div
          style={{ ...styles.card, background: "linear-gradient(135deg,#43e97b,#38f9d7)" }}
          onClick={() => navigate("/hr-dashboard/payroll/view-slips")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <FaMoneyBillWave size={30} />
          <h4>Total Payroll</h4>
          <p style={styles.number}>₹{dashboardData.payroll || 0}</p>
        </div>

        {/* ✅ FIXED ATTENDANCE HERE */}
        <div
          style={{ ...styles.card, background: "linear-gradient(135deg,#fa709a,#fee140)" }}
          onClick={() => navigate("/hr-dashboard/attendance")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <FaCalendarCheck size={30} />
          <h4>Attendance</h4>
          <p style={styles.number}>{attendancePercent}%</p>
        </div>

        <div
          style={{ ...styles.card, background: "linear-gradient(135deg,#00c6ff,#0072ff)" }}
          onClick={() => navigate("/hr-dashboard/payroll/salary-prediction")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <FaFileAlt size={30} />
          <h4>Salary Prediction</h4>
          <p style={styles.number}>{dashboardData.payslips || 0}</p>
        </div>


        <div
  style={{ ...styles.card, background: "linear-gradient(135deg,#f7971e,#ffd200)" }}
  onClick={() => navigate("/hr-dashboard/leaves")}
  onMouseEnter={handleHover}
  onMouseLeave={handleLeave}
>
  <FaClipboardList size={30} />
  <h4>Leave Requests</h4>
  <p style={styles.number}>{dashboardData.leaves || 0}</p>
</div>

        <div
  style={{ ...styles.card, background: "linear-gradient(135deg,#a18cd1,#fbc2eb)" }}
  onClick={() => navigate("/hr-dashboard/notice-board")}
  onMouseEnter={handleHover}
  onMouseLeave={handleLeave}
>
  <FaClipboardList size={30} />
  <h4>Notice Board</h4>
  <p style={styles.number}>{dashboardData.noticeBoard || 0}</p>
</div>
      </div>

      

      <div style={styles.box}>
        <h3>Quick Actions</h3>
        <div style={styles.actions}>
          <button style={styles.btn} onClick={() => navigate("/hr-dashboard/employees")}>
            ➕ Add Employee
          </button>
          <button style={styles.btn} onClick={() => navigate("/hr-dashboard/attendance")}>
            📅 Mark Attendance
          </button>
          <button style={styles.btn} onClick={() => navigate("//hr-dashboard/payroll/generate-slips")}>
            📄 Generate Payslip
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "10px" },
  heading: { marginBottom: "20px", fontSize: "22px" },

  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: "20px",
    marginBottom: "30px"
  },

  card: {
    padding: "20px",
    color: "white",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
  },

  number: { fontSize: "22px", fontWeight: "bold" },

  box: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
  },

  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  btn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    background: "#4facfe",
    color: "white",
    cursor: "pointer"
  }
};

export default HrDashboard;