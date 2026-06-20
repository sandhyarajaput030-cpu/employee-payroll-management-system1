import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const EmployeeNotices = () => {
  const [notices, setNotices] = useState([]);

  const token = localStorage.getItem("token");

  const fetchNotices = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/notices",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotices(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📢 Company Notices</h2>

      <div style={styles.grid}>
        {notices.length === 0 ? (
          <p>No notices available</p>
        ) : (
          notices.map((n) => (
            <div key={n._id} style={styles.card}>
              <h3>{n.title}</h3>
              <p>{n.message}</p>

              <div style={styles.footer}>
                <span>👤 {n.role?.toUpperCase() || "HR"}</span>
                <span>
                   {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
               </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
  padding: "20px",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e8f3f2fe, #eddcca)"
},

  heading: {
    marginBottom: "20px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
    gap: "20px"
  },

  card: {
    background: "linear-gradient(135deg,#00c6ff,#0072ff)",
    color: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    transition: "0.3s",
    cursor: "pointer"
  },

  footer: {
    marginTop: "10px",
    fontSize: "12px",
    opacity: 0.8,
    display: "flex",
    justifyContent: "space-between"
  }
};

export default EmployeeNotices;