import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const GeneratePayslips = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeName: "",
    startDate: "",
    endDate: "",
    hra: 0,
    bonus: 0,
    deductions: 0,
    overtime: 0,
    extraOrders: 0,
    totalDays: 30,
    presentDays: 0
  });
  const [currentSlipId, setCurrentSlipId] = useState(null);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://employee-payroll-management-system1.onrender.com/api/employees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data.data);
    } catch (err) {
      console.error("EMP FETCH ERROR:", err);
    }
  };

  // Fetch defaults for selected employee
 const fetchDefaults = async (employeeName) => {
  try {
    const token = localStorage.getItem("token");
const res = await axios.get(
  `https://employee-payroll-management-system1.onrender.com/api/payroll/defaults?employeeName=${employeeName?.trim()}`,
  { headers: { Authorization: `Bearer ${token}` } }
);

   setFormData((prev) => ({
  ...prev,
  employeeName,
  hra: Number(res.data.hra || 0),
  bonus: Number(res.data.bonus || 0),
  deductions: Number(res.data.deductions || 0),
  overtime: Number(res.data.overtime || 0),   // ✅ from defaults
  extraOrders: Number(res.data.extraOrders || 0)
}));
  } catch (err) {
    console.error("DEFAULTS FETCH ERROR:", err);
  }
};

  // Handle field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Auto-calc totalDays when start/end dates change
  const { startDate, endDate } = formData;
  useEffect(() => {
    if (startDate && endDate) {
      // parse dates as local (avoid YYYY-MM-DD being treated as UTC)
      const s = new Date(startDate + "T00:00:00");
      const e = new Date(endDate + "T23:59:59.999");
      const msPerDay = 1000 * 60 * 60 * 24;
      const days = Math.floor((e - s) / msPerDay) + 1;
      if (!isNaN(days) && days > 0) {
        setFormData((prev) => ({ ...prev, totalDays: days }));
      }
    }
  }, [startDate, endDate]);
