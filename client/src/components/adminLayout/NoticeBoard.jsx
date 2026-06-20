import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const NoticeBoard = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notices, setNotices] = useState([]);

  const token = localStorage.getItem("token");

  const API = "http://localhost:8000/api/notices";

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ Fetch Notices
  const fetchNotices = useCallback(async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotices(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [API, token]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  // ✅ Create Notice
  const handleCreate = async () => {
    if (!title || !message) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(
        API,
        { title, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setMessage("");
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete Notice
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📢 Notice Board</h2>

      {/* Create Notice */}
      <div style={styles.card}>
        <h3>Create Notice</h3>

        <input
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.textarea}
        />

        <button style={styles.btn} onClick={handleCreate}>
          ➕ Post Notice
        </button>
      </div>

     {/* Notices List */}
<div style={styles.list}>
  {notices.length === 0 ? (
    <p>No notices available</p>
  ) : (
    notices.map((n) => {
      const userRole = (user?.role || "").toLowerCase();
const noticeRole = (n.role || "").toLowerCase();

const canDelete =
  userRole === "admin" ||
  (userRole === "hr" && noticeRole === "hr");

      return (
        <div key={n._id} style={styles.noticeCard}>
          <h4>{n.title}</h4>
          <p>{n.message}</p>

          <div style={styles.footer}>
            <span>👤 {(n.role || "HR").toUpperCase()}</span>
            <span>
              {n.createdAt
                ? new Date(n.createdAt).toLocaleString()
                : ""}
            </span>
          </div>

          {canDelete && (
            <button
              style={styles.deleteBtn}
              onClick={() => handleDelete(n._id)}
            >
              ❌ Delete
            </button>
          )}
        </div>
      );
    })
  )}
</div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px"
  },

  heading: {
    marginBottom: "20px",
    fontSize: "24px"
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },

  textarea: {
    width: "100%",
    padding: "10px",
    height: "100px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "10px"
  },

  btn: {
    padding: "10px",
    background: "#ef759e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  list: {
    display: "grid",
    gap: "15px"
  },

  noticeCard: {
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    color: "white",
    padding: "15px",
    borderRadius: "12px",
    position: "relative"
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    marginTop: "10px",
    opacity: 0.8
  },

  deleteBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "5px 8px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default NoticeBoard;