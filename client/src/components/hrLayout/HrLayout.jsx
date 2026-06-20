import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUserCircle,
  FaBell,
  FaTachometerAlt,
  FaUsers,
  FaCalendarCheck,
  FaFileAlt,
  FaSignOutAlt,
  FaTimes,
  FaMoneyBillWave,
  FaClipboardList
} from "react-icons/fa";
import HrFooter from "./HrFooter"; // you can reuse

const HrLayout = () => {
  const [open, setOpen] = useState(true);
  const [dropdown, setDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState({});

  const toggleItem = (label) => {
  setMenuOpen(prev => ({
    ...prev,
    [label]: !prev[label]
  }));
};

  const [notifications] = useState([]);

  // ✅ Responsive
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      setOpen(window.innerWidth > 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Auth Check (HR ONLY)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) return navigate("/login");

    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.role !== "hr") {
        return navigate("/login");
      }
      setUser(parsed);
    }
  }, [navigate]);

  // ✅ HR MENU
  const menuItems = [
    {
      path: "/hr-dashboard",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
      color: "linear-gradient(135deg, #667eea, #764ba2)"
    },
    {
      path: "/hr-dashboard/employees",
      icon: <FaUsers />,
      label: "Employees",
      color: "linear-gradient(135deg, #059669, #10b981)"
    },
    {
      path: "/hr-dashboard/attendance",
      icon: <FaCalendarCheck />,
      label: "Attendance",
      color: "linear-gradient(135deg, #9cdb27, #4b5a0f)"
    },

    {
  label: "Payroll",
  icon: <FaMoneyBillWave size={20} />,
  color: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
  textColor: "white",
  children: [
    { path: "/hr-dashboard/payroll/generate-slips", label: "Generate Payslips" },
    { path: "/hr-dashboard/payroll/view-slips", label: "View Payslips" },
    { path: "/hr-dashboard/payroll/salary-prediction", label: "Salary Prediction" }
  ]
},

{
    path: "/hr-dashboard/leaves",
    icon: <FaFileAlt />,
    label: "Leave Dashboard",
    color: "linear-gradient(135deg, #c7a004, #f59e0b)"
  },

  {
  path: "/hr-dashboard/notice-board",
  icon: <FaClipboardList size={20} />,
  label: "Notice Board",
  color: "linear-gradient(135deg, #ed3a67 0%, #8b5cf6 100%)",
  textColor: "white"
}
   
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => setOpen(!open);

  return (
    <div style={styles.container}>
      {/* ===== SIDEBAR ===== */}
      <div style={{
        ...styles.sidebar,
        width: open ? "260px" : "80px",
        transform: isMobile && !open ? "translateX(-100%)" : "translateX(0)"
      }}>
        {isMobile && open && (
          <button style={styles.mobileCloseBtn} onClick={toggleSidebar}>
            <FaTimes />
          </button>
        )}

        <div style={styles.logoContainer}>
          <h2 style={styles.logo}>{open ? "HR Panel" : "HR"}</h2>
        </div>

        <nav style={styles.nav}>
  {menuItems.map((item) => (
    <div key={item.label}>
      
      {/* MAIN MENU */}
      <div
        style={{ ...styles.menuBox, background: item.color }}
        onClick={() => {
          if (item.children) {
            toggleItem(item.label);
          } else {
            navigate(item.path);
          }
        }}
      >
        {item.icon}
        {open && <span>{item.label}</span>}
      </div>

      {/* SUBMENU */}
      {open && item.children && menuOpen[item.label] && (
        <div style={{ paddingLeft: "15px" }}>
          {item.children.map(child => (
            <div
              key={child.path}
              style={{
                padding: "10px",
                marginBottom: "5px",
                background: "#1f2937",
                borderRadius: "8px",
                cursor: "pointer"
              }}
              onClick={() => navigate(child.path)}
            >
              {child.label}
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
</nav>

        <div style={styles.userSection}>
          {open && (
            <div style={styles.userInfo}>
              <FaUserCircle size={35} />
              <div>
                <p>{user?.name}</p>
                <small>HR Manager</small>
              </div>
            </div>
          )}

          <div style={styles.logoutBox} onClick={handleLogout}>
            <FaSignOutAlt />
            {open && <span>Logout</span>}
          </div>
        </div>
      </div>

      {/* ===== MAIN ===== */}
      <div style={{
        ...styles.main,
        marginLeft: (!isMobile && open) ? "260px" : "80px"
      }}>
        {/* HEADER */}
       <div style={styles.header}>
  <div style={styles.leftHeader}>
    <FaBars size={22} onClick={toggleSidebar} style={{ cursor: "pointer", color: "white" }} />
    <div>
      <h3 style={styles.title}>HR Dashboard</h3>
      <p style={styles.subtitle}>Welcome back, {user?.name || "HR"}!</p>
    </div>
  </div>

  <div style={styles.rightHeader}>
    
   
    {/* 🔔 Notifications */}
<div style={{ position: "relative" }}>
  <FaBell
    style={styles.icon}
    onClick={() => setShowNotifications(!showNotifications)}
  />

  {notifications.length > 0 && (
    <span style={styles.notificationBadge}>
      {notifications.length}
    </span>
  )}

  {showNotifications && (
    <div style={styles.notificationDropdown}>
      <h4 style={{ padding: "10px", margin: 0 }}>Notifications</h4>

      {notifications.length > 0 ? (
        notifications.map((n) => (
          <div key={n.id} style={styles.notificationItem}>
            <p>{n.text}</p>
            <small>{n.time}</small>
          </div>
        ))
      ) : (
        <p style={{ padding: "10px" }}>No notifications</p>
      )}
    </div>
  )}
</div>

    {/* 👤 Profile */}
   <div style={{ position: "relative" }}>
  <img
    src={
      user?.profileImage ||
      "https://www.shutterstock.com/image-photo/cheerful-indian-professional-businessman-holds-260nw-2438673023.jpg"
    }
    alt="profile"
    onClick={() => setDropdown(!dropdown)}
    style={{
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      objectFit: "cover",
      cursor: "pointer",
      border: "2px solid white"
    }}
  />

  {dropdown && (
    <div style={styles.dropdown}>
      <div style={styles.dropdownHeader}>
        <img
          src={
            user?.profileImage ||
            "https://www.shutterstock.com/image-photo/cheerful-indian-professional-businessman-holds-260nw-2438673023.jpg"
          }
          alt="profile"
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />

        <div>
          <p style={{ margin: 0 }}>{user?.name}</p>
          <small>{user?.email}</small>
        </div>
      </div>

      <hr />

      <div
        onClick={() => navigate("/hr-dashboard/profile")}
        style={styles.dropdownItem}
      >
        👤 My Profile
      </div>

      <div onClick={handleLogout} style={styles.dropdownItem}>
        🚪 Logout
      </div>
    </div>
  )}
</div>

  </div>
</div>

        {/* CONTENT */}
        <div style={styles.content}>
          <Outlet />
        </div>

        <HrFooter />
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex" },
  sidebar: {
    background: "#111827",
    color: "white",
    height: "100vh",
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    transition: "0.3s"
  },
  logoContainer: { padding: "20px" },
  logo: { fontSize: "20px" },
  nav: { flex: 1, padding: "10px" },
  menuBox: {
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    gap: "10px"
  },
  userSection: { padding: "20px" },
  userInfo: { display: "flex", gap: "10px" },
  logoutBox: {
    marginTop: "15px",
    background: "#dc2626",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    display: "flex",
    gap: "10px"
  },
  main: { flex: 1, marginLeft: "260px" },
  header: {
    padding: "15px",
    background: "#667eea",
    display: "flex",
    justifyContent: "space-between"
  },
  content: { padding: "20px" },
  /* dropdown (removed duplicate) */

  title: {
  fontSize: "20px",
  color: "white",
  margin: 0
},

subtitle: {
  fontSize: "12px",
  color: "white",
  opacity: 0.8,
  margin: 0
},

rightHeader: {
  display: "flex",
  alignItems: "center",
  gap: "20px"
},

icon: {
  fontSize: "20px",
  color: "white",
  cursor: "pointer"
},

profileImage: {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  cursor: "pointer",
  border: "2px solid white"
},

notificationBadge: {
  position: "absolute",
  top: "-5px",
  right: "-5px",
  background: "red",
  color: "white",
  borderRadius: "50%",
  fontSize: "10px",
  width: "18px",
  height: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
},

notificationDropdown: {
  position: "absolute",
  top: "40px",
  right: "0",
  width: "250px",
  background: "white",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  zIndex: 1000
},

notificationItem: {
  padding: "10px",
  borderBottom: "1px solid #eee"
},

dropdown: {
  position: "absolute",
  top: "45px",
  right: "0",
  width: "250px",
  background: "white",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  zIndex: 1000
},

dropdownHeader: {
  display: "flex",
  gap: "10px",
  padding: "10px"
},

dropdownImg: {
  width: "40px",
  height: "40px",
  borderRadius: "50%"
},

dropdownItem: {
  padding: "10px",
  cursor: "pointer"
}
};

export default HrLayout;