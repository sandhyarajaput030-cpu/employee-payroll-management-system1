import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ FIXED DATE FORMAT (NO TIMEZONE ISSUE)
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
  const fetchAttendance = async () => {
    try {
      const month = currentDate.toISOString().slice(0, 7); // YYYY-MM

const res = await axios.get(
  `https://employee-payroll-management-system1.onrender.com`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);
      const today = new Date();

const filteredData = res.data.filter((record) => {
  const recordDate = new Date(record.date);

  return (
    recordDate.getMonth() === currentDate.getMonth() &&
    recordDate.getFullYear() === currentDate.getFullYear() &&
    recordDate <= today   // ❗ REMOVE FUTURE DATES
  );
});

setAttendanceData(filteredData);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  fetchAttendance();
}, [token, currentDate]);

console.log(attendanceData);

// ✅ SAME LOGIC AS ADMIN DASHBOARD


  // 📅 Get days
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

   const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth();

  // 🎯 Click date
  const handleDateClick = (date) => {
    setSelectedDate(date);

    const record = attendanceData.find(
  (item) => formatDate(item.date) === formatDate(date)
);

    setSelectedRecord(record || null);
  };

  // 📌 Status


  const statusColor = {
    Present: "#28a745",
    Absent: "#dc3545",
    Leave: "#f0ad4e",
    "Half Day": "#007bff",
  };

  // 📊 Summary

const summary = {
  Present: attendanceData.filter((a) => a.status === "Present").length,
  Absent: attendanceData.filter((a) => a.status === "Absent").length,
  Leave: attendanceData.filter((a) => a.status === "Leave").length,
  "Half Day": attendanceData.filter((a) => a.status === "Half Day").length,
};

  return (
    <div
      style={{
        background: "linear-gradient(to right, #fdfbfb, #ebedee)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1,
                  1
                )
              )
            }
          >
            ←
          </button>

          <h2>
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button
            onClick={() =>
              setCurrentDate(
                new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  1
                )
              )
            }
          >
            →
          </button>
        </div>

        {/* SUMMARY */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          {Object.keys(summary).map((key) => (
            <div
              key={key}
              style={{
                flex: 1,
                background: statusColor[key],
                color: "#fff",
                borderRadius: "10px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <h3>{summary[key]}</h3>
              <p style={{ fontSize: "12px" }}>{key}</p>
            </div>
          ))}
        </div>

        {/* CALENDAR */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "6px",
            marginTop: "20px",
          }}
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} style={{ textAlign: "center", fontWeight: "bold" }}>
              {d}
            </div>
          ))}

          {days.map((day, i) => {
           const today = new Date();

const record =
  day && day <= today
    ? attendanceData.find(
        (item) => formatDate(item.date) === formatDate(day)
      )
    : null;

const status = record ? record.status : null;

            return (
              <div
                key={i}
                onClick={() => day && handleDateClick(day)}
                style={{
                  height: "55px",
                  borderRadius: "6px",
                  background: "#f9f9f9",
                  textAlign: "center",
                  cursor: day ? "pointer" : "default",
                  padding: "4px",
                }}
              >
                {day && (
                  <>
                    <div style={{ fontSize: "12px", fontWeight: "500" }}>
                      {day.getDate()}
                    </div>

                    {status && (
                      <div
                        style={{
                          marginTop: "4px",
                          fontSize: "10px",
                          background: statusColor[status],
                          color: "#fff",
                          borderRadius: "4px",
                          padding: "2px",
                        }}
                      >
                        {status}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* DETAILS */}
        {selectedDate && (
          <div
            style={{
              marginTop: "20px",
              background: "#f4f6f8",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <h4>{selectedDate.toDateString()}</h4>

            {selectedRecord ? (
              <>
                <p>
                  ⏰ In:{" "}
                  {selectedRecord.checkIn
                    ? new Date(
                        selectedRecord.checkIn
                      ).toLocaleTimeString()
                    : "-"}
                </p>

                <p>
                  ⏰ Out:{" "}
                  {selectedRecord.checkOut
                    ? new Date(
                        selectedRecord.checkOut
                      ).toLocaleTimeString()
                    : "-"}
                </p>

                <p>
                  🕒 Work Hours:{" "}
                  {selectedRecord.checkIn &&
                  selectedRecord.checkOut
                    ? (
                        (new Date(selectedRecord.checkOut) -
                          new Date(selectedRecord.checkIn)) /
                        (1000 * 60 * 60)
                      ).toFixed(1)
                    : "-"}{" "}
                  hrs
                </p>

                <span
                  style={{
                   background: statusColor[selectedRecord?.status] || "#999",
                    color: "#fff",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                  }}
                >
                  {selectedRecord?.status}
                </span>
              </>
            ) : (
              <p>No record</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAttendance;
