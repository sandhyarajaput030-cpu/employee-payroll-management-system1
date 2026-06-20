import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const AdminFooter = () => {
  return (
    <div style={styles.footer}>


      {/* SOCIAL ICONS */}
      <div style={styles.social}>
        <FaFacebook style={styles.icon} />
        <FaInstagram style={styles.icon} />
        <FaLinkedin style={styles.icon} />
        <FaGithub style={styles.icon} />
      </div>

      {/* BOTTOM TEXT */}
      <div style={styles.bottom}>
        © 2026 PayNexa Technologies | All Rights Reserved
      </div>

    </div>
  );
};

export default AdminFooter;

const styles = {
  footer: {
    background: "linear-gradient(90deg,#111827,#1f2937)",
    color: "white",
    padding: "30px 20px",   // 🔥 bigger height
    textAlign: "center",
     flexShrink: 0 
  },

  top: {
    marginBottom: "15px"
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold"
  },

  tagline: {
    fontSize: "14px",
    opacity: 0.8
  },

  social: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    margin: "15px 0"
  },

  icon: {
    fontSize: "20px",
    cursor: "pointer",
    transition: "0.3s"
  },

  bottom: {
    fontSize: "13px",
    opacity: 0.7
  }
};