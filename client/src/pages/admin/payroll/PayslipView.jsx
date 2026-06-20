import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const PayslipView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data || !data.slip) {
    return <h2 style={{ padding: "20px" }}>No Payslip Data Found</h2>;
  }
const { slip } = data;

// ✅ FINAL WORKING DOWNLOAD FUNCTION
const handleDownload = () => {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "normal");

  let y = 15;

  // ===== HEADER =====
  doc.setFontSize(18);
  doc.text("PayrollPro", 80, y);

  y += 8;
  doc.setFontSize(11);
  doc.text(
    `Salary Slip (${slip.startDate} to ${slip.endDate})`,
    65,
    y
  );

  y += 10;

  // ===== LINE =====
  doc.line(10, y, 200, y);
  y += 10;

  // ===== EMPLOYEE DETAILS (LEFT) =====
  doc.setFontSize(12);
  doc.text("Employee Details", 20, y);

  y += 8;
  doc.setFontSize(10);
  doc.text(`Name: ${slip.employeeName}`, 20, y); y += 6;
  doc.text(`Employee ID: ${slip.employeeId?._id}`, 20, y); y += 6;
  doc.text(`Designation: ${slip.designation || "N/A"}`, 20, y); y += 6;
  doc.text(`Department: ${slip.department || "N/A"}`, 20, y);

  // ===== ATTENDANCE (RIGHT) =====
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

  // ===== WORK SUMMARY =====
  doc.line(10, y, 200, y);
  y += 8;

  doc.setFontSize(12);
  doc.text("Work Summary", 20, y);

  y += 8;
  doc.setFontSize(10);
  doc.text(`Overtime Hours: ${slip.overtime || 0}`, 20, y);
  doc.text(`Extra Orders: ${slip.extraOrders || 0}`, 120, y);

  y += 10;

  // ===== EARNINGS TABLE =====
  doc.line(10, y, 200, y);
  y += 8;

  doc.setFontSize(12);
  doc.text("Earnings", 20, y);

  y += 8;
  doc.setFontSize(10);

  doc.text("Component", 20, y);
  doc.text("Amount", 150, y);

  y += 5;
  doc.line(20, y, 190, y);
  y += 5;

  doc.text("Basic Salary", 20, y);
  doc.text(`Rs. ${slip.baseSalary}`, 150, y); y += 6;

  doc.text("HRA", 20, y);
  doc.text(`Rs. ${slip.hra}`, 150, y); y += 6;

  doc.text("Bonus", 20, y);
  doc.text(`Rs. ${slip.bonus}`, 150, y); y += 6;

  doc.text("Overtime Pay", 20, y);
  doc.text(`Rs. ${(slip.overtime || 0) * 100}`, 150, y); y += 6;

  doc.text("Order Bonus", 20, y);
  doc.text(`Rs. ${(slip.extraOrders || 0) * 50}`, 150, y); y += 8;

  const totalEarnings =
    (slip.baseSalary || 0) +
    (slip.hra || 0) +
    (slip.bonus || 0) +
    (slip.overtime || 0) * 100 +
    (slip.extraOrders || 0) * 50;

  doc.setFontSize(11);
  doc.text("Total Earnings", 20, y);
  doc.text(`Rs. ${totalEarnings}`, 150, y);

  y += 12;

  // ===== DEDUCTIONS =====
  doc.line(10, y, 200, y);
  y += 8;

  doc.setFontSize(12);
  doc.text("Deductions", 20, y);

  y += 8;
  doc.setFontSize(10);

  doc.text("Standard Deduction", 20, y);
  doc.text(`Rs. ${slip.deductions}`, 150, y); y += 8;

  doc.setFontSize(11);
  doc.text("Total Deductions", 20, y);
  doc.text(`Rs. ${slip.deductions}`, 150, y);

  y += 12;

  // ===== NET SALARY BOX =====
  doc.setFillColor(79, 70, 229); // blue
  doc.rect(20, y, 160, 12, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(`Net Salary: Rs. ${slip.netSalary}`, 60, y + 8);

  doc.setTextColor(0, 0, 0);

  y += 20;

  // ===== NOTE =====
  const note =
    slip.presentDays < slip.totalDays / 2
      ? "Attendance below 50% - No incentive applied"
      : "Good performance incentive applied";

  doc.setFontSize(9);
  doc.text(note, 20, y);

  // ===== FOOTER =====
  y += 10;
  doc.setFontSize(8);
  doc.text("This is a system generated payslip.", 60, y);

  // ===== DOWNLOAD =====
  doc.save(`${slip.employeeName}_Payslip.pdf`);
};


  // ✅ Calculate Total Earnings
  const totalEarnings =
    (slip.baseSalary || 0) +
    (slip.hra || 0) +
    (slip.bonus || 0) +
    (slip.overtime || 0) * 100 +
    (slip.extraOrders || 0) * 50;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>PayrollPro</h2>

       <p style={styles.subTitle}>
           Salary Slip for {slip.startDate} - {slip.endDate}
        </p>

        {/* ===== TOP DETAILS ===== */}
        <div style={styles.grid}>
          <div>
          <p><b>Name:</b> {slip.employeeName}</p>

        <p><b>Employee ID:</b> {slip.employeeId?._id}</p>

       <p><b>Designation:</b> {slip.designation || slip.employeeId?.designation || "N/A"}</p>

       <p><b>Department:</b> {slip.department || slip.employeeId?.department}</p>
          </div>

          <div>
            <h4 style={styles.section}>Attendance Summary</h4>
           <p><b>Total Days:</b> {slip.totalDays || 30}</p>
           <p><b>Present Days:</b> {slip.presentDays || 0}</p>

          <p>
            <b>Performance:</b>{" "}
            {slip.presentDays && slip.totalDays
            ? `${Math.round((slip.presentDays / slip.totalDays) * 10)} / 10`
          : "N/A"}
       </p>
          </div>
        </div>

        {/* ===== WORK SUMMARY ===== */}
        <h4 style={styles.section}>Work Summary</h4>
        <p>Overtime Hours: {slip.overtime || 0}</p>
        <p>Extra Orders: {slip.extraOrders || 0}</p>

        {/* ===== EARNINGS ===== */}
        <h4 style={{ ...styles.section, color: "#16a34a" }}>Earnings</h4>
        <p>Basic Salary: ₹{slip.baseSalary}</p>
        <p>HRA: ₹{slip.hra}</p>
        <p>Bonus: ₹{slip.bonus}</p>
        <p>Overtime Pay: ₹{(slip.overtime || 0) * 100}</p>
        <p>Order Bonus: ₹{(slip.extraOrders || 0) * 50}</p>

        <p><b>Total Earnings:</b> ₹{totalEarnings}</p>

        {/* ===== DEDUCTIONS ===== */}
        <h4 style={{ ...styles.section, color: "#dc2626" }}>Deductions</h4>
        <p>Standard Deductions: ₹{slip.deductions}</p>
        <p><b>Total Deductions:</b> ₹{slip.deductions}</p>

        {/* ===== NET SALARY ===== */}
        <div style={styles.net}>
          Net Salary: ₹{slip.netSalary}
        </div>

        {/* ===== NOTE ===== */}
        <div style={styles.note}>
          {slip.presentDays < slip.totalDays / 2
            ? "Attendance is below 50%, so no incentive applied."
            : "Good performance incentive applied."}
        </div>

        {/* ===== BUTTONS ===== */}
        <div style={styles.btnRow}>
          <button style={styles.back} onClick={() => navigate(-1)}>
            ⬅ Back
          </button>

         <button style={styles.download} onClick={handleDownload}>
  ⬇ Download PDF
</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    background: "linear-gradient(135deg,#eef2ff,#fce7f3)",
    minHeight: "100vh",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    maxWidth: "800px",
    margin: "auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    color: "#6d28d9",
  },

  subTitle: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#6b7280",
  },

  grid: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  section: {
    marginTop: "15px",
    color: "#111827",
  },

  net: {
    marginTop: "20px",
    background: "#4f46e5",
    color: "white",
    padding: "12px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
  },

  note: {
    marginTop: "15px",
    background: "#e0f2fe",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "13px",
  },

  btnRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
  },

  back: {
    background: "#6b7280",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  download: {
    background: "linear-gradient(to right,#ec4899,#f97316)",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default PayslipView;