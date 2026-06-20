import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const token = localStorage.getItem("token");

 const fetchLeaves = useCallback(async () => {
  const res = await axios.get("https://employee-payroll-management-system1.onrender.com/api/leave/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
  setLeaves(res.data);
}, [token]);

  const updateStatus = async (id, status) => {
   await axios.put(
  `https://employee-payroll-management-system1.onrender.com/api/leave/${id}`,
  { status },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);
    fetchLeaves();
  };

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Employee Leave Requests</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th>Name</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((l) => (
              <tr key={l._id} style={styles.row}>
                <td style={styles.cell}>{l.employeeName}</td>

                <td style={styles.cell}>
                  {new Date(l.startDate).toLocaleDateString()} -{" "}
                  {new Date(l.endDate).toLocaleDateString()}
                </td>

                <td style={{ ...styles.cell, maxWidth: "250px" }}>
                  <div style={styles.reason}>{l.reason}</div>
                </td>

                <td style={styles.cell}>
                  <span
                    style={{
                      ...styles.badge,
                      background:
                        l.status === "Pending"
                          ? "#fef3c7"
                          : l.status === "Approved"
                          ? "#d1fae5"
                          : "#fee2e2",
                      color:
                        l.status === "Pending"
                          ? "#92400e"
                          : l.status === "Approved"
                          ? "#065f46"
                          : "#991b1b",
                    }}
                  >
                    {l.status}
                  </span>
                </td>

                <td style={styles.cell}>
                  {l.status === "Pending" ? (
                    <div style={styles.actions}>
                      <button
                        style={styles.approveBtn}
                        onClick={() => updateStatus(l._id, "Approved")}
                      >
                        Approve
                      </button>

                      <button
                        style={styles.rejectBtn}
                        onClick={() => updateStatus(l._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: "#9ca3af", fontSize: "13px" }}>
                      No actions
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeLeaves;

/* ---------------- STYLES ---------------- */
const styles = {
  page: {
    padding: "25px",
    background: "#dee4ef",
    minHeight: "100vh",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
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
    color: "#374151",
    fontSize: "14px",
  },

  row: {
    background: "#ffffff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    borderRadius: "10px",
  },

  cell: {
    padding: "12px",
    fontSize: "14px",
    color: "#111827",
    verticalAlign: "middle",
  },

  reason: {
    whiteSpace: "normal",
    lineHeight: "1.4",
    color: "#374151",
  },

  badge: {
    padding: "5px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  },

  actions: {
    display: "flex",
    gap: "8px",
  },

  approveBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  rejectBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
