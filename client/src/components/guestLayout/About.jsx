import React, { useEffect, useState } from "react";
import { FaShieldAlt, FaChartLine, FaCogs, FaArrowLeft, FaLock, FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    window.scrollTo(0, 0);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#fff", color: "#1a1a1a" }}>
      
      {/* 🏔️ HERO SECTION - IMAGE BEHIND TEXT */}
      <div style={{
        height: "50vh",
        backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fff",
        padding: "0 20px"
      }}>
        <h1 style={{ fontSize: isMobile ? "36px" : "60px", fontWeight: "800", margin: 0 }}>
          About <span style={{ color: "#ff9800" }}>PayNexa</span>
        </h1>
        <p style={{ marginTop: "10px", fontSize: isMobile ? "16px" : "20px", maxWidth: "700px", opacity: 0.9 }}>
          Redefining payroll management through precision engineering and modern automation.
        </p>
      </div>

      {/* 📖 THE VISION SECTION - TIGHTER SPACING & ORIGINAL IMAGE */}
      <div style={{
        padding: isMobile ? "40px 20px" : "60px 10%",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        gap: "40px", // Reduced distance
        backgroundColor: "#ffffff"
      }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "20px", color: "#0f172a" }}>
            The Vision Behind PayNexa
          </h2>
          <p style={{ lineHeight: "1.6", color: "#4b5563", fontSize: "16px", marginBottom: "25px" }}>
            PayNexa was born out of a simple necessity: the need for a payroll system that doesn't just calculate numbers, but actively manages business growth. 
            Built on the <strong>MERN Stack</strong>, our platform provides a seamless bridge between HR management and financial accuracy.
          </p>
          
          {/* STEP BY STEP WITH ICONS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: <FaCogs color="#ff9800" />, text: "Automated Deductions" },
              { icon: <FaChartBar color="#ff9800" />, text: "Real-time Analytics" },
              { icon: <FaLock color="#ff9800" />, text: "Secure Data Vault" }
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                {item.icon} <span style={{ fontWeight: "700", fontSize: "15px" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
            alt="Original Data Analysis" 
            style={{ width: "100%", borderRadius: "12px", boxShadow: "15px 15px 0px #ff9800" }} 
          />
        </div>
      </div>

      {/* 💎 CORE PRINCIPLES - DARK THEME TO REMOVE WHITE SPACE FEEL */}
      <div style={{ 
        padding: isMobile ? "60px 20px" : "80px 10%", 
        backgroundColor: "#0f172a", // Dark background makes colors pop and removes "boring white space"
        color: "#fff" 
      }}>
        <h2 style={{ textAlign: "center", fontSize: "32px", fontWeight: "800", marginBottom: "50px" }}>
            Our <span style={{ color: "#ff9800" }}>Core Principles</span>
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "20px" }}>
          {[
            { icon: <FaShieldAlt color="#ff9800" />, title: "Enterprise Security", desc: "Data integrity via industry-standard encryption protocols.", color: "#ff9800" },
            { icon: <FaCogs color="#4caf50" />, title: "Smart Automation", desc: "Intelligent payroll logic designed to eliminate manual entry.", color: "#4caf50" },
            { icon: <FaChartLine color="#2196f3" />, title: "High Performance", desc: "Optimized for speed and sub-second accuracy in processing.", color: "#2196f3" }
          ].map((v, i) => (
            <div key={i} style={{ 
              padding: "30px", 
              borderRadius: "12px", 
              background: "rgba(255, 255, 255, 0.05)", 
              borderTop: `4px solid ${v.color}`,
              transition: "transform 0.3s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ fontSize: "30px", marginBottom: "15px" }}>{v.icon}</div>
              <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px" }}>{v.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.5" }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🛠️ TECH STACK & BUTTON */}
      <div style={{ padding: "60px 20px", textAlign: "center", backgroundColor: "#ffffff" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "15px" }}>Precision Engineered with MERN</h2>
        <p style={{ maxWidth: "700px", margin: "0 auto 30px", color: "#64748b", lineHeight: "1.6" }}>
          PayNexa utilizes <strong>MongoDB</strong>, <strong>Express</strong>, <strong>React</strong>, and <strong>Node.js</strong> for speed and security.
        </p>
        <button 
          onClick={() => navigate("/")}
          style={{ 
            padding: "15px 40px", background: "#ff9800", color: "#fff", border: "none", 
            fontWeight: "800", borderRadius: "8px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px" 
          }}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>

    </div>
  );
};

export default About;