import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("token");
  const API_URL = "https://employee-payroll-management-system1.onrender.com/api";

  const fetchEmployees = useCallback(async () => {
    const res = await axios.get(`${API_URL}/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEmployees(res.data.data);
  }, [API_URL, token]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // DELETE WITH CONFIRM
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    await axios.delete(`${API_URL}/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchEmployees();
  };

  // UPDATE
  const handleUpdate = async () => {
    await axios.put(
      `${API_URL}/employees/${selectedEmployee._id}`,
      selectedEmployee,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setShowEditModal(false);
    fetchEmployees();
  };

  // ADD
 const handleAdd = async () => {
  try {
    const payload = {
      name: selectedEmployee.name,
      email: selectedEmployee.email,
      password: selectedEmployee.password,
      department: selectedEmployee.department,
      position: selectedEmployee.position,
      contact: selectedEmployee.contact,
      salary: {
        basic: selectedEmployee.salary?.basic || 0,
        allowances: 0,
        deductions: 0
      }
    };

    console.log("Sending payload:", payload);

    await axios.post(`${API_URL}/employees`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Employee added successfully");

    setShowAddModal(false);
    setSelectedEmployee(null);
    fetchEmployees();

  } catch (error) {
    console.log(error.response?.data);
    alert(error.response?.data?.message || "Error adding employee");
  }
};

  // FILTER LOGIC
  const filteredEmployees = employees.filter(emp => {
    return (
      (emp.name?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email?.toLowerCase().includes(search.toLowerCase())) &&
      (department ? emp.department === department : true) &&
      (status
        ? status === "Active"
          ? emp.isActive
          : !emp.isActive
        : true)
    );
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Employee Management</h2>
      <p style={styles.subtitle}>Manage your workforce efficiently</p>

      {/* 🔍 TOP BAR */}
      <div style={styles.topBar}>
        <div style={styles.searchBox}>
          <FaSearch style={{ marginRight: 8 }} />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select onChange={(e) => setDepartment(e.target.value)} style={styles.dropdown}>
          <option value="">Departments</option>
          <option>IT</option>
          <option>HR</option>
          <option>Marketing</option>
          <option>Finance</option>
          <option>Sales</option>
          <option>Administration</option>
          <option>Customer Support</option>
          <option>Production</option>
          <option>Research & Development</option>
          <option>QA</option>
        </select>

        <select onChange={(e) => setStatus(e.target.value)} style={styles.dropdown}>
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

       <button
  style={styles.addBtn}
  onClick={() => {
  setSelectedEmployee({
    name: "",
    email: "",
    password: "",
    department: "",
    position: "",
    contact: "",
    salary: {
      basic: "",
      allowances: "",
      deductions: ""
    }
  });
  setShowAddModal(true);
}}
> 

          + Add Employee
        </button>
      </div>

      {/* TABLE */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.header}>
            <th>ID</th><th>Name</th><th>Email</th>
            <th>Contact</th>
            <th>Department</th><th>Position</th>
            <th>Status</th><th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp._id} style={styles.row}>
              <td style={styles.id}>EMP{emp._id.slice(-6)}</td>

              <td style={styles.nameCell}>
                <div style={styles.avatar}>
                  {emp.name?.charAt(0)}
                </div>
                {emp.name}
              </td>

              <td>{emp.email}</td>
              <td>{emp.contact || "-"}</td> 
              <td>{emp.department}</td>
              <td>{emp.position}</td>

              <td>
                <span style={emp.isActive ? styles.active : styles.inactive}>
                  {emp.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td>
                <FaEye style={styles.icon} onClick={() => {
                  setSelectedEmployee(emp);
                  setShowViewModal(true);
                }} />

                <FaEdit style={{ ...styles.icon, color: "green" }} onClick={() => {
                  setSelectedEmployee(emp);
                  setShowEditModal(true);
                }} />

                <FaTrash style={{ ...styles.icon, color: "red" }} onClick={() => handleDelete(emp._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* VIEW MODAL */}
     {showViewModal && selectedEmployee && (
  <div style={styles.overlay}>
    <div style={{ ...styles.modal, width: 400 }}>
      <h3>Employee Details</h3>

      <p><b>Name:</b> {selectedEmployee.name}</p>
      <p><b>Email:</b> {selectedEmployee.email}</p>
      <p><b>Department:</b> {selectedEmployee.department}</p>
      <p><b>Position:</b> {selectedEmployee.position}</p>
      <p><b>Contact:</b> {selectedEmployee.contact}</p>

      {/* ✅ FIXED SALARY DISPLAY */}
      <p>
  <b>Salary:</b>{" "}
  {typeof selectedEmployee.salary === "object"
    ? selectedEmployee.salary.basic || 0
    : selectedEmployee.salary || 0}
</p> 

      <div style={styles.modalBtns}>
       <button onClick={() => {
  setShowViewModal(false);
  setSelectedEmployee(null);
}}>
  Close
</button>
      </div>
    </div>
  </div>
)}

      {/* EDIT + ADD MODAL */}
   {(showEditModal || showAddModal) && selectedEmployee && (
  <div style={styles.overlay}>
    <div style={styles.modalNew}>
      <h3>{showEditModal ? "Edit Employee" : "Add Employee"}</h3>

      <div style={styles.formGrid}>
        <div>
          <label style={styles.label}>Full Name</label>
         <input
  style={styles.input}
  value={selectedEmployee.name || ""}
  onChange={(e) =>
    setSelectedEmployee(prev => ({
      ...prev,
      name: e.target.value
    }))
  }
/>
        </div>

        <div>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            value={selectedEmployee.email || ""}
           onChange={(e) =>
  setSelectedEmployee(prev => ({
    ...prev,
    email: e.target.value
  }))
}
          />
        </div>

        <div>
  <label style={styles.label}>Password</label>
  <input
    type="password"
    style={styles.input}
    value={selectedEmployee.password || ""}
    onChange={(e) =>
      setSelectedEmployee(prev => ({
        ...prev,
        password: e.target.value
      }))
    }
  />
</div>

        <div>
          <label style={styles.label}>Department</label>
          <select
            style={styles.input}
            value={selectedEmployee.department || ""}
            onChange={(e) =>
  setSelectedEmployee(prev => ({
    ...prev,
    department: e.target.value
  }))
}
          >
            <option value="">Select</option>
            <option>IT</option>
            <option>HR</option>
            <option>Marketing</option>
            <option>Finance</option>
            <option>Sales</option>
            <option>Administration</option>
            <option>Customer Support</option>
            <option>Production</option>
            <option>Research & Development</option>
            <option>QA</option>
          </select>
        </div>

        <div>
          <label style={styles.label}>Position</label>
          <input
            style={styles.input}
            value={selectedEmployee.position || ""}
           onChange={(e) =>
  setSelectedEmployee(prev => ({
    ...prev,
    position: e.target.value
  }))
}
          />
        </div>

        <div>
          <label style={styles.label}>Contact</label>
          <input
            style={styles.input}
            value={selectedEmployee.contact || ""}
           onChange={(e) =>
  setSelectedEmployee(prev => ({
    ...prev,
    contact: e.target.value
  }))
}
          />
        </div>

        <div>
          <label style={styles.label}>Salary</label>
          <input
            style={styles.input}
            value={
  typeof selectedEmployee.salary === "object"
    ? selectedEmployee.salary.basic || ""
    : selectedEmployee.salary || ""
}
           onChange={(e) =>
    setSelectedEmployee(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        basic: e.target.value
      }
    }))
  }
/>
        
        </div>
      </div>

      <div style={styles.modalBtns}>
        <button onClick={() => {
          setShowEditModal(false);
          setShowAddModal(false);
        }}>
          Cancel
        </button>

        <button onClick={showEditModal ? handleUpdate : handleAdd}>
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

const styles = {

  modalNew: {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  width: 500,
  maxHeight: "80vh",   // ✅ prevents modal going up
  overflowY: "auto",   // ✅ adds scroll
  display: "flex",
  flexDirection: "column",
  gap: 15
},

formGrid: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",  // ✅ 2 column layout
  gap: 15
},

  container: { padding: 20, background: "#f5f7fb" },
  title: { fontSize: 22, fontWeight: 600 },
  subtitle: { color: "#777", marginBottom: 15 },

  topBar: { display: "flex", gap: 10, marginBottom: 15 },

  searchBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    padding: "6px 10px",
    borderRadius: 8,
    flex: 1
  },

   label: {
    fontSize: "13px",
    fontWeight: "500",
    marginTop: "5px"
  },

  input: {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  marginTop: "4px",
  outline: "none",
  width: "100%"
},

  searchInput: { border: "none", outline: "none", width: "100%" },

  dropdown: { padding: "6px 10px", borderRadius: 8 },

 addBtn: {
  background: "#4f8cff",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: "500"
},

  table: { width: "100%", background: "#fff" },
  header: { background: "#f1f3f5" },
  row: { borderBottom: "1px solid #eee" },

  id: { color: "#4f8cff" },

  nameCell: { display: "flex", alignItems: "center", gap: 10 },

  avatar: {
    width: 35, height: 35, borderRadius: "50%",
    background: "#4f8cff", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center"
  },

  active: { background: "#d1fae5", padding: "4px 10px", borderRadius: 20 },
  inactive: { background: "#fee2e2", padding: "4px 10px", borderRadius: 20 },

  icon: { marginRight: 10, cursor: "pointer" },

  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex", justifyContent: "center", alignItems: "center"
  },

  modal: {
    background: "#fff", padding: 20, borderRadius: 10,
    width: 350, display: "flex", flexDirection: "column", gap: 10
  },
modalBtns: {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 10
},

};

export default Employees;
