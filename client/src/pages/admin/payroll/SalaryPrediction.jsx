import React, { useEffect, useState } from "react";
import axios from "axios";

const SalaryPrediction = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPrediction();
  }, []);

 const fetchPrediction = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "https://employee-payroll-management-system1.onrender.com/api/payroll/prediction",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("PREDICTION DATA:", res.data);
const result = res.data;

setData(
  Array.isArray(result)
    ? result
    : result.data || result.predictions || []
);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <h1 style={styles.title}>Next Month's Salary Prediction</h1>

        <div style={styles.infoBox}>
          This report uses a <b>Linear Regression Model</b> based on past salary slips 
          to predict the <b>Net Salary</b> for the upcoming month. 
          Predictions require at least <b>two past salary records</b>.
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Employee Name</th>
                <th style={styles.th}>Last Net Salary</th>
                <th style={styles.th}>Last Pay Period</th>
                <th style={styles.th}>Predicted Net Salary</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((emp, index) => (
                  <tr key={index} style={styles.tr}>
                   <td style={styles.td}>{emp.employeeName}</td>
                   <td style={styles.td}>₹{emp.lastSalary}</td>
                   <td style={styles.td}>{emp.period}</td>
                   <td style={styles.predicted}>₹{emp.predictedSalary}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    No prediction data available
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
 
  </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "30px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd, #fce4ec)"
  },

  card: {
    width: "95%",
    maxWidth: "1100px",
    background: "#fff",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
  },

  title: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #7b1fa2, #e91e63)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "20px"
  },

  infoBox: {
    background: "#e3f2fd",
    padding: "15px",
    borderLeft: "6px solid #2196f3",
    borderRadius: "8px",
    marginBottom: "25px",
    fontSize: "15px"
  },

  tableWrapper: {
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  thead: {
    background: "linear-gradient(90deg, #1976d2, #26c6da)",
    color: "white"
  },

  th: {
    padding: "15px",
    textAlign: "left"
  },

  td: {
    padding: "15px",
    borderBottom: "1px solid #eee"
  },

  tr: {
    transition: "0.3s"
  },

  predicted: {
    padding: "15px",
    color: "green",
    fontWeight: "bold"
  }
};

export default SalaryPrediction;
