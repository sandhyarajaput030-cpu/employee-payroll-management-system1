import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaUserShield,
  FaBuilding
} from "react-icons/fa";

const useCounter = (end, duration = 2000, isVisible = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, isVisible]);
  return count;
};

const Home = () => {
  const navigate = useNavigate();
  const [showHero, setShowHero] = useState(false);
  const [revealFeatures, setRevealFeatures] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    const observerOptions = { threshold: 0.2 };
    const statsObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsStatsVisible(true);
    }, observerOptions);
    const featuresObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setRevealFeatures(true);
    }, observerOptions);

    if (statsRef.current) statsObserver.observe(statsRef.current);
    if (featuresRef.current) featuresObserver.observe(featuresRef.current);

    setTimeout(() => setShowHero(true), 200);
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("resize", handleResize);
      statsObserver.disconnect();
      featuresObserver.disconnect();
    };
  }, []);

  const companies = useCounter(50, 2000, isStatsVisible);
  const employees = useCounter(1500, 2000, isStatsVisible);
  const payslips = useCounter(3000, 2000, isStatsVisible);
  const accuracy = useCounter(99, 2000, isStatsVisible);

  const features = [
    { icon: <FaUsers />, title: "Employee Management", desc: "Manage employee records, departments, and roles efficiently in one system.", color: "#ff5722" },
    { icon: <FaMoneyBillWave />, title: "Payroll Processing", desc: "Automate salary calculations, deductions, and bonuses accurately.", color: "#4caf50" },
    { icon: <FaFileInvoiceDollar />, title: "Payslip Generation", desc: "Generate and download professional payslips instantly.", color: "#2196f3" },
    { icon: <FaUserShield />, title: "Secure Role Access", desc: "Role-based access for Admin, HR, and Employees.", color: "#9c27b0" }
  ];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#ffffff", overflowX: "hidden" }}>

      {/* 🔥 HERO SECTION */}
      <div style={{
        height: isMobile ? "90vh" : "85vh",
        backgroundImage: "url(https://cdn.prod.website-files.com/5fc4462337773c2fc7fcbcfb/6580cd25f6ccf3ca517d23a2_7%20must-have%20conference%20room%20tech%20tools%20for%20hybrid%20meetings.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fff",
        padding: "0 20px"
      }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)" }}></div>
        <div style={{
          position: "relative", zIndex: 2,
          opacity: showHero ? 1 : 0,
          transform: showHero ? "translateY(0)" : "translateY(40px)",
          transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
          <h1 style={{ fontSize: isMobile ? "45px" : "70px", color: "#ff9800", fontWeight: "800", lineHeight: "1.1" }}>PayNexa <FaBuilding /></h1>
          <p style={{ marginTop: "20px", maxWidth: "750px", lineHeight: "1.7", fontSize: isMobile ? "15px" : "18px", color: "#eee" }}>
           PayNexa is a modern payroll management system designed to simplify employee salary processing,
            automate payslip generation, and provide secure role-based access for Admin, HR, and Employees.
          </p>
          <div style={{ marginTop: "40px", display: "flex", flexDirection: isMobile ? "column" : "row", gap: "15px", alignItems: "center", justifyContent: "center" }}>
            <button onClick={() => navigate("/login")}
               style={{ padding: "15px 35px",
                borderRadius: "50px", 
                border: "none", 
                background: "linear-gradient(45deg,#ff9800,#ff5722)", 
                color: "#fff", cursor: "pointer", fontWeight: "bold", 
                width: isMobile ? "100%" : "auto", 
                boxShadow: "0 10px 25px rgba(255, 87, 34, 0.4)" }}>Get Started 🚀</button>

            <button onClick={() => navigate("/register")}
               style={{ padding: "15px 35px", 
               borderRadius: "50px", 
               border: "2px solid #fff", 
               background: "transparent", color: "#fff", 
               cursor: "pointer", fontWeight: "bold", 
               width: isMobile ? "100%" : "auto" }}>Join Now</button>
          </div>
        </div>
      </div>

      {/* 🔥 FEATURES SECTION (SHINE & ANIMATION RESTORED) */}
      {/* 🔥 FEATURES SECTION (TIGHTENED DISTANCE) */}
      <div ref={featuresRef} style={{ 
        padding: "40px 5%", // 👈 Reduced from 100px to 40px to close the gap
        backgroundColor: "#eef2f5" 
      }}>
        <h2 style={{ 
          textAlign: "center", 
          fontSize: isMobile ? "28px" : "36px", 
          fontWeight: "800", 
          marginBottom: "30px", // 👈 Reduced from 80px to 30px
          color: "#1a1a1a",
          opacity: revealFeatures ? 1 : 0, 
          transition: "opacity 1s ease"
        }}>
          Powerful Features
        </h2>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", 
          gap: "20px" // 👈 Tighter gap between cards
        }}>
          {features.map((f, i) => (
            <div key={i}
              style={{
                background: "#ffffff",
                padding: "30px 20px", // 👈 Reduced internal padding for a tighter look
                borderRadius: "15px",
                textAlign: "center",
                cursor: "pointer",
                borderBottom: `4px solid ${f.color}`,
                boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                opacity: revealFeatures ? 1 : 0,
                transform: revealFeatures ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${i * 0.1}s` 
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = `0 15px 30px ${f.color}44`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.05)";
              }}
            >
              <div style={{
                width: "50px", height: "50px", margin: "0 auto 15px", borderRadius: "10px",
                background: `${f.color}15`, color: f.color, fontSize: "22px",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "18px", marginBottom: "10px", fontWeight: "700", color: "#333" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.5" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 STATS SECTION (ORANGE) */}
      <div ref={statsRef} style={{
        background: "#ff9800", 
        padding: "80px 5%", 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row", 
        justifyContent: "space-around", 
        gap: isMobile ? "50px" : "0",
        color: "#ffffff", 
        textAlign: "center"
      }}>
        {[
          { icon: <FaBuilding size={35} />, val: companies, label: "Enterprises", suffix: "+" },
          { icon: <FaUsers size={35} />, val: employees, label: "Total Staff", suffix: "+" },
          { icon: <FaFileInvoiceDollar size={35} />, val: payslips, label: "Payslips Created", suffix: "+" },
          { icon: <FaUserShield size={35} />, val: accuracy, label: "Accuracy", suffix: "%" }
        ].map((stat, idx) => (
          <div key={idx} style={{ minWidth: "200px" }}>
            <div style={{ color: "#ffffff", marginBottom: "15px", opacity: 0.9 }}>{stat.icon}</div>
            <h1 style={{ fontSize: isMobile ? "45px" : "55px", fontWeight: "900", margin: 0 }}>{stat.val}{stat.suffix}</h1>
            <p style={{ textTransform: "uppercase", fontSize: "14px", letterSpacing: "2px", fontWeight: "600", marginTop: "10px" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* 🦶 MINIMALIST FOOTER */}
      <footer style={{ 
        padding: "60px 20px", 
        textAlign: "center", 
        background: "#ffffff", 
        color: "#1e293b", 
        borderTop: "1px solid #e2e8f0" 
      }}>
        <div style={{ marginBottom: "12px", fontSize: "18px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
          PayNexa <span style={{ color: "#ff9800" }}>Systems</span>
        </div>
        <p style={{ 
          fontSize: "14px", 
          color: "#64748b", 
          maxWidth: "700px", 
          margin: "0 auto", 
          lineHeight: "1.8",
          fontStyle: "italic"
        }}>
          Engineered for high-performance payroll automation. Built with precision to ensure financial accuracy and enterprise-grade security for the modern workforce.
        </p>
      </footer>
    </div>
  );
};

export default Home;