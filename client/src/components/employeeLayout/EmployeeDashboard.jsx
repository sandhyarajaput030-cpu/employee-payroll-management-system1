import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaMoneyBillWave,
  FaFileAlt,
  FaClipboardList,
  FaChartLine
} from "react-icons/fa";

const EmployeeDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [todayRecord, setTodayRecord] = useState(null);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayRecord = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/attendance/today", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTodayRecord(response.data);
      } catch (error) {
        console.error("Error fetching today's record:", error);
      }
    };

    if (token) {
      fetchTodayRecord();
    }
  }, [token]);

  const handleCheckIn = async () => {
  try {
    await axios.post("http://localhost:8000/api/attendance/check-in", {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.location.reload();
  } catch (err) {
    alert("Check-in failed");
  }
};

const handleCheckOut = async () => {
  try {
    await axios.post("http://localhost:8000/api/attendance/check-out", {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.location.reload();
  } catch (err) {
    alert("Check-out failed");
  }
};

  return (
    <div>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>Welcome back, {user?.name} 👋</h2>
        <p>Your attendance & activity overview</p>
      </div>

      {/* CARDS */}
      <div style={styles.cards}>
        <div style={{ ...styles.card, background: "#4CAF50" }}>
          <FaCalendarCheck size={25} />
          <h4>Attendance</h4>
          <p>Overview</p>
        </div>

        <div style={{ ...styles.card, background: "#ff6b81" }}>
          <FaMoneyBillWave size={25} />
          <h4>Payroll</h4>
          <p>Salary Info</p>
        </div>

        <div style={{ ...styles.card, background: "#ff9f1a" }}>
          <FaFileAlt size={25} />
          <h4>Payslips</h4>
          <p>Monthly Records</p>
        </div>

        <div style={{ ...styles.card, background: "#1dd1a1" }}>
          <FaClipboardList size={25} />
          <h4>Leave Request</h4>
          <p>Apply Leave</p>
        </div>

        <div style={{ ...styles.card, background: "#5f27cd" }}>
          <FaChartLine size={25} />
          <h4>Notice-board</h4>
          <p>Performance</p>
        </div>
      </div>

      {/* SUMMARY */}
      <div style={styles.box}>
        <h3>Today’s Summary</h3>
        <div style={styles.summary}>
          <span>
  🕒 Check-in: {todayRecord?.checkIn
    ? new Date(todayRecord.checkIn).toLocaleTimeString()
    : "--"}
</span>

<span>
  🕒 Check-out: {todayRecord?.checkOut
    ? new Date(todayRecord.checkOut).toLocaleTimeString()
    : "--"}
</span>

<span>
  📌 Status: {todayRecord?.status || "Not Marked"}
</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div style={styles.box}>
        <h3>Quick Actions</h3>
        <div style={styles.actions}>
         {!todayRecord?.checkIn && (
  <button style={styles.btn} onClick={handleCheckIn}>
    Check In
  </button>
)}

{todayRecord?.checkIn && !todayRecord?.checkOut && (
  <button style={styles.btnDanger} onClick={handleCheckOut}>
    Check Out
  </button>
)}
          <button 
          style={styles.btn}
          onClick={() => navigate("payslips")}
   >
            View Payslip
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    color: "white",
    marginBottom: "20px"
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
    gap: "15px",
    marginBottom: "25px"
  },

  card: {
    padding: "20px",
    borderRadius: "15px",
    color: "white",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
  },

  box: {
    background: "rgba(255,255,255,0.95)",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "20px"
  },

  summary: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: "10px"
  },

  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  btn: {
    background: "#667eea",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px"
  },

  btnDanger: {
    background: "#e74c3c",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px"
  }
};

export default EmployeeDashboard;