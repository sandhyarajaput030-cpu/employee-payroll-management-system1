import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaMoneyBill, FaCalendarCheck, FaSignOutAlt } from "react-icons/fa";

const HrNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>HR Panel</h2>

      <ul style={styles.menu}>
        <li><Link to="/hr-dashboard">Dashboard</Link></li>
        <li><Link to="/hr/employees">Employees</Link></li>
        <li><Link to="/hr/attendance">Attendance</Link></li>
        <li><Link to="payroll/view-slips">View Payslips</Link></li>
    <li><Link to="payroll/salary-prediction">Salary Prediction</Link></li>
      </ul>

      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    background: "#2c3e50",
    color: "#fff",
    padding: "20px"
  },
  logo: {
    marginBottom: "30px"
  },
  menu: {
    listStyle: "none",
    padding: 0,
    lineHeight: "2.5"
  },
  logout: {
    marginTop: "30px",
    padding: "10px",
    width: "100%",
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  }
};

export default HrNavbar;