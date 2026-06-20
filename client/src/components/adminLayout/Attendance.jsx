import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
// Replaced heavy datepicker with native input to avoid runtime errors
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const Attendance = () => {
  const [time, setTime] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  const formatDateLocal = (d) => {
    if (!d) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // ⏰ Live Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔥 Fetch Attendance
 const fetchAttendance = useCallback(async () => {
  if (!token) return;
  setLoading(true);

  try {
    let res;

    if (currentUser.role === "employee") {
      // ✅ Employee → only their data
      res = await axios.get(
        "https://employee-payroll-management-system1.onrender.com/api/attendance/my-attendance",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      // ✅ Admin / HR → all employees
    const formattedDate = formatDateLocal(selectedDate);

      res = await axios.get(
        `https://employee-payroll-management-system1.onrender.com/api/attendance?date=${formattedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    setAttendanceData(res.data);
  } catch (err) {
    console.error("Error fetching attendance data", err);
    alert("Error fetching attendance data");
  }

  setLoading(false);
}, [token, selectedDate, currentUser.role]);
  // 🔥 Fetch monthly attendance for the selected month (for line chart)
  const fetchMonthlyAttendance = useCallback(async () => {
    if (!token) return;
    try {
      const month = new Date(selectedDate).getMonth();
      const year = new Date(selectedDate).getFullYear();
      const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`; // YYYY-MM
      const res = await axios.get(`https://employee-payroll-management-system1.onrender.com/api/attendance?month=${monthStr}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.debug("Monthly attendance fetched:", Array.isArray(res.data) ? res.data.length : res.data);
      setMonthlyData(res.data);
      // Temporary debug: print first 20 records to help diagnose mismatched counts
      try {
        if (Array.isArray(res.data)) {
          console.groupCollapsed("MonthlyData sample (first 20)");
          console.table(
            res.data.slice(0, 20).map((r) => ({
              _id: r._id,
              dateString: r.dateString,
              date: r.date,
              status: r.status,
              checkIn: r.checkIn,
              checkOut: r.checkOut,
              employeeId: r.employeeId?._id || r.employeeId
            }))
          );
          console.groupEnd();
        }
      } catch (e) {
        console.error("Debug table error:", e);
      }
    } catch (err) {
      console.error("Error fetching monthly attendance", err);
    }
  }, [token, selectedDate]);

  // 🔥 Fetch Employees
  const fetchEmployees = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get("https://employee-payroll-management-system1.onrender.com/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // API returns { success, count, data } — use the data array when present
      setEmployees(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  }, [token]);

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
    fetchMonthlyAttendance();
  }, [fetchAttendance, fetchEmployees, fetchMonthlyAttendance]);

  // Build a display list that shows every employee and their attendance record (if any) for selectedDate
 // eslint-disable-next-line no-unused-vars
const selDateStr = new Date(selectedDate).toDateString();
const displayed = employees.map((emp) => {
  const selectedStr = formatDateLocal(selectedDate);

  const record = attendanceData.find((a) => {
    const attEmpId = a.employeeId?._id || a.employeeId;

    return (
      attEmpId?.toString() === emp._id?.toString() &&
      a.dateString === selectedStr   // ✅ exact match
    );
  });

  return { employee: emp, record: record || null };
});
    
const getStatus = (record) => {
  if (!record) return "Absent";

  // Prefer explicit status from backend when available
  const status = (record.status || "").toLowerCase();

  if (status === "leave") return "Leave";
  if (status === "present") return "Present";
  if (status === "half day" || status === "halfday") return "Half Day";
  if (status === "absent") return "Absent";

  // If no explicit status, infer from check-in/out times
  if (!record.checkIn || !record.checkOut) return "Absent";

  const hours =
    (new Date(record.checkOut) - new Date(record.checkIn)) /
    (1000 * 60 * 60);

  if (hours >= 6) return "Present";
  if (hours > 0) return "Half Day";

  return "Absent";
};

  // 📊 Calculations based on displayed employees
  const totalEmployees = employees.length;
 const presentCount = displayed.filter(d => getStatus(d.record) === "Present").length;

const halfDayCount = displayed.filter(d => getStatus(d.record) === "Half Day").length;

const leaveCount = displayed.filter(d => getStatus(d.record) === "Leave").length;

const absentCount = displayed.filter(d => getStatus(d.record) === "Absent").length;

const attendancePercent = totalEmployees ? Math.round((presentCount / totalEmployees) * 100) : 0;

  // 📊 Chart Data (simple daily bar from attendance records)
  const pieData = [
    { name: 'Present', value: presentCount },
    { name: 'Half Day', value: halfDayCount },
    { name: 'Leave', value: leaveCount },
    { name: 'Absent', value: absentCount },
  ];

  // Build monthly line chart data (days of selected month)
  const month = new Date(selectedDate).getMonth();
  const year = new Date(selectedDate).getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

const lineData = Array.from({ length: daysInMonth }, (_, i) => {
  const day = i + 1;

  const recordsForDay = monthlyData.filter((a) => {
    const d = new Date(a.date);
    return (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === day
    );
  });

  const presentEmployees = new Set();

 recordsForDay.forEach((rec) => {
  const empId = rec.employeeId?._id || rec.employeeId;
  if (!empId) return;

  const status = getStatus(rec); 

  if (status === "Present") {
    presentEmployees.add(empId.toString());
  }
});

  return {
    day: day.toString().padStart(2, "0"),
    present: presentEmployees.size,
  };
});

  // Debug: show constructed lineData for first 10 days
  // eslint-disable-next-line no-console
  console.debug("lineData sample:", lineData.slice(0, 10));

  // ⏱ Work hours
  const calculateHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return "-";
  const inTime = new Date(checkIn);
  const outTime = new Date(checkOut);
  if (isNaN(inTime) || isNaN(outTime)) return "-";
  const diff = (outTime - inTime) / (1000 * 60 * 60);
  const hours = parseFloat(diff.toFixed(2));
  let note = "";
  if (hours >= 6) note = " (Full day)";
  else if (hours > 0) note = " (Half day)";
  return hours.toFixed(1) + " hrs" + note;
};

  // ✅ Check In
  const handleCheckIn = async () => {
    try {
    const formattedDate = formatDateLocal(selectedDate);
      await axios.post(
        "https://employee-payroll-management-system1.onrender.com/api/attendance/checkin",
        { employeeId: currentUser._id, date: formattedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAttendance();
      await fetchMonthlyAttendance();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error checking in");
    }
  };

  // ✅ Check Out
  const handleCheckOut = async () => {
    try {
    const formattedDate = formatDateLocal(selectedDate);
      await axios.post(
        "https://employee-payroll-management-system1.onrender.com/api/attendance/checkout",
        { employeeId: currentUser._id, date: formattedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchAttendance();
      await fetchMonthlyAttendance();
    } catch (err) {
      console.error(err);
     alert(err.response?.data?.message || "Error checking out");
    }
  };

  // Admin/HR or marking a specific employee: pass employeeId in body
  const handleRowCheckIn = async (employeeId) => {
    try {
    const formattedDate = formatDateLocal(selectedDate);
      await axios.post(
        "https://employee-payroll-management-system1.onrender.com/api/attendance/checkin",
        { employeeId, date: formattedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAttendance();
      await fetchMonthlyAttendance();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error checking in");
    }
  };

  const handleRowCheckOut = async (employeeId) => {
    console.log("🔥 Checkout clicked for:", employeeId);
    try {
    const formattedDate = formatDateLocal(selectedDate);
      const res = await axios.post(
        "https://employee-payroll-management-system1.onrender.com/api/attendance/checkout",
        { employeeId, date: formattedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Checkout success:", res.data);
      await fetchAttendance();
      await fetchMonthlyAttendance();
    } catch (err) {
      console.error("❌ Checkout error:", err.response || err);
      const msg = err.response?.data?.message || err.response?.data?.error || "Error checking out";
      alert(msg);
    }
  };

  // ✏️ Edit Attendance
 const handleEdit = async (record) => {
  const newStatus = window.prompt(
    "Enter status exactly:\nPresent\nHalf Day\nLeave\nAbsent",
    record.status
  );

  if (!newStatus) return;

  try {
    await axios.put(
      `https://employee-payroll-management-system1.onrender.com/api/attendance/${record._id}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await fetchAttendance();
  } catch (err) {
    alert(err.response?.data?.message || "Error updating attendance");
  }
};

  // ❌ Delete Attendance
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`https://employee-payroll-management-system1.onrender.com/api/attendance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchAttendance();
    } catch (err) {
      console.error(err);
      alert("Error deleting attendance");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sectionTitleBox}>
        <span style={styles.hash}>#</span>
        <span style={styles.sectionTitleText}>Attendance Overview</span>
      </div>

      {/* CARDS */}
     <div style={styles.cards}>
  
  {/* Row 1 */}
  <div style={{ ...styles.card, background: "#f321a6" }}>
    <h3>Total Employees</h3>
    <p>{totalEmployees}</p>
  </div>

  <div style={{ ...styles.card, background: "#16af19f8" }}>
    <h3>Present</h3>
    <p>{presentCount}</p>
  </div>

  <div style={{ ...styles.card, background: "#FF9800" }}>
    <h3>Half Day</h3>
    <p>{halfDayCount}</p>
  </div>

  {/* Row 2 */}
  <div style={{ ...styles.card, background: "#2196F3" }}>
    <h3>Leave</h3>
    <p>{leaveCount}</p>
  </div>

  <div style={{ ...styles.card, background: "#e61235" }}>
    <h3>Absent</h3>
    <p>{absentCount}</p>
  </div>

  <div style={{ ...styles.card, background: "#57ed07" }}>
    <h3>Attendance %</h3>
    <p>{attendancePercent}%</p>
  </div>

</div>

      {/* ACTION BUTTONS */}
      {/* Top-level check in/out only for employees (their own attendance) */}
      {currentUser.role === "employee" && (
        <div style={styles.actions}>
          <button 
  style={styles.checkIn} 
  onClick={handleCheckIn}
  disabled={attendanceData.some(a => {
  const sameEmp = a.employeeId?._id === currentUser._id;
  const sameDate = new Date(a.date).toDateString() === new Date(selectedDate).toDateString();
  return sameEmp && sameDate && a.checkIn;
})}
>
  Check In
</button>
         <button 
  style={styles.checkOut} 
  onClick={handleCheckOut}
  disabled={attendanceData.some(a => {
  const sameEmp = a.employeeId?._id === currentUser._id;
  const sameDate = new Date(a.date).toDateString() === new Date(selectedDate).toDateString();
  return sameEmp && sameDate && a.checkOut;
})}
>
  Check Out
</button>
        </div>
      )}

      {/* DATE FILTER */}
      <div style={{ marginTop: 20 }}>
        <input
          type="date"
          value={
            selectedDate
              ? `${selectedDate.getFullYear()}-${String(
                  selectedDate.getMonth() + 1
                ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
                  2,
                  "0"
                )}`
              : ""
          }
          onChange={(e) => {
            const v = e.target.value; // 'YYYY-MM-DD'
            if (!v) return setSelectedDate(null);
            const [yy, mm, dd] = v.split("-");
            // create date in local timezone at midnight to avoid UTC shift
            setSelectedDate(new Date(Number(yy), Number(mm) - 1, Number(dd)));
          }}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
      </div>

      {/* CHARTS */}
<div style={styles.charts}>
  
  {/* PIE CHART */}
  <div style={styles.chartBox}>
    <h3 style={styles.chartTitle}>Daily Attendance</h3>
    <PieChart width={300} height={260}>
      <Pie data={pieData} dataKey="value" outerRadius={90} label>
  <Cell fill="#16af19f8" /> {/* Present */}
  <Cell fill="#FF9800" /> {/* Half Day */}
  <Cell fill="#2196F3" /> {/* Leave */}
  <Cell fill="#e61235" /> {/* Absent */}
</Pie>
      <Tooltip />
    </PieChart>
  </div>

  {/* LINE CHART */}
  <div style={styles.chartBox}>
    <h3 style={styles.chartTitle}>Monthly Attendance Trend</h3>
    <LineChart width={420} height={260} data={lineData} margin={{ left: 20 }}>
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="present" stroke="#2196F3" strokeWidth={3} />
    </LineChart>
  </div>

</div>
      {/* CLOCK */}
     <div style={styles.clockBox}>
  <span style={styles.clockText}>
    🕒 {time.toLocaleTimeString()}
  </span>
</div>

      {/* TABLE */}
      <div style={styles.tableBox}>
        <h3>Attendance Records</h3>
        {loading ? <p>Loading...</p> : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Name</th>
                <th style={styles.tableHeader}>Department</th>
                <th style={styles.tableHeader}>Designation</th>
                <th style={styles.tableHeader}>Date</th>
                <th style={styles.tableHeader}>Check In</th>
                <th style={styles.tableHeader}>Check Out</th>
                <th style={styles.tableHeader}>Work Hours</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((row) => {
                const record = row.record;
                const emp = row.employee;
               const statusText = getStatus(record);
               // eslint-disable-next-line no-unused-vars
const statusKey = (record?.status || "").toLowerCase();
                return (
                  <tr key={emp._id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{emp.name || "-"}</td>
                    <td style={styles.tableCell}>{emp.department || "-"}</td>
                    <td style={styles.tableCell}>{emp.position || emp.designation || "-"}</td>
                    <td style={styles.tableCell}>{record?.date ? new Date(record.date).toLocaleDateString() : new Date(selectedDate).toLocaleDateString()}</td>
                    <td style={styles.tableCell}>{record?.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "-"}</td>
                    <td style={styles.tableCell}>{record?.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "-"}</td>
                    <td style={styles.tableCell}>{calculateHours(record?.checkIn, record?.checkOut)}</td>
                    <td style={{
                            ...styles.tableCell,
                            color:
                            statusText === "Present" ? "green" :
                            statusText === "Half Day" ? "orange" :
                            statusText === "Leave" ? "blue" :
                           "red"
                        }}>
                     <span style={{
  padding: "5px 10px",
  borderRadius: "10px",
  color: "white",
  background:
    statusText === "Present" ? "green" :
    statusText === "Half Day" ? "orange" :
    statusText === "Leave" ? "blue" :
    "red"
}}>
  {statusText}
</span>
                    </td>
                    <td style={styles.tableCell}>
                      {!record || !record.checkIn ? (
                        <button onClick={() => handleRowCheckIn(emp._id)} style={styles.editBtn}>Check In</button>
                      ) : (
                        <button disabled style={{ ...styles.editBtn, opacity: 0.5 }}>Checked In</button>
                      )}
                      {record && !record.checkOut ? (
                        <button onClick={() => handleRowCheckOut(emp._id)} style={styles.deleteBtn}>Check Out</button>
                      ) : (
                        <button disabled style={{ ...styles.deleteBtn, opacity: 0.5 }}>Checked Out</button>
                      )}
                      {record && (
                        <>
                          <button onClick={() => handleEdit(record)} style={styles.editBtn}>Edit</button>
                          <button onClick={() => handleDelete(record._id)} style={styles.deleteBtn}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
     padding: 30, background: "#f5f7fb", minHeight: "100vh" },
  sectionTitleBox: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  sectionTitleText: { fontSize: 32, fontWeight: "bold" },
  hash: { background: "#667eea", color: "white", padding: "2px 8px", borderRadius: 6, fontSize: 19 },
  cards: { 
  display: "grid", 
  gridTemplateColumns: "repeat(3, 1fr)", 
  gap: 20 
},
  card: { padding: 20, borderRadius: 15, color: "white", textAlign: "center" },
  actions: { marginTop: 20, display: "flex", gap: 20 },
  checkIn: { background: "#4CAF50", color: "white", padding: "12px 25px", border: "none", borderRadius: 10, cursor: "pointer" },
  checkOut: { background: "#f44336", color: "white", padding: "12px 25px", border: "none", borderRadius: 10, cursor: "pointer" },
  charts: { marginTop: 30, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  chartBox: { background: "white", borderRadius: 15, padding: 10, display: "flex", justifyContent: "center", alignItems: "center" },
  clock: { marginTop: 20, textAlign: "right", fontWeight: "bold", fontSize: 20 },
  tableBox: { marginTop: 20, background: "white", padding: 20, borderRadius: 15 },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" },
  tableHeader: { textAlign: "left", padding: "12px 10px", fontWeight: 700 },
  tableRow: { background: "#fff", borderRadius: 8 },
  tableCell: { padding: "12px 10px", verticalAlign: "middle" },
  editBtn: { background: "#2196F3", color: "white", border: "none", padding: "5px 10px", marginRight: 5, borderRadius: 5, cursor: "pointer" },
  deleteBtn: { background: "#f44336", color: "white", border: "none", padding: "5px 10px", borderRadius: 5, cursor: "pointer" },
  clockBox: {
  marginTop: 20,
  display: "flex",
  justifyContent: "flex-end"
},

clockText: {
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  color: "white",
  padding: "8px 15px",
  borderRadius: 10,
  fontWeight: "bold",
  fontSize: 16,
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
},
};

export default Attendance;
