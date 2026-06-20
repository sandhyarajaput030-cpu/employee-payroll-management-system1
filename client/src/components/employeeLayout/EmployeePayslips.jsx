import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const EmployeePayslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const API_URL = "http://localhost:8000/api";

  const fetchPayslips = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/payroll/employee/${user.name}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPayslips(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [API_URL, token, user.name]);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  // ✅ ADMIN STYLE PDF
  const downloadPDF = (slip) => {
    const doc = new jsPDF();

    let y = 15;

    doc.setFontSize(18);
    doc.text("PayrollPro", 80, y);

    y += 8;
    doc.setFontSize(11);
    doc.text(`Salary Slip (${slip.startDate} to ${slip.endDate})`, 55, y);

    y += 10;
    doc.line(10, y, 200, y);
    y += 10;

    doc.setFontSize(12);
    doc.text("Employee Details", 20, y);

    y += 8;
    doc.setFontSize(10);
    doc.text(`Name: ${slip.employeeName}`, 20, y); y += 6;
    doc.text(`Employee ID: ${slip.employeeId?._id}`, 20, y); y += 6;
    doc.text(`Designation: ${slip.designation}`, 20, y); y += 6;
    doc.text(`Department: ${slip.department}`, 20, y);

    let rightY = y - 18;

    doc.setFontSize(12);
    doc.text("Attendance", 120, rightY);

    rightY += 8;
    doc.setFontSize(10);
    doc.text(`Total Days: ${slip.totalDays}`, 120, rightY); rightY += 6;
    doc.text(`Present: ${slip.presentDays}`, 120, rightY); rightY += 6;

    const performance =
      slip.presentDays && slip.totalDays
        ? `${Math.round((slip.presentDays / slip.totalDays) * 10)} / 10`
        : "N/A";

    doc.text(`Performance: ${performance}`, 120, rightY);

    y += 15;

    doc.line(10, y, 200, y);
    y += 8;

    doc.setFontSize(12);
    doc.text("Work Summary", 20, y);

    y += 8;
    doc.setFontSize(10);
    doc.text(`Overtime Hours: ${slip.overtime || 0}`, 20, y);
    doc.text(`Extra Orders: ${slip.extraOrders || 0}`, 120, y);

    y += 10;

    doc.line(10, y, 200, y);
    y += 8;

    doc.setFontSize(12);
    doc.text("Earnings", 20, y);

    y += 8;
    doc.setFontSize(10);

    doc.text("Basic Salary", 20, y);
    doc.text(`₹${slip.baseSalary}`, 150, y); y += 6;

    doc.text("HRA", 20, y);
    doc.text(`₹${slip.hra}`, 150, y); y += 6;

    doc.text("Bonus", 20, y);
    doc.text(`₹${slip.bonus}`, 150, y); y += 6;

    doc.text("Overtime Pay", 20, y);
    doc.text(`₹${(slip.overtime || 0) * 100}`, 150, y); y += 6;

    doc.text("Order Bonus", 20, y);
    doc.text(`₹${(slip.extraOrders || 0) * 50}`, 150, y); y += 8;

    const total =
      (slip.baseSalary || 0) +
      (slip.hra || 0) +
      (slip.bonus || 0) +
      (slip.overtime || 0) * 100 +
      (slip.extraOrders || 0) * 50;

    doc.text("Total Earnings", 20, y);
    doc.text(`₹${total}`, 150, y);

    y += 12;

    doc.line(10, y, 200, y);
    y += 8;

    doc.setFontSize(12);
    doc.text("Deductions", 20, y);

    y += 8;
    doc.setFontSize(10);
    doc.text(`₹${slip.deductions}`, 20, y);

    y += 12;

    doc.setFillColor(79, 70, 229);
    doc.rect(20, y, 160, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.text(`Net Salary: ₹${slip.netSalary}`, 60, y + 8);

    doc.save(`${slip.employeeName}_Payslip.pdf`);
  };

  return (
    <div style={styles.container}>

      {/* ================= TABLE ================= */}
      {!selectedSlip && (
        <div style={styles.card}>
          <h2 style={styles.title}>My Payslips</h2>

          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Period</th>
                <th style={styles.th}>Salary</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {payslips.length === 0 ? (
                <tr>
                  <td colSpan="3" style={styles.noData}>
                    No Payslips Found
                  </td>
                </tr>
              ) : (
                payslips.map((p, i) => (
                  <tr key={i} style={styles.row}>
                    <td style={styles.td}>{p.period}</td>
                    <td style={styles.td}>₹{p.netSalary}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.viewBtn}
                        onClick={() => setSelectedSlip(p)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= PAYSLIP VIEW ================= */}
      {selectedSlip && (
        <div style={styles.card}>
          <h2 style={styles.title}>PayrollPro</h2>

          <p style={styles.subTitle}>
            Salary Slip for {selectedSlip.startDate} - {selectedSlip.endDate}
          </p>

          <div style={styles.grid}>
            <div>
              <p><b>Name:</b> {selectedSlip.employeeName}</p>
              <p><b>Employee ID:</b> {selectedSlip.employeeId?._id}</p>
              <p><b>Designation:</b> {selectedSlip.designation}</p>
              <p><b>Department:</b> {selectedSlip.department}</p>
            </div>

            <div>
              <h4 style={styles.section}>Attendance Summary</h4>
              <p>Total Days: {selectedSlip.totalDays}</p>
              <p>Present Days: {selectedSlip.presentDays}</p>
              <p>
                Performance:{" "}
                {selectedSlip.presentDays && selectedSlip.totalDays
                  ? `${Math.round(
                      (selectedSlip.presentDays / selectedSlip.totalDays) * 10
                    )} / 10`
                  : "N/A"}
              </p>
            </div>
          </div>

          <h4 style={styles.section}>Work Summary</h4>
          <p>Overtime Hours: {selectedSlip.overtime}</p>
          <p>Extra Orders: {selectedSlip.extraOrders}</p>

          <h4 style={{ ...styles.section, color: "green" }}>Earnings</h4>
          <p>Basic Salary: ₹{selectedSlip.baseSalary}</p>
          <p>HRA: ₹{selectedSlip.hra}</p>
          <p>Bonus: ₹{selectedSlip.bonus}</p>
          <p>Overtime Pay: ₹{(selectedSlip.overtime || 0) * 100}</p>
          <p>Order Bonus: ₹{(selectedSlip.extraOrders || 0) * 50}</p>

          <h4 style={{ ...styles.section, color: "red" }}>Deductions</h4>
          <p>₹{selectedSlip.deductions}</p>

          <div style={styles.net}>
            Net Salary: ₹{selectedSlip.netSalary}
          </div>

          <div style={styles.btnRow}>
            <button style={styles.backBtn} onClick={() => setSelectedSlip(null)}>
              ⬅ Back
            </button>

            <button
              style={styles.downloadBtn}
              onClick={() => downloadPDF(selectedSlip)}
            >
              ⬇ Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "60px 80px",
    background: "linear-gradient(135deg,#e3f2fd,#fce4ec)",
    minHeight: "100vh"
  },

  card: {
    width: "95%",
    maxWidth: "850px",
    background: "#fff",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
     margin: "auto" 
  },

  title: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "bold",
    background: "linear-gradient(90deg,#7b1fa2,#e91e63)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "5px"
  },

   subTitle: {
    textAlign: "center",   // ✅ CENTER FIX (important)
    marginBottom: "25px",
    color: "#6b7280",
    fontSize: "14px"
   },

  table: {
    width: "80%",
    borderCollapse: "collapse",
     margin: "auto" 
  },

  thead: {
    background: "linear-gradient(90deg,#1976d2,#26c6da)",
    color: "white"
  },

  th: {
    padding: "15px",
     textAlign: "center" 
  },

  td: {
     padding: "15px",
    borderBottom: "1px solid #eee",
    textAlign: "center"   // ✅ ALIGN CENTER
  },


  row: {
    transition: "0.3s"
  },

  viewBtn: {
    background: "linear-gradient(to right,#6366f1,#ec4899)",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  grid: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    gap: "40px"
  },

  section: {
    marginTop: "15px",
    color: "#111827"
  },

  net: {
    marginTop: "20px",
    background: "#645de5",
    color: "white",
    padding: "12px",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
     fontSize: "16px"
  },

  btnRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between"
  },

  backBtn: {
    background: "#6b7280",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
     cursor: "pointer"
  },

  downloadBtn: {
    background: "linear-gradient(to right,#ec4899,#f97316)",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  },

  noData: {
    textAlign: "center",
    padding: "20px"
  }
};

export default EmployeePayslips;