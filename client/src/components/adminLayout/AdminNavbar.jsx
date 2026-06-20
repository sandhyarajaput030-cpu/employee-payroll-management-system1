import React from "react";

const AdminNavbar = ({ sidebarOpen }) => {
  return (
    <div style={{
      ...styles.sidebar,
      left: sidebarOpen ? "0" : "-220px"
    }}>

      <h3 style={{ textAlign: "center" }}>Admin Panel</h3>

      <p style={styles.item}>🏠 Dashboard</p>
      <p style={styles.item}>👨‍💼 Employees</p>
      <p style={styles.item}>💰 Payroll</p>
      <p style={styles.item}>📅 Attendance</p>
      <p style={styles.item}>📊 Notice-board</p>

    </div>
  );
};

export default AdminNavbar;

const styles = {
  sidebar: {
    position: "fixed",
    top: "0",
    bottom: "0",
    width: "220px",
    background: "#1e1e2f",
    color: "white",
    padding: "20px",
    transition: "0.3s"
  },
  item: {
    padding: "12px",
    margin: "10px 0",
    cursor: "pointer",
    borderRadius: "8px"
  }
};