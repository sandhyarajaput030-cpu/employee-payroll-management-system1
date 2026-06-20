import React from "react";

const EmployeeFooter = () => {
  return (
    <div style={styles.footer}>
      © 2026 Employee Payroll Management System | All Rights Reserved
    </div>
  );
};

const styles = {
  footer: {
    textAlign: "center",

    // ✅ MEDIUM SIZE
    padding: "22px 10px",

    // ✅ MATCHING BUT NOT SAME COLOR
    background: "linear-gradient(135deg, #0f1010, #101113)",

    color: "#e0e0e0",
    fontSize: "15px",
    fontWeight: "500",
    letterSpacing: "0.5px",

    boxShadow: "0 -4px 15px rgba(0,0,0,0.2)"
  }
};

export default EmployeeFooter;