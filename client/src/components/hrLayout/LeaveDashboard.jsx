import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const LeaveDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [count, setCount] = useState(0);

  const token = localStorage.getItem("token");

  const fetchLeaves = useCallback(async () => {
    const res = await axios.get("https://employee-payroll-management-system1.onrender.com/api/leave/all", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setLeaves(res.data);

    const today = new Date();

    const onLeave = res.data.filter((l) => {
      return (
        l.status === "Approved" &&
        new Date(l.startDate) <= today &&
        new Date(l.endDate) >= today
      );
    });

    setCount(onLeave.length);
  }, [token]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>HR Leave Dashboard</h2>

      {/* STATS CARD */}
      <div
  style={{
    ...styles.card,
    background: count === 0 ? "#fef2f2" : "#ffffff",
    border: count === 0 ? "1px solid #ef4444" : "none",
    boxShadow:
      count === 0
        ? "0 4px 12px rgba(239, 68, 68, 0.2)"
        : "0 4px 12px rgba(0,0,0,0.08)",
  }}
>
  <h3 style={styles.cardText}>
    Employees on Leave Today:{" "}
    <span
      style={{
        ...styles.highlight,
        color: count === 0 ? "#e21717" : "#2563eb",
      }}
    >
      {count}
    </span>
  </h3>
</div>

      {/* TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th>Name</th>
              <th>Department</th>
              <th>Dates</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((l) => (
              <tr key={l._id} style={styles.row}>
                <td style={styles.cell}>{l.employeeName}</td>
                <td style={styles.cell}>{l.department}</td>

                <td style={styles.cell}>
                  {new Date(l.startDate).toLocaleDateString()} -{" "}
                  {new Date(l.endDate).toLocaleDateString()}
                </td>

                <td style={styles.cell}>
                  <span
                    style={{
                      ...styles.badge,
                      background:
                        l.status === "Approved"
                          ? "#d1fae5"
                          : l.status === "Pending"
                          ? "#fef3c7"
                          : "#fee2e2",
                      color:
                        l.status === "Approved"
                          ? "#065f46"
                          : l.status === "Pending"
                          ? "#92400e"
                          : "#991b1b",
                    }}
                  >
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveDashboard;

/* ---------------- STYLES ---------------- */
const styles = {
  page: {
    padding: "25px",
    background: "#f3f4f6",
    minHeight: "100vh",
  },

  title: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#111827",
  },

  card: {
    background: "#ffffff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "20px",
    textAlign: "center",
  },

  cardText: {
    margin: 0,
    fontSize: "18px",
    color: "#374151",
  },

  highlight: {
    color: "#2563eb",
    fontWeight: "700",
  },

  tableWrapper: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
  },

  headerRow: {
    textAlign: "left",
    background: "#f9fafb",
    fontSize: "14px",
    color: "#374151",
  },

  row: {
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },

  cell: {
    padding: "12px",
    fontSize: "14px",
    color: "#111827",
  },

  badge: {
    padding: "5px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
};
