import React from "react";

const Footer = () => {
  return (
    <div style={styles.footer}>
      <p>© 2026 Employee Payroll System</p>
    </div>
  );
};

const styles = {
 footer: {
    background: "linear-gradient(90deg,#111827,#1f2937)",
    color: "white",
    padding: "25px 20px",   // 🔥 bigger height
    textAlign: "center",
     flexShrink: 0 
  },
};

export default Footer;