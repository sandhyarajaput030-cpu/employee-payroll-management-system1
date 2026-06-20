import React from "react";
import { useNavigate } from "react-router-dom";

const GuestHeader = () => {
  const navigate = useNavigate();

  // 🔗 LOGO LINK (CHANGE THIS ANYTIME)
  const logoUrl = "https://www.helixtahr.com/wp-content/themes/helixta-theme/assets/images/payroll/payroll-hero-header-image.png";

  return (
    <div>

      {/* 🔥 BIG TOP BAR */}
      <div style={{
        textAlign: "center",
        background: "linear-gradient(90deg,#ff9800,#ff5722)",
        padding: "10px",
        color: "#fff",
        fontSize: "18px",
        fontWeight: "600",
        letterSpacing: "1px"
      }}>
        Employee Management System
      </div>

      {/* NAVBAR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 60px",
        background: "rgba(36, 31, 31, 0.92)",
        backdropFilter: "blur(10px)",
        color: "#fff"
      }}>

        {/* 🔥 LOGO SECTION */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            transition: "0.3s"
          }}
        >

          {/* LOGO IMAGE */}
          <img
            src={logoUrl}
            alt="PayNexa Logo"
            style={{
              height: "50px",
              width: "60px",
              borderRadius: "40%",
              objectFit: "contain",
              transition: "0.3s"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          />

          {/* TEXT LOGO */}
          <span style={{ fontSize: "26px", fontWeight: "bold" }}>
            <span style={{ color: "#1099e8" }}>Pay</span>
            <span style={{ color: "#f52121", marginLeft: "2px" }}>
              Nexa
            </span>
          </span>

        </div>

        {/* MENU */}
        <div style={{ display: "flex", gap: "30px" }}>
          {["Home", "About", "Services", "Register", "Login"].map((item) => (
            <span
              key={item}
              onClick={() =>
                navigate(item === "Home" ? "/" : `/${item.toLowerCase()}`)
              }
              style={{
                cursor: "pointer",
                position: "relative",
                paddingBottom: "5px",
                fontSize: "16px"
              }}
              onMouseOver={(e) => {
                e.target.style.borderBottom = "2px solid #00e5ff";
              }}
              onMouseOut={(e) => {
                e.target.style.borderBottom = "none";
              }}
            >
              {item}
            </span>
          ))}
        </div>

      </div>

    </div>
  );
};

export default GuestHeader;