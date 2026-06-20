import React from "react";
import { Outlet } from "react-router-dom";
import EmployeeNavbar from "./EmployeeNavbar";
import EmployeeFooter from "./EmployeeFooter";

const EmployeeLayout = () => {
  return (
    <div style={styles.container}>
      <EmployeeNavbar />

      <div style={styles.content}>
        <Outlet />
      </div>

      <EmployeeFooter />
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #667eea, #764ba2)"
  },

  content: {
    flex: 1,
    padding: "20px"
  }
};

export default EmployeeLayout;