// Net salary calculation
const netSalary = formData.employeeName
  ? 30000 + // base salary
    Number(formData.hra || 0) +
    Number(formData.bonus || 0) +
    Number(formData.overtime || 0) * 100 +
    Number(formData.extraOrders || 0) * 50 -
    Number(formData.deductions || 0)
  : 0;

  // Generate new payslip
  const handleGenerate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://employee-payroll-management-system1.onrender.com/api/payroll/generate",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Payslip Generated Successfully ✅");
      setCurrentSlipId(res.data._id);
    } catch (err) {
  console.error("FULL ERROR:", err.response?.data || err.message);
  alert(err.response?.data?.message || "Error generating payslip ❌");
}
  };

  // Update existing payslip
  const handleUpdate = async () => {
  if (!currentSlipId) return alert("Generate a slip first!");

  try {
    const token = localStorage.getItem("token");

    const payload = {
      ...formData,
      employeeName: formData.employeeName, // ensure correct value
    };

    await axios.put(
      `https://employee-payroll-management-system1.onrender.com/api/payroll/update/${currentSlipId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Payslip Updated Successfully 🔄");
  } catch (err) {
    console.log("UPDATE ERROR:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Error updating payslip ❌");
  }
};

  // Download as PDF
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Salary Slip", 20, 20);
    doc.setFontSize(12);
    doc.text(`Employee: ${formData.employeeName}`, 20, 40);
    doc.text(`Start Date: ${formData.startDate}`, 20, 50);
    doc.text(`End Date: ${formData.endDate}`, 20, 60);
    doc.text(`HRA: ₹${formData.hra}`, 20, 70);
    doc.text(`Bonus: ₹${formData.bonus}`, 20, 80);
    doc.text(`Deductions: ₹${formData.deductions}`, 20, 90);
    doc.text(`Overtime Hours: ${formData.overtime}`, 20, 100);
    doc.text(`Extra Orders: ${formData.extraOrders}`, 20, 110);
    doc.text(`💰 Net Salary: ₹${netSalary}`, 20, 130);
    doc.save(`${formData.employeeName}_Payslip.pdf`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ ...styles.title, color: "#f5188de2" }}>
          Generate Salary Slip
        </h2>
        <div style={styles.note}>
          ⚠️ Note: Please ensure all salary inputs are correct before generating.
        </div>

        {/* Employee Selection */}
        <label style={styles.label}>Select Employee</label>
      <select
  name="employeeName"
  value={formData.employeeName}
  style={styles.input}
  onChange={(e) => {
    const selectedId = e.target.value.trim(); // ✅ trim spaces
    setFormData((prev) => ({ ...prev, employeeName: selectedId })); // set selected employee
    fetchDefaults(selectedId); // fetch defaults for this employee
  }}
>
  <option value="">--- Select Employee ---</option>
  {employees.map((emp) => (
    <option key={emp._id} value={emp._id}>
      {emp.name}
    </option>
  ))}
</select>

        {/* Date Range */}
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Start Date</label>
            <input
              type="date"
              name="startDate"
              style={styles.input}
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>End Date</label>
            <input
              type="date"
              name="endDate"
              style={styles.input}
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Manual Adjustments */}
        <h4 style={{ ...styles.sectionTitle, color: "#30ba44" }}>Manual Adjustments</h4>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>HRA</label>
            <input
              type="number"
              name="hra"
              placeholder="₹ Enter HRA"
              style={styles.input}
              value={formData.hra}
              onChange={handleChange}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Bonus</label>
            <input
              type="number"
              name="bonus"
              placeholder="₹ Enter Bonus"
              style={styles.input}
              value={formData.bonus}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Deductions</label>
          <input
            type="number"
            name="deductions"
            placeholder="₹ Enter deductions"
            style={styles.input}
            value={formData.deductions}
            onChange={handleChange}
          />
        </div>

        {/* ===== ATTENDANCE FIRST ===== */}
<h4 style={{ ...styles.sectionTitle, color: "#30ba44" }}>
  Attendance
</h4>

<div style={styles.row}>
  <div style={styles.field}>
    <label style={styles.label}>Total Days</label>
    <input
      type="number"
      name="totalDays"
      value={formData.totalDays}
      onChange={handleChange}
      style={styles.input}
    />
  </div>

  <div style={styles.field}>
    <label style={styles.label}>Present Days</label>
    <input
      type="number"
      name="presentDays"
      value={formData.presentDays}
      onChange={handleChange}
      style={styles.input}
    />
  </div>
</div>  

        {/* Productivity Metrics */}
        <h4 style={{ ...styles.sectionTitle, color: "#30ba44" }}>Productivity Metrics</h4>
        <div style={styles.row}>
          <div style={styles.field}>
           <label style={styles.label}>Overtime Hours</label>
           <input
             type="text"
             value={Number(formData.overtime || 0).toFixed(2)}
             readOnly
             style={{ ...styles.input, background: "#f3f4f6" }}
          />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Extra Orders</label>
            <input
              type="number"
              name="extraOrders"
              placeholder="Enter count"
              style={styles.input}
              value={formData.extraOrders}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Net Salary Box */}
        <div style={{ marginTop: "15px" }}>
          <label style={{ ...styles.label, fontWeight: 700 }}>💰 Net Salary</label>
          <input
            type="text"
            value={`₹ ${netSalary}`}
            readOnly
            style={{
              ...styles.input,
              background: "#fff0f6",
              color: "#ec4899",
              fontWeight: 700,
              fontSize: "16px",
              textAlign: "center"
            }}
          />
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "15px"
          }}
        >
          <button style={styles.btn} onClick={handleGenerate}>
            ✨ Generate Slip
          </button>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button style={styles.btn} onClick={handleUpdate}>
              🔄 Update Slip
            </button>
            <button
              style={{ ...styles.btn, background: "#3b82f6" }}
              onClick={handleDownload}
            >
              📄 Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    background: "linear-gradient(135deg,#eef2ff,#fce7f3)",
    minHeight: "100vh"
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "18px",
    maxWidth: "720px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },
  title: { textAlign: "center", marginBottom: "5px", fontWeight: 700, fontSize: "24px" },
  note: { background: "#fef3c7", padding: "10px", borderRadius: "8px", fontSize: "14px" },
  sectionTitle: { marginTop: "10px", fontWeight: 600, fontSize: "18px", color: "#14090e" },
  row: { display: "flex", gap: "15px" },
  field: { flex: 1, display: "flex", flexDirection: "column" },
  label: { fontSize: "14px", marginBottom: "5px", fontWeight: "500" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" },
  btn: {
    background: "linear-gradient(to right,#ec4899,#f97316)",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600"
  }
};

export default GeneratePayslips;
