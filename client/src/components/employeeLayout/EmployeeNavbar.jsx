import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBell, FaSignOutAlt } from "react-icons/fa";

const EmployeeNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const menu = [
    { name: "Dashboard", path: "/employee-dashboard" },
    { name: "Attendance", path: "/employee-dashboard/attendance" },
    
    { name: "Payslips", path: "/employee-dashboard/payslips" },
    { name: "Leave Request", path: "/employee-dashboard/leave" },
    { name: "Notice-Board", path: "/employee-dashboard/notice-board" }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
     <div style={styles.logoContainer}>
  <img 
    src="https://t4.ftcdn.net/jpg/07/26/62/01/360_F_726620104_rVnIAnJjMSZGW2fU8qKJZvttIYKzNRYJ.jpg"
    alt="logo"
    style={styles.logoImg}
    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
  />
  <h2 style={styles.logoText}>Employee Records</h2>
</div>

      <div style={styles.menu}>
        {menu.map((item) => (
          <span
            key={item.name}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.menuItem,
              background:
                location.pathname === item.path
                  ? "rgba(136, 150, 154, 0.68)"
                  : "transparent"
            }}
          >
            {item.name}
          </span>
        ))}
      </div>

      <div style={styles.right}>
        {/* 🔔 Notifications */}
        <div style={styles.iconWrapper}>
          <FaBell
            size={18}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            style={{ cursor: "pointer" }}
          />

          {showNotifications && (
            <div style={styles.dropdown}>
              <p>No new notifications</p>
            </div>
          )}
        </div>

        {/* 👤 Profile */}
        <div style={styles.iconWrapper}>
          <div
            style={styles.profile}
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            <img
  src={
    user?.profileImage ||
    "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAyL2stczMzLWljZS01OTMyMy1qb2IxMy1sLWpvYjE3NDZfMS5wbmc.png"
  }
  alt="profile"
  onClick={() => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  }}
  style={{
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
    cursor: "pointer",
    border: "2px solid white"
  }}
/>
            <span>{user?.name || "Employee"}</span>
          </div>

          {showProfile && (
  <div style={styles.dropdown}>
    
    {/* 👤 PROFILE CLICK */}
    <div
      style={styles.dropdownItem}
      onClick={() => {
        navigate("/employee-dashboard/profile");
        setShowProfile(false);
      }}
    >
      👤 My Profile
    </div>

    <div style={styles.dropdownDivider}></div>

    <div style={styles.dropdownItem}>
      {user?.name}
    </div>

    <button style={styles.logoutBtn} onClick={handleLogout}>
      <FaSignOutAlt /> Logout
    </button>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 25px",
  color: "white",

  // ✅ NEW PROFESSIONAL GRADIENT
  background: "linear-gradient(135deg, #18191b, #202732)",

  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  borderBottom: "1px solid rgba(255,255,255,0.1)"
},

  logo: { fontSize: "20px", fontWeight: "bold" },

  menu: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap"
  },

  menuItem: {
    padding: "8px 12px",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "0.3s"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    position: "relative"
  },

  iconWrapper: { position: "relative" },

  profile: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer"
  },

  dropdown: {
    position: "absolute",
    top: "40px",
    right: 0,
    background: "white",
    color: "#333",
    padding: "12px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    minWidth: "160px"
  },

  logoutBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "8px",
    border: "none",
    background: "#f44336",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer"
  },
logoContainer: {
  display: "flex",
  alignItems: "center",
  gap: "10px"
},

logoImg: {
  width: "50px",
  height: "50px",
  objectFit: "cover",     
  borderRadius: "50%",    // ✅ makes it perfectly round
  transition: "transform 0.3s ease",
  cursor: "pointer",
  border: "2px solid #364344",   // optional nice border
},

logoText: {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#00e5ff"
},

dropdownItem: {
  padding: "8px",
  cursor: "pointer",
  borderRadius: "5px"
},

dropdownDivider: {
  height: "1px",
  background: "#eee",
  margin: "5px 0"
},
};

export default EmployeeNavbar;