import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaLock, FaEnvelope, FaFingerprint, FaArrowRight } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Responsive Logic for Mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Primary Glow Color for Login (Indigo)
  const glowColor = "#6366f1";

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), 
                      url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "20px"
    },
    glassCard: {
      width: isMobile ? "90%" : "100%",
      maxWidth: "400px",
      padding: isMobile ? "30px 20px" : "45px 40px",
      borderRadius: "32px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(15px)",
      border: `2px solid ${glowColor}`,
      boxShadow: `0 0 15px ${glowColor}aa, 0 0 35px ${glowColor}55, 0 20px 60px rgba(0,0,0,0.12)`,
      textAlign: "center"
    },
    inputGroup: {
      position: "relative",
      marginBottom: "18px",
      display: "flex",
      alignItems: "center"
    },
    icon: {
      position: "absolute",
      left: "18px",
      color: "#94a3b8",
      fontSize: "16px"
    },
    input: {
      width: "100%",
      padding: "14px 14px 14px 50px",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      background: "#fff",
      outline: "none",
      fontSize: "15px",
      transition: "0.3s",
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
    },
    button: {
      width: "100%",
      padding: "16px",
      borderRadius: "16px",
      border: "none",
      background: glowColor,
      color: "#fff",
      fontWeight: "800",
      fontSize: "16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      marginTop: "10px",
      boxShadow: `0 10px 20px ${glowColor}66`,
      transition: "0.3s"
    },
    messageBox: {
      marginTop: "20px",
      padding: "14px",
      borderRadius: "12px",
      fontSize: "13px",
      fontWeight: "700",
      background: message.isError ? "#fee2e2" : "#dcfce7",
      color: message.isError ? "#b91c1c" : "#15803d",
      display: message.text ? "block" : "none",
      border: message.isError ? "1px solid #fecaca" : "1px solid #bbf7d0"
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "Authenticating...", isError: false });
    
    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", formData);
      
      // ✅ FIX: Check the response structure
      // Your backend returns data directly, not wrapped in {data: {...}}
      const userData = response.data;
      
      console.log("Login response:", userData); // Debug log
      
      // ✅ Store token and user data correctly
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        designation: userData.designation
      }));
      
      setMessage({ text: "Success! Redirecting...", isError: false });
      
      // ✅ Redirect based on role
      setTimeout(() => {
        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else if (userData.role === "hr") {
          navigate("/hr-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }, 1000);
      
    } catch (err) {
      console.error("Login error:", err);
      setMessage({ 
        text: err.response?.data?.message || "Access Denied: Invalid Credentials", 
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        {/* Branding Icon */}
        <div style={{ 
          width: isMobile ? "60px" : "70px", 
          height: isMobile ? "60px" : "70px", 
          background: glowColor, 
          borderRadius: "22px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          margin: "0 auto 25px",
          boxShadow: `0 10px 25px ${glowColor}77`
        }}>
          <FaFingerprint size={isMobile ? 30 : 35} color="#fff" />
        </div>

        <h2 style={{ 
          color: "#1e293b", 
          margin: "0 0 8px 0", 
          fontWeight: "900", 
          fontSize: isMobile ? "24px" : "28px" 
        }}>
          Welcome Back
        </h2>
        <p style={{ 
          color: "#64748b", 
          fontSize: "14px", 
          marginBottom: "30px" 
        }}>
          Enter your credentials to secure access
        </p>
        
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.icon} />
            <input 
              type="email" 
              placeholder="Corporate Email" 
              required 
              style={styles.input}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              onFocus={(e) => e.target.style.borderColor = glowColor}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input 
              type="password" 
              placeholder="Secure Password" 
              required 
              style={styles.input}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              onFocus={(e) => e.target.style.borderColor = glowColor}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "SECURE LOGIN"} 
            {!loading && <FaArrowRight size={14} />}
          </button>
        </form>

        <div style={styles.messageBox}>{message.text}</div>

        <p style={{ marginTop: "30px", fontSize: "14px", color: "#64748b" }}>
          New team member? <Link to="/register" 
          style={{ 
            color: glowColor, 
            fontWeight: "800", 
            textDecoration: "none" 
          }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;