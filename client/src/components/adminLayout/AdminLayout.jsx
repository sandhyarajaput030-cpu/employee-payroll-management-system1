import React, { useState, useEffect } from "react";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUserCircle,
  FaBell,
  FaTachometerAlt,
  FaUsers,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaChartBar,
  FaSignOutAlt,
  FaTimes,
  FaClipboardList // ✅ Leave Requests      // ✅ Payslips
} from "react-icons/fa";
import AdminFooter from "./AdminFooter";

const AdminLayout = () => {
  const [open, setOpen] = useState(true);
  const [dropdown, setDropdown] = useState(false);
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [menuOpen, setMenuOpen] = useState({});
const toggleItem = (label) => {
  setMenuOpen(prev => ({ ...prev, [label]: !prev[label] }));
};

  const navigate = useNavigate();

  // ✅ Check responsive
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ Check authentication on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
    
   if (!storedToken) {
    navigate("/login");
    return;
  }

  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);

      if (parsedUser.role !== "admin") {
        navigate("/login");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }
}, [navigate]);

  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return;

      const res = await axios.get("/api/notifications", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error.message || error);
    }
  };

  fetchNotifications();
}, [token]);

  // ✅ Menu items with PERMANENT colors
 const menuItems = [
  {
    path: "/admin-dashboard",
    icon: <FaTachometerAlt size={20} />,
    label: "Dashboard",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "white"
  },
  {
    path: "/admin-dashboard/employees",
    icon: <FaUsers size={20} />,
    label: "Employees",
    color: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    textColor: "white"
  },
  {
    path: "/admin-dashboard/hr-managers",
    icon: <FaUserCircle size={20} />,
    label: "HR Managers",
    color: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)", // Blue gradient
    textColor: "white"
  },
  
  {
    path: "/admin-dashboard/attendance",
    icon: <FaCalendarCheck size={20} />,
    label: "Attendance",
    color: "linear-gradient(135deg, #db2777 0%, #ec4899 100%)",
    textColor: "white"
  },
   
  {
  label: "Payroll",
  icon: <FaMoneyBillWave size={20} />,
  color: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
  textColor: "white",
  children: [
    { path: "/admin-dashboard/payroll/view-slips", label: "View Payslips" },
    { path: "/admin-dashboard/payroll/salary-prediction", label: "Salary Prediction" },
    { path: "/admin-dashboard/payroll/approve-slips", label: "Approve Payslips" }
  ]
},

  {
    path: "/admin-dashboard/leaves",
    icon: <FaClipboardList size={20} />,
    label: "Leave Requests",
    color: "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)", // Yellow/Orange
    textColor: "white"
  },
  
  {
    path: "/admin-dashboard/notice-board",
    icon: <FaChartBar size={20} />,
    label: "Notice Board",
    color: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
    textColor: "white"
  }
];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const handleHover = (e, originalColor) => {
    e.currentTarget.style.transform = "translateX(8px) scale(1.02)";
    e.currentTarget.style.background = originalColor;
    const span = e.currentTarget.querySelector(".glow-span");
    if (span) span.style.left = "120%";
  };

  const handleLeave = (e, originalColor) => {
    e.currentTarget.style.transform = "translateX(0) scale(1)";
    e.currentTarget.style.background = originalColor;
    const span = e.currentTarget.querySelector(".glow-span");
    if (span) span.style.left = "-100%";
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setDropdown(false);
  };

  return (
    <div style={styles.container}>
      {/* ===== SIDEBAR ===== */}
      <div style={{ 
        ...styles.sidebar, 
        width: open ? "260px" : "80px",
        transform: isMobile && !open ? "translateX(-100%)" : "translateX(0)",
        transition: "all 0.3s ease"
      }}>
        {/* Mobile Close Button */}
        {isMobile && open && (
          <button style={styles.mobileCloseBtn} onClick={toggleSidebar}>
            <FaTimes />
          </button>
        )}
        
        <div style={styles.logoContainer}>
          <h2 style={styles.logo}>{open ? "PayNexa" : "PN"}</h2>
          {open && <p style={styles.logoSubtitle}>Payroll Management System</p>}
        </div>

        <nav style={styles.nav}>
          {menuItems.map(item => (
  <div key={item.label}>
    <div
      style={{
        ...styles.menuBox,
        background: item.color,
        color: item.textColor
      }}
    onClick={() => {
  if (item.children) {
    toggleItem(item.label);

    // ✅ OPTIONAL: also navigate to first page
    navigate(item.children[0].path);
  } else {
    navigate(item.path);
  }
}}
    >
      {item.icon}
      {open && <span style={styles.menuText}>{item.label}</span>}
    </div>

    {/* Submenu */}
    {open && item.children && menuOpen[item.label] && (
      <div style={styles.submenu}>
        {item.children.map(child => (
          <div
            key={child.path}
            style={styles.subItem}
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

        {/* User Info Section */}
        <div style={styles.userSection}>
  {open && (
    <div style={styles.userInfo}>
      <img
        src={user?.profileImage || "https://media.istockphoto.com/id/1056248538/photo/cheerful-attractive-adorable-stylish-beautiful-classic-trendy-business-lady-sitting-in-front.jpg?s=612x612&w=0&k=20&c=omRu2y707sqsHrzym27dyg0yQrO1Gl_AnNDR0tGec1c="} // fallback if no image
        alt={user?.name || "Admin User"}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid white"
        }}
      />
      <div style={styles.userDetails}>
        <p style={styles.userName}>{user?.name || "Admin User"}</p>
        <p style={styles.userRole}>{user?.role || "Administrator"}</p>
      </div>
    </div>
  )}
          
          {/* Logout Button */}
          <div
            style={styles.logoutBox}
            onClick={handleLogout}
            onMouseEnter={(e) => handleHover(e, "#dc2626")}
            onMouseLeave={(e) => handleLeave(e, "#dc2626")}
          >
            <FaSignOutAlt size={20} /> 
            {open && <span style={styles.menuText}>Logout</span>}
            <span className="glow-span" style={styles.glow}></span>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && open && (
        <div style={styles.overlay} onClick={toggleSidebar}></div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ 
        ...styles.main, 
        marginLeft: (!isMobile && open) ? "260px" : (isMobile ? "0" : "80px"),
        transition: "margin-left 0.3s ease"
      }}>
        {/* ===== HEADER - PURPLE BACKGROUND ===== */}
        <div style={styles.header}>
          <div style={styles.leftHeader}>
            <FaBars
              size={24}
              onClick={toggleSidebar}
              style={styles.menuIcon}
            />
            <div>
              <h3 style={styles.title}>Admin Dashboard</h3>
              <p style={styles.subtitle}>Welcome back, {user?.name || "Admin"}!</p>
            </div>
          </div>

          <div style={styles.rightHeader}>

            
            {/* Notifications */}
            <div style={{ position: "relative" }}>
              <FaBell
                style={styles.icon}
                onClick={toggleNotifications}
              />
              {notifications.length > 0 && (
                <span style={styles.notificationBadge}>{notifications.length}</span>
              )}
              
              {showNotifications && (
                <div style={styles.notificationDropdown}>
                  <div style={styles.notificationHeader}>
                    <h4>Notifications</h4>
                    <button 
                      onClick={async () => {
                        try {
                          const storedToken = localStorage.getItem('token');
                          if (!storedToken) return;
                          await axios.delete('/api/notifications/clear', { headers: { Authorization: `Bearer ${storedToken}` } });
                          setNotifications([]);
                        } catch (err) {
                          console.error('Error clearing notifications', err);
                        }
                      }}
                      style={styles.clearBtn}
                    >
                      Clear all
                    </button>
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div key={notif._id} style={styles.notificationItem}>
                        <p style={styles.notificationText}>{notif.message}</p>
                         <p style={styles.notificationTime}>
                         {new Date(notif.createdAt).toLocaleString()}
                          </p>
                      </div>
                    ))
                  ) : (
                    <div style={styles.noNotifications}>No new notifications</div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: "relative" }}>
              <img
  src={
    user?.profileImage ||
    "https://media.istockphoto.com/id/1056248538/photo/cheerful-attractive-adorable-stylish-beautiful-classic-trendy-business-lady-sitting-in-front.jpg"
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

             {dropdown && user && (
  <div style={styles.dropdown}>
    <div style={styles.dropdownHeader}>
      <img
        src={
          user?.profileImage ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
        alt="Admin"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          objectFit: "cover"
        }}
      />

      <div>
        <p style={styles.dropdownName}>{user?.name}</p>
        <p style={styles.dropdownEmail}>{user?.email}</p>
        <p style={{ fontSize: "11px", color: "#667eea" }}>
          {user?.role}
        </p>
      </div>
    </div>

    <div style={styles.dropdownDivider}></div>

    <div
      style={styles.dropdownItem}
      onClick={() => navigate("/admin-dashboard/profile")}
    >
      👤 View Profile
    </div>

    <div style={styles.dropdownDivider}></div>

    <div style={styles.dropdownItem} onClick={handleLogout}>
      🚪 Logout
    </div>
  </div>
)}

            </div>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        <div style={styles.content}>
          <Outlet />
        </div>

        {/* ===== FOOTER ===== */}
        <AdminFooter />
      </div>
    </div>
  );
};

/* ===== STYLES ===== */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    background: "#f5f7fb",
    position: "relative"
  },

  sidebar: {
    background: "linear-gradient(180deg, #1a1f2e 0%, #0f1119 100%)",
    color: "white",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    height: "100vh",
    overflowY: "auto",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    zIndex: 1000,
    left: 0,
    top: 0
  },

  mobileCloseBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "white",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px"
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 999,
    transition: "all 0.3s ease"
  },

 logoContainer: {
  padding: "2px 20px", // reduce top and bottom padding
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  marginBottom: "10px" // reduce space between logo and first menu box
},

  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "5px"
  },

  logoSubtitle: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.6)",
    marginTop: "5px"
  },

  nav: {
    flex: 1,
    padding: "0 15px"
  },

  menuBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    marginBottom: "8px",
    fontWeight: "500",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
  },

  menuText: {
    fontSize: "14px",
    fontWeight: "500"
  },

  glow: {
    position: "absolute",
    top: "0",
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "rgba(255,255,255,0.3)",
    transform: "skewX(-25deg)",
    transition: "0.5s"
  },

  userSection: {
    padding: "20px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    marginTop: "auto"
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    padding: "10px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)"
  },

  userAvatar: {
    color: "white"
  },

  userDetails: {
    flex: 1
  },

  userName: {
    fontSize: "14px",
    fontWeight: "600",
    margin: 0
  },

  userRole: {
    fontSize: "11px",
    opacity: 0.7,
    margin: "5px 0 0 0"
  },

  logoutBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    color: "white",
    background: "#dc2626",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(220,38,38,0.3)"
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    transition: "margin-left 0.3s ease",
    width: "100%"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 30px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    position: "relative",
    top: 0,
    zIndex: 998
  },

  leftHeader: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },

  menuIcon: {
    cursor: "pointer",
    color: "white",
    transition: "color 0.3s ease"
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#000000",
    margin: 0
  },

  subtitle: {
    fontSize: "14px",
    color: "#000000",
    margin: "5px 0 0 0",
    opacity: 0.9
  },

  rightHeader: {
    display: "flex",
    alignItems: "center",
    gap: "25px"
  },

  icon: {
    fontSize: "20px",
    cursor: "pointer",
    color: "white",
    transition: "color 0.3s ease"
  },

  profileIcon: {
    fontSize: "32px",
    cursor: "pointer",
    color: "white",
    transition: "color 0.3s ease"
  },

  notificationBadge: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "#ef4444",
    color: "white",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    fontSize: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold"
  },

  notificationDropdown: {
    position: "absolute",
    top: "40px",
    right: "0",
    width: "300px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    overflow: "hidden",
    zIndex: 1000
  },

  notificationHeader: {
    padding: "15px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  clearBtn: {
    background: "none",
    border: "none",
    color: "#667eea",
    cursor: "pointer",
    fontSize: "12px"
  },

  notificationItem: {
    padding: "12px 15px",
    borderBottom: "1px solid #f3f4f6",
    cursor: "pointer",
    transition: "background 0.3s ease"
  },

  notificationText: {
    fontSize: "13px",
    margin: 0,
    color: "#374151"
  },

  notificationTime: {
    fontSize: "10px",
    color: "#9ca3af",
    margin: "5px 0 0 0"
  },

  noNotifications: {
    padding: "30px",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "13px"
  },

  dropdown: {
    position: "absolute",
    top: "45px",
    right: "0",
    width: "280px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    overflow: "hidden",
    zIndex: 1000
  },

  dropdownHeader: {
    padding: "15px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#f9fafb"
  },

  dropdownName: {
    fontSize: "14px",
    fontWeight: "600",
    margin: 0,
    color: "#1f2937"
  },

  dropdownEmail: {
    fontSize: "11px",
    margin: "5px 0 0 0",
    color: "#6b7280"
  },

  dropdownDivider: {
    height: "1px",
    background: "#e5e7eb"
  },

  dropdownItem: {
    padding: "12px 15px",
    cursor: "pointer",
    transition: "background 0.3s ease",
    fontSize: "13px",
    color: "#374151"
  },

  content: {
    flex: 1,
    padding: "30px",
    background: "#f5f7fb"
  },

  submenu: {
  paddingLeft: "15px",
},

subItem: {
  padding: "10px",
  margin: "5px 0",
  borderRadius: "8px",
  background: "#2a2a40",
  cursor: "pointer",
  fontSize: "13px"
},

profileCard: {
  display: "flex",
  alignItems: "center",
  gap: "12px"
}
};

export default AdminLayout;