import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewPayslips = () => {
  const navigate = useNavigate();

  const [showTable, setShowTable] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState([]);   // 🔥 dynamic employees
  const [slips, setSlips] = useState([]);           // 🔥 dynamic slips

  // ✅ Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:8000/api/employees", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("EMP DATA:", res.data);
    setEmployees(res.data.data);

  } catch (err) {
    console.error("EMP ERROR:", err);
  }
};

  // ✅ Fetch slips for selected employee
  const handleLoad = async () => {
   if (!selectedEmployee) {
  alert("Please select employee");
  return;
}

 try {
const token = localStorage.getItem("token");

const res = await axios.get(
  `http://localhost:8000/api/payroll/${selectedEmployee}`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

      setSlips(res.data);
      setShowTable(true);
    } catch (err) {
      console.error(err);
      alert("Error loading slips ❌");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0e7ff, #fce7f3)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}>
      <div style={{
        width: "80%",
        background: "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>

        {/* Heading */}
        <h2 style={{
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "700",
          background: "linear-gradient(90deg, #7c3aed, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          View Employee Salary Slips
        </h2>

        {/* Select + Button */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "20px"
        }}>
          <select
           value={selectedEmployee}
           onChange={(e) => setSelectedEmployee(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              minWidth: "200px"
            }}
          >
             <option value="">--- Select an Employee ---</option>

  {employees.map((emp) => (
    <option key={emp._id} value={emp.name}>
      {emp.name}
    </option>
  ))}
</select>

          <button onClick={handleLoad} style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            color: "#fff",
            cursor: "pointer"
          }}>
            Load Slips
          </button>
        </div>

        {/* Selected Employee */}
        {showTable && (
          <p style={{ textAlign: "center", marginBottom: "15px" }}>
            Showing Slips for: <b>{selectedEmployee}</b>
          </p>
        )}

        {/* Table */}
        {showTable && (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center"
          }}>
            <thead style={{
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              color: "#fff"
            }}>
              <tr>
                <th style={{ padding: "12px" }}>Pay Period</th>
                <th>Net Salary</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {slips.map((s, index) => (
                <tr key={index}>
                  <td style={{ padding: "12px" }}>{s.period}</td>

                  <td style={{ color: "green", fontWeight: "600" }}>
                    ₹{s.netSalary}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                       navigate("/payslip-view", {
                       state: {
                      employee: selectedEmployee,
                      slip: s
               }
 })
                      }
                      style={{
                        marginRight: "10px",
                        background: "#3b82f6",
                        color: "#fff",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginTop: "10px"
                      }}
                    >
                      View
                    </button>

                    <button style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};

export default ViewPayslips;