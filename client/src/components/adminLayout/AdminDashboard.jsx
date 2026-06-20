import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaFileAlt,
  FaClipboardList,
  FaUserTie,
  FaTimes,
  FaEye,
  FaEdit,
  FaTrash
} from "react-icons/fa";
// ResponsiveContainer removed to fix eslint unused import warning

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    employees: 0,
    hr: 0,
    payroll: 0,
    attendance: 0,
    noticeBoard: 0, 
    leaves: 0,
    payslips: 0,
    chartData: []
  });
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:8000/api";

  const axiosConfig = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`
    }
  }), [token]);

  // ✅ UPDATED fetchDashboardData function with console logs
  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`, axiosConfig);
      console.log("📊 Dashboard API Response:", response.data); // Debug log
      
     if (response.data.success) {
        const data = response.data.data;

  setDashboardData({
    employees: data.employees,
    hr: data.hr,
    payroll: data.payroll,
    attendance: data.attendance,
    leaves: data.leaves || 0,
    payslips: data.payslips,
    noticeBoard: data.noticeBoard || 0,
    chartData: data.chartData || []
  });
        console.log("✅ Employees count:", response.data.data.employees); // Should show 3
        console.log("✅ HR count:", response.data.data.hr); // Should show 0 or actual
        console.log("✅ Payroll total:", response.data.data.payroll);
        console.log("✅ Attendance:", response.data.data.attendance);
        console.log("✅ Notice Board count:", response.data.data.noticeBoard);
      } else {
        console.log("❌ Dashboard API returned success: false");
      }
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [API_URL, axiosConfig, navigate]);


  const fetchLeavesCount = useCallback(async () => {
  try {
    const res = await axios.get(`${API_URL}/leave/all`, axiosConfig);
    setDashboardData(prev => ({
      ...prev,
      leaves: res.data.length
    }));
  } catch (err) {
    console.error("Error fetching leave count:", err);
  }
}, [API_URL, axiosConfig]);

  // Fetch all employees - wrapped in useCallback
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/employees`, axiosConfig);
      console.log("👥 Employees API Response:", response.data); // Debug log
      
      if (response.data.success) {
        setEmployees(response.data.data);
        console.log("✅ Total employees fetched:", response.data.data.length);
        
      } else {
        setError("Failed to fetch employees");
      }
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
      setError(err.response?.data?.message || "Error fetching employees");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL, axiosConfig, navigate]);

  const fetchAttendance = useCallback(async () => {
  try {
    const formattedDate = new Date().toLocaleDateString("en-CA");
    const res = await axios.get(`${API_URL}/attendance?date=${formattedDate}`, axiosConfig);
    // API may return either raw array or { success: true, data: [...] }
    setAttendanceData(res.data.data || res.data);
  } catch (err) {
    console.error("Error fetching attendance:", err);
  }
}, [API_URL, axiosConfig]);

  // ✅ Fixed: Added fetchDashboardData to dependency array
useEffect(() => {
  fetchDashboardData();
  fetchAttendance();
  fetchLeavesCount();
  // Ensure we have full employee list to compute percentages consistently
  fetchEmployees();
}, [fetchDashboardData, fetchAttendance, fetchLeavesCount, fetchEmployees]);

 const handleTotalEmployeesClick = () => {
 navigate("/admin-dashboard/employees"); // ✅ SAME PAGE as sidebar
};

  const handleViewEmployee = (employeeId) => {
    navigate(`/admin-dashboard/employees/${employeeId}`);
  };

  const handleEditEmployee = (employeeId) => {
    navigate(`/admin-dashboard/employees/edit/${employeeId}`);
  };

  const handleDeleteEmployee = async (employeeId, employeeName) => {
    if (window.confirm(`Are you sure you want to delete ${employeeName}?`)) {
      try {
        await axios.delete(`${API_URL}/employees/${employeeId}`, axiosConfig);
        // Refresh both employee list and dashboard stats
        await fetchEmployees();
        await fetchDashboardData();
        // Close modal after delete
        setShowEmployeesModal(false);
      } catch (err) {
        console.error("Error deleting employee:", err);
        alert("Failed to delete employee");
      }
    }
  };

  const handleHover = (e) => {
    e.currentTarget.style.transform = "translateY(-8px) scale(1.03)";
    e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";
    e.currentTarget.querySelector(".shine").style.left = "120%";
  };

  const handleLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0) scale(1)";
    e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
    e.currentTarget.querySelector(".shine").style.left = "-75%";
  };
const today = new Date();
today.setHours(0, 0, 0, 0);

const todayAttendance = attendanceData.filter((a) => {
  const recordDate = new Date(a.date);
  recordDate.setHours(0, 0, 0, 0);
  return recordDate.getTime() === today.getTime();
});

const presentCount = todayAttendance.filter((a) => {
  const status = (a.status || "").toLowerCase().trim();
  if (status === "present") return true;
  if (status === "leave") return false;
  if (!a.checkIn || !a.checkOut) return false;
  const hours = (new Date(a.checkOut) - new Date(a.checkIn)) / (1000 * 60 * 60);
  return hours >= 6; // match Attendance.jsx full-day threshold
}).length;

const totalEmployees = employees.length || dashboardData.employees || 0;

const attendancePercent = totalEmployees ? Math.round((presentCount / totalEmployees) * 100) : 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Dashboard Overview</h2>

      {/* Cards */}
      <div style={styles.cardContainer}>
        <div
          style={{ ...styles.card, background: "linear-gradient(135deg,#4facfe,#00f2fe)" }}
          onClick={handleTotalEmployeesClick}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <FaUsers size={30} />
          <h4>Total Employees</h4>
          <p style={styles.number}>{dashboardData.employees || 0}</p>
          <div className="shine" style={styles.shine}></div>
        </div>

       <div
  style={{ ...styles.card, background: "linear-gradient(135deg,#ff6eb4,#ff99cc)" }}
  onClick={() => navigate("/admin-dashboard/hr-managers")}
  onMouseEnter={handleHover}
  onMouseLeave={handleLeave}
>
  <FaUserTie size={30} />
  <h4>HR Managers</h4>
  <p style={styles.number}>{dashboardData.hr || 0}</p>
  <div className="shine" style={styles.shine}></div>
</div>

        <div
          style={{ ...styles.card, background: "linear-gradient(135deg,#43e97b,#38f9d7)" }}
         onClick={() => navigate("/admin-dashboard/payroll/view-slips")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <FaMoneyBillWave size={30} />
          <h4>Total Payroll</h4>
          <p style={styles.number}>₹{dashboardData.payroll?.toLocaleString() || 0}</p>
          <div className="shine" style={styles.shine}></div>
        </div>

        <div
          style={{ ...styles.card, background: "linear-gradient(135deg,#fa709a,#fee140)" }}
          onClick={() =>navigate("/admin-dashboard/attendance")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <FaCalendarCheck size={30} />
          <h4>Attendance</h4>
          <p style={styles.number}>{attendancePercent}%</p>
          <div className="shine" style={styles.shine}></div>
        </div>

        <div
          style={{ ...styles.card, background: "linear-gradient(135deg,#a18cd1,#fbc2eb)" }}
          onClick={() => navigate("/admin-dashboard/notice-board")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <FaFileAlt size={30} />
          <h4>Notice-board</h4>
          <p style={styles.number}>{dashboardData.noticeBoard || 0}</p>
          <div className="shine" style={styles.shine}></div>
        </div>

        <div
  style={{
    ...styles.card,
    background: "linear-gradient(135deg,#f7971e,#ffd200)"
  }}
  onClick={() => navigate("/admin-dashboard/leaves")}
  onMouseEnter={handleHover}
  onMouseLeave={handleLeave}
>
  <FaClipboardList size={30} />

  <h4>Leave Requests</h4>

  <p style={styles.number}>
    {dashboardData?.leaves ?? 0}
  </p>

  <div className="shine" style={styles.shine}></div>
</div>

        <div
          style={{ ...styles.card, background: "linear-gradient(135deg,#00c6ff,#0072ff)" }}
         onClick={() => navigate("/admin-dashboard/payroll/salary-prediction")}
          onMouseEnter={handleHover}
          onMouseLeave={handleLeave}
        >
          <FaFileAlt size={30} />
          <h4>Salary Prediction</h4>
          <p style={styles.number}>{dashboardData.payslips || 0}</p>
          <div className="shine" style={styles.shine}></div>
        </div>
      </div>

      {/* Employees Modal */}
      {showEmployeesModal && (
        <div style={styles.modalOverlay} onClick={() => setShowEmployeesModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>Employee List ({employees.length})</h3>
              <button
                style={styles.closeButton}
                onClick={() => setShowEmployeesModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div style={styles.modalBody}>
              {loading ? (
                <div style={styles.loading}>Loading employees...</div>
              ) : error ? (
                <div style={styles.error}>{error}</div>
              ) : employees.length === 0 ? (
                <div style={styles.noData}>No employees found</div>
              ) : (
                <table style={styles.employeeTable}>
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Joining Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee._id}>
                        <td>{employee.employeeId}</td>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.department}</td>
                        <td>{employee.position}</td>
                        <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
                        <td>
                          <span
                            style={{
                              ...styles.statusBadge,
                              backgroundColor: employee.isActive ? "#d4edda" : "#f8d7da",
                              color: employee.isActive ? "#155724" : "#721c24"
                            }}
                          >
                            {employee.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div style={styles.actionButtons}>
                            <button
                              style={styles.actionButton}
                              onClick={() => handleViewEmployee(employee._id)}
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              style={styles.actionButton}
                              onClick={() => handleEditEmployee(employee._id)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              style={{...styles.actionButton, color: "#dc3545"}}
                              onClick={() => handleDeleteEmployee(employee._id, employee.name)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Quick Actions */}
      <div style={styles.box}>
        <h3>Quick Actions</h3>
        <div style={styles.actions}>
          <button style={styles.btn} onClick={() => navigate("/admin-dashboard/employees")}>
            ➕ Add Employee
          </button>
          <button style={styles.btn} onClick={() => navigate("/admin-dashboard/payroll/view-slips")}>
            💰 Process Payroll
          </button>
          <button style={styles.btn} onClick={() => navigate("/admin-dashboard/leaves")}>
            📄 Leave Request
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "10px" },
  heading: { marginBottom: "20px", fontSize: "22px" },

  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: "20px",
    marginBottom: "30px"
  },

  card: {
    padding: "20px",
    color: "white",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    position: "relative",
    overflow: "hidden"
  },

  number: { fontSize: "22px", fontWeight: "bold" },

  shine: {
    position: "absolute",
    top: "0",
    left: "-75%",
    width: "50%",
    height: "100%",
    background: "rgba(255,255,255,0.3)",
    transform: "skewX(-25deg)",
    transition: "0.5s"
  },

  box: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
  },

  list: { lineHeight: "2" },

  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  btn: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    background: "#4facfe",
    color: "white",
    cursor: "pointer"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },

  modal: {
    backgroundColor: "white",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "1200px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #e0e0e0"
  },

  closeButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#666"
  },

  modalBody: {
    padding: "20px",
    overflowY: "auto"
  },

  employeeTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px"
  },

  statusBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block"
  },

  actionButtons: {
    display: "flex",
    gap: "8px"
  },

  actionButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px 8px",
    borderRadius: "4px",
    transition: "all 0.3s ease",
    color: "#4facfe"
  },

  loading: {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    color: "#666"
  },

  error: {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    color: "#dc3545"
  },

  noData: {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    color: "#666"
  }
};

export default AdminDashboard;