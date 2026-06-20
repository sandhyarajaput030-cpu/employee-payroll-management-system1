import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const HRManagers = () => {
  const [hrs, setHrs] = useState([]);
  const [selectedHR, setSelectedHR] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:8000/api";

  // ✅ FETCH
  const fetchHRs = useCallback(async () => {
    const res = await axios.get(`${API_URL}/hr`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setHrs(res.data);
  }, [API_URL, token]);

  useEffect(() => {
    fetchHRs();
  }, [fetchHRs]);

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this HR?")) return;

    await axios.delete(`${API_URL}/hr/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchHRs();
  };

  // ✅ UPDATE
  const handleUpdate = async () => {
    await axios.put(
      `${API_URL}/hr/${selectedHR._id}`,
      selectedHR,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setShowEditModal(false);
    fetchHRs();
  };

  // ✅ ADD
  const handleAdd = async () => {
    await axios.post(`${API_URL}/hr`, selectedHR, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("HR added successfully");
    setShowAddModal(false);
    setSelectedHR(null);
    fetchHRs();
  };

  // ✅ FILTER
  const filteredHRs = hrs.filter(hr => {
    return (
      (hr.name?.toLowerCase().includes(search.toLowerCase()) ||
        hr.email?.toLowerCase().includes(search.toLowerCase())) &&
      (department ? hr.department === department : true)
    );
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>HR Management</h2>
      <p style={styles.subtitle}>Manage HR managers efficiently</p>

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <div style={styles.searchBox}>
          <FaSearch style={{ marginRight: 8 }} />
          <input
            placeholder="Search HR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select onChange={(e) => setDepartment(e.target.value)} style={styles.dropdown}>
          <option value="">Departments</option>
          <option>Human Resources Executive</option>
          <option>Payroll & Compliance</option>
          <option>Learning & Development</option>
          <option>HR Executive</option>
          <option>HR Operations</option>
        </select>

        <button
          style={styles.addBtn}
          onClick={() => {
            setSelectedHR({
              name: "",
              email: "",
              password: "",
              department: "",
              designation: "",
              contact: ""
            });
            setShowAddModal(true);
          }}
        >
          + Add HR
        </button>
      </div>

      {/* TABLE */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.header}>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredHRs.map(hr => (
            <tr key={hr._id} style={styles.row}>
              <td style={styles.id}>HR{hr._id.slice(-5)}</td>

              <td style={styles.nameCell}>
                <div style={styles.avatar}>
                  {hr.name?.charAt(0)}
                </div>
                {hr.name}
              </td>

              <td>{hr.email}</td>
              <td>{hr.contact || "-"}</td>
              <td>{hr.department}</td>
              <td>{hr.designation}</td>

              <td>
                <FaEye style={styles.icon} onClick={() => {
                  setSelectedHR(hr);
                  setShowViewModal(true);
                }} />

                <FaEdit style={{ ...styles.icon, color: "green" }} onClick={() => {
                  setSelectedHR(hr);
                  setShowEditModal(true);
                }} />

                <FaTrash style={{ ...styles.icon, color: "red" }} onClick={() => handleDelete(hr._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* VIEW MODAL */}
      {showViewModal && selectedHR && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>HR Details</h3>
            <p><b>Name:</b> {selectedHR.name}</p>
            <p><b>Email:</b> {selectedHR.email}</p>
            <p><b>Department:</b> {selectedHR.department}</p>
            <p><b>Designation:</b> {selectedHR.designation}</p>
            <p><b>Contact:</b> {selectedHR.contact}</p>

            <div style={styles.modalBtns}>
              <button onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(showEditModal || showAddModal) && selectedHR && (
        <div style={styles.overlay}>
          <div style={styles.modalNew}>
            <h3>{showEditModal ? "Edit HR" : "Add HR"}</h3>

            <div style={styles.formGrid}>
              <input style={styles.input} placeholder="Name"
                value={selectedHR.name}
                onChange={(e) => setSelectedHR({ ...selectedHR, name: e.target.value })} />

              <input style={styles.input} placeholder="Email"
                value={selectedHR.email}
                onChange={(e) => setSelectedHR({ ...selectedHR, email: e.target.value })} />

              {!showEditModal && (
          <input 
            style={styles.input} 
            placeholder="Password"
            type="password"
            value={selectedHR.password || ''}
            onChange={(e) => setSelectedHR({ ...selectedHR, password: e.target.value })} 
          />
        )}

              <input style={styles.input} placeholder="Department"
                value={selectedHR.department}
                onChange={(e) => setSelectedHR({ ...selectedHR, department: e.target.value })} />

              <input style={styles.input} placeholder="Designation"
                value={selectedHR.designation}
                onChange={(e) => setSelectedHR({ ...selectedHR, designation: e.target.value })} />

              <input style={styles.input} placeholder="Contact"
                value={selectedHR.contact}
                onChange={(e) => setSelectedHR({ ...selectedHR, contact: e.target.value })} />
            </div>

            <div style={styles.modalBtns}>
              <button onClick={() => {
                setShowEditModal(false);
                setShowAddModal(false);
              }}>Cancel</button>

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
    width: 35,
    height: 35,
    borderRadius: "50%",
    background: "#4f8cff",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  icon: { marginRight: 10, cursor: "pointer" },

  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 350,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  modalNew: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 500,
    maxHeight: "80vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 15
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 15
  },

  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    width: "100%"
  },

  modalBtns: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10
  }
};

export default HRManagers;