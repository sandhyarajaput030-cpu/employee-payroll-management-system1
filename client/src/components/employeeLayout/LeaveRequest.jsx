import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const LeaveRequest = () => {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [leaves, setLeaves] = useState([]);
  const [view, setView] = useState("form"); 
  const [showSuccess, setShowSuccess] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Apply Leave
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://employee-payroll-management-system1.onrender.com/api/leave/apply", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowSuccess(true);
       setView("history");   // go to history page

setTimeout(() => {
  setShowSuccess(false);
}, 3000);
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("Error applying leave");
    }
  };

  // ✅ Fetch My Leaves
  const fetchLeaves = useCallback(async () => {
    try {
      const res = await axios.get("https://employee-payroll-management-system1.onrender.com/api/leave/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ✅ FORM VIEW */}
        {view === "form" && (
          <div style={styles.card}>
            <h2 style={styles.heading}>Apply for Leave</h2>

            <form onSubmit={handleSubmit}>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label>Start Date</label>
                  <input
                    type="date"
                    required
                    style={styles.input}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label>End Date</label>
                  <input
                    type="date"
                    required
                    style={styles.input}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label>Reason for Leave</label>
                <textarea
                  required
                  style={styles.textarea}
                  placeholder="Enter reason..."
                  onChange={(e) =>
                    setForm({ ...form, reason: e.target.value })
                  }
                />
              </div>

             <button style={styles.button}>
  Submit Application
</button>

<button
  type="button"
  style={{
    marginTop: "10px",
    width: "100%",
    background: "#f581a0",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
  onClick={() => setView("history")}
>
  View Leave History
</button>

            </form>
          </div>
        )}

        {/* ✅ SUCCESS + TABLE VIEW */}
        {view === "history" && (
          <div style={styles.card}>
           {showSuccess && (
  <div style={styles.success}>
    Your leave application has been submitted successfully.
  </div>
)}
            <div style={styles.headerRow}>
  <button
    style={styles.newBtn}
    onClick={() => setView("form")}
  >
    ⬅ Back
  </button>

  <h3 style={{ margin: 0 }}>My Leave History</h3>

  <button
    style={styles.newBtn}
    onClick={() => setView("form")}
  >
    Apply for New Leave
  </button>
</div>

            <table style={styles.table}>
              <thead>
  <tr>
    <th style={styles.th}>Start Date</th>
    <th style={styles.th}>End Date</th>
    <th style={styles.th}>Reason</th>
    <th style={styles.th}>Status</th>
  </tr>
</thead>

              <tbody>
  {leaves.map((l) => (
    <tr key={l._id}>
      <td style={styles.td}>{l.startDate?.slice(0, 10)}</td>
      <td style={styles.td}>{l.endDate?.slice(0, 10)}</td>

      {/* ✅ Reason spacing FIX */}
      <td style={{ ...styles.td, ...styles.reasonCell }}>
        {l.reason}
      </td>

      <td style={styles.td}>
        <span style={getStatusStyle(l.status)}>
          {l.status}
        </span>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default LeaveRequest;

//
// 🎨 STYLES
//
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #d4fc79, #96e6a1, #fbc2eb)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: "700px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },

  heading: {
    marginBottom: "20px",
  },

  row: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
  },

  inputGroup: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    height: "80px",
    marginTop: "5px",
  },

  button: {
    marginTop: "15px",
    background: "#2563eb",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
  },

  success: {
    background: "#d1fae5",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    textAlign: "center",
    color: "#065f46",
    fontWeight: "500",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  newBtn: {
    background: "#2563eb",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

 table: {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
},

th: {
  padding: "12px",
  textAlign: "left",
  background: "#f3f4f6",
  fontWeight: "600",
  borderBottom: "2px solid #ddd",
},

td: {
  padding: "12px",
  borderBottom: "1px solid #eee",
  verticalAlign: "top",
},

reasonCell: {
  maxWidth: "250px",
  wordWrap: "break-word",
  lineHeight: "1.5",
},

};

//
// 🎨 STATUS COLORS
//
const getStatusStyle = (status) => {
  if (status === "Pending")
    return { background: "#fde68a", padding: "4px 8px", borderRadius: "6px" };
  if (status === "Approved")
    return { background: "#86efac", padding: "4px 8px", borderRadius: "6px" };
  if (status === "Rejected")
    return { background: "#fca5a5", padding: "4px 8px", borderRadius: "6px" };
};
