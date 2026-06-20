import React, { useEffect, useState, useRef } from "react";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";

const AdminHeader = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("/api/notifications", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setNotifications(data.notifications || []);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const unread = notifications.filter((n) => !n.isRead).length;

  const markReadAndGo = async (n) => {
    try {
      if (!n.isRead) await fetch(`/api/notifications/${n._id}/read`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
      if (n.link) window.location.href = n.link;
      setNotifications((prev) => prev.map(x => x._id === n._id ? { ...x, isRead: true } : x));
    } catch (err) {}
  };

  return (
    <div style={styles.header}>
      {/* LEFT SECTION */}
      <div style={styles.left}>
        <FaBars style={styles.icon} />
        <h2 style={styles.title}>Admin Dashboard</h2>
      </div>

      {/* RIGHT SECTION */}
      <div style={styles.right} ref={ref}>
        <div style={{ position: 'relative' }}>
          <FaBell style={styles.icon} onClick={() => setOpen((o) => !o)} />
          {unread > 0 && <span style={styles.badge}>{unread}</span>}

          {open && (
            <div style={styles.dropdown}>
              {notifications.length === 0 && <div style={styles.item}>No notifications</div>}
              {notifications.map((n) => (
                <div key={n._id} style={styles.item} onClick={() => markReadAndGo(n)}>
                  <div style={{ fontSize: 13 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>{new Date(n.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.profile}>
          <FaUserCircle style={{ fontSize: "28px" }} />
          <span style={{ marginLeft: "8px" }}>Admin</span>
        </div>

        <button style={styles.logoutBtn}>Logout</button>
      </div>

    </div>
  );
};

const styles = {
  header: {
    width: "100%",
    height: "70px",
    background: "linear-gradient(90deg, #1e3c72, #2a5298)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 25px",
    color: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  title: {
    fontSize: "22px",
    fontWeight: "bold",
  },

  icon: {
    fontSize: "20px",
    cursor: "pointer",
  },

  profile: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    background: "rgba(255,255,255,0.1)",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  logoutBtn: {
    background: "#ff4d4d",
    border: "none",
    color: "white",
    padding: "8px 14px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    background: '#ff4d4d',
    color: 'white',
    borderRadius: 12,
    padding: '2px 6px',
    fontSize: 11
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 28,
    width: 320,
    maxHeight: 360,
    overflowY: 'auto',
    background: '#fff',
    color: '#000',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    borderRadius: 6,
    zIndex: 2000
  },
  item: {
    padding: 12,
    borderBottom: '1px solid #eee',
    cursor: 'pointer'
  }
};

export default AdminHeader;