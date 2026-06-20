import React, { useEffect, useState, useRef } from "react";
import { FaBell } from "react-icons/fa";

const EmployeeHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => data.success && setNotifications(data.notifications || []))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  const unread = notifications.filter(n => !n.isRead).length;

  const markReadAndGo = async (n) => {
    try {
      if (!n.isRead) await fetch(`/api/notifications/${n._id}/read`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
      if (n.link) window.location.href = n.link;
      setNotifications(prev => prev.map(x => x._id === n._id ? { ...x, isRead: true } : x));
    } catch (err) {}
  };

  return (
    <div style={styles.header}>
      <div>
        <h1>Employee Dashboard</h1>
        <p>Welcome back, {user?.name || "Employee"} 👋</p>
      </div>

      <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <FaBell style={{ cursor: 'pointer', color: 'white' }} onClick={() => setOpen(o => !o)} />
          {unread > 0 && <span style={styles.badge}>{unread}</span>}
          {open && (
            <div style={styles.dropdown}>
              {notifications.length === 0 && <div style={styles.item}>No notifications</div>}
              {notifications.map(n => (
                <div key={n._id} style={styles.item} onClick={() => markReadAndGo(n)}>
                  <div style={{ fontSize: 13 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>{new Date(n.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeHeader;

const styles = {
  header: {
    padding: "30px",
    borderRadius: "15px",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    color: "white",
    marginBottom: "25px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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