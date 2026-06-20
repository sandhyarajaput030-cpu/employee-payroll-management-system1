import React from "react";
import { useNavigate } from "react-router-dom";

const GuestNavbar = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        style={{
          fontSize: "26px",
          fontWeight: "bold",
          color: "#fff",
          cursor: "pointer",
          transition: "0.3s"
        }}
        onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
      >
        💼 PayNexa
      </div>

      {/* Menu */}
      <div style={{ display: "flex", gap: "30px" }}>
        {["Home", "Login", "Register"].map((item) => (
          <span
            key={item}
            onClick={() =>
              navigate(item === "Home" ? "/" : `/${item.toLowerCase()}`)
            }
            style={{
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              transition: "0.3s"
            }}
            onMouseOver={(e) => e.target.style.color = "#ffd369"}
            onMouseOut={(e) => e.target.style.color = "#fff"}
          >

            
            {item}
          </span>
        ))}
      </div>

    </div>
  );
};

export default GuestNavbar;