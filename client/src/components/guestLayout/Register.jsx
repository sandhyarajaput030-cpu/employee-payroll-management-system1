import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaLock, FaEnvelope, FaUserPlus, 
  FaUserTie, FaUsers, FaUser, FaBriefcase, FaIdCard 
} from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    department: "", 
    designation: "",
    role: "employee" // Default remains employee
  });
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [message, setMessage] = useState({ text: "", isError: false });
  const navigate = useNavigate();

  // Admin color kept here just in case, but button is removed below
  const roleColors = { 
    admin: "#6366f1", 
    hr: "#0ea5e9", 
    employee: "#10b981" 
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), 
                        url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "20px"
    },
    glassCard: {
      width: "100%",
      maxWidth: "480px",
      padding: isMobile ? "25px 20px" : "35px",
      borderRadius: "28px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(12px)",
      border: `2px solid ${roleColors[formData.role]}`,
      boxShadow: `0 0 15px ${roleColors[formData.role]}aa, 0 20px 50px rgba(0,0,0,0.1)`,
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
    },
    inputGroup: {
      position: "relative",
      marginBottom: "15px",
      display: "flex",
      alignItems: "center"
    },
    icon: {
      position: "absolute",
      left: "15px",
      color: "#64748b",
      fontSize: "14px"
    },
    input: {
      width: "100%",
      padding: "12px 12px 12px 45px",
      borderRadius: "14px",
      border: "1px solid #cbd5e1",
      background: "#fff",
      outline: "none",
      fontSize: "14px",
      transition: "0.3s"
    },
    messageBox: {
      marginTop: "15px",
      padding: "12px",
      borderRadius: "12px",
      textAlign: "center",
      fontSize: "13px",
      fontWeight: "700",
      background: message.isError ? "#fee2e2" : "#dcfce7",
      color: message.isError ? "#b91c1c" : "#15803d",
      display: message.text ? "block" : "none",
      border: message.isError ? "1px solid #fecaca" : "1px solid #bbf7d0"
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ text: "Registering Profile...", isError: false });
    try {
      await axios.post("http://localhost:8000/api/auth/register", formData);
      setMessage({ text: `Registration Successful! Log in as ${formData.role.toUpperCase()}`, isError: false });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Registration Failed", isError: true });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
           <FaUserPlus size={isMobile ? 32 : 40} color={roleColors[formData.role]} />
           <h2 style={{ 
            color: "#1e293b", 
            margin: "10px 0 2px 0", 
            fontWeight: "900", 
            fontSize: isMobile ? "24px" : "28px" }}>Sign Up</h2>
           <p style={{ color: "#64748b", fontSize: "14px" }}>Account Type: <b>{formData.role.toUpperCase()}</b></p>
        </div>
        
        <form onSubmit={handleRegister}>
          {/* ✅ REMOVED ADMIN BUTTON FROM THIS LIST */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            {[['hr', <FaUserTie />], ['employee', <FaUsers />]].map(([r, icon]) => (
              <button 
                key={r} 
                type="button" 
                onClick={() => setFormData({...formData, role: r})}
                style={{ 
                  flex: 1, padding: "12px 5px", borderRadius: "15px", border: "none", cursor: "pointer",
                  background: formData.role === r ? roleColors[r] : "#f1f5f9",
                  color: formData.role === r ? "#fff" : "#64748b", 
                  transition: "0.4s ease", 
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "5px",
                  boxShadow: formData.role === r ? `0 5px 15px ${roleColors[r]}55` : "none"
                }}
              >
                {icon} <span style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase" }}>{r}</span>
              </button>
            ))}
          </div>

          <div style={styles.inputGroup}>
            <FaUser style={styles.icon} />
            <input 
              type="text" 
              placeholder="Full Name" 
              required 
              style={styles.input}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            />
          </div>

          <div style={{ 
            display: "flex", 
            gap: "10px", 
            flexDirection: isMobile ? "column" : "row",
            transition: "0.3s" 
          }}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <FaBriefcase style={styles.icon} />
              <input 
                type="text" 
                placeholder="Dept" 
                required 
                style={styles.input}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })} 
              />
            </div>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <FaIdCard style={styles.icon} />
              <input 
                type="text" 
                placeholder="Designation" 
                required 
                style={styles.input}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })} 
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.icon} />
            <input 
              type="email" 
              placeholder="Corporate Email" 
              required 
              style={styles.input}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              style={styles.input}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            />
          </div>

          <button type="submit" style={{ 
            width: "100%", padding: "15px", borderRadius: "14px", border: "none",
            background: roleColors[formData.role], color: "#fff", fontWeight: "900", 
            cursor: "pointer", fontSize: "16px",
            boxShadow: `0 0 20px ${roleColors[formData.role]}88`, 
            marginTop: "10px", transition: "0.3s"
          }}>
            REGISTER AS {formData.role.toUpperCase()}
          </button>
        </form>

        <div style={styles.messageBox}>{message.text}</div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#64748b" }}>
          Already have an account? <Link to="/login" 
          style={{ 
            color: roleColors[formData.role], 
            fontWeight: "800",
            textDecoration: "none" }}>Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;