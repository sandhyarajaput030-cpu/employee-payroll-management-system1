import React, { useState, useEffect } from "react";
import { FaFingerprint, FaRocket, FaShieldVirus, FaChartBar, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const Services = () => {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const services = [
    { title: "Payroll Engine", desc: "Precision math with 99.9% accuracy.", icon: <FaRocket />, color: "#ff9800", details: ["Instant Disbursements", "Tax Automation", "One-Click Processing"] },
    { title: "Security Vault", desc: "Bank-grade AES-256 encryption.", icon: <FaFingerprint />, color: "#2196f3", details: ["Data Encryption", "Audit Logs", "Secure Access"] },
    { title: "Compliance Hub", desc: "Automatic Labor Law updates.", icon: <FaShieldVirus />, color: "#4caf50", details: ["Legal Sync", "Tax Compliance", "Policy Updates"] },
    { title: "Power Analytics", desc: "Visualizing your financial growth.", icon: <FaChartBar />, color: "#9c27b0", details: ["Custom Reports", "Cost Tracking", "Visual Trends"] }
  ];

  return (
    <div style={{ 
      padding: isMobile ? "60px 20px" : "80px 10%", 
      // 👇 NEW CLEARER IMAGE: High-contrast Architecture
      backgroundImage: `linear-gradient(rgba(10, 15, 24, 0.7), rgba(10, 15, 24, 0.8)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=100&w=2000')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed", 
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden",
      minHeight: "850px"
    }}>
      
      {/* 🌌 DYNAMIC BACKGROUND NEON ORBS */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: "450px", height: "450px", background: services[active].color, filter: "blur(180px)", opacity: 0.25, transition: "0.8s", zIndex: 0 }}></div>

      {/* 🎯 HEADER */}
      <div style={{ textAlign: "center", marginBottom: "50px", position: "relative", zIndex: 1 }}>
        <h4 style={{ color: "#ff9800", letterSpacing: "4px", fontSize: "14px", fontWeight: "800", textTransform: "uppercase", marginBottom: "10px" }}>Precision Engineering</h4>
        <h2 style={{ fontSize: isMobile ? "38px" : "55px", fontWeight: "900", color: "#fff", margin: 0, letterSpacing: "-2px" }}>
          Next-Gen <span style={{ color: services[active].color, transition: "0.5s" }}>Solutions</span>
        </h2>
      </div>

      {/* ⚡ THE INTERACTIVE GLASS LAYOUT */}
      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row", 
        gap: "20px",
        alignItems: "stretch",
        position: "relative",
        zIndex: 1
      }}>
        {services.map((s, i) => (
          <div 
            key={i}
            onMouseEnter={() => setActive(i)}
            style={{
              flex: active === i ? (isMobile ? "1" : "2.2") : "1",
              background: active === i ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(25px)", // 👈 Higher blur for a "milky" clear glass look
              WebkitBackdropFilter: "blur(25px)",
              borderRadius: "32px",
              padding: "45px 35px",
              border: active === i ? `1px solid ${s.color}` : "1px solid rgba(255, 255, 255, 0.15)",
              transition: "all 0.7s cubic-bezier(0.19, 1, 0.22, 1)", // 👈 Smoother transition
              cursor: "pointer",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: active === i ? `0 25px 60px rgba(0,0,0,0.4)` : "none"
            }}
          >
            <div>
              <div style={{ 
                fontSize: "32px", 
                color: active === i ? s.color : "#cbd5e1", 
                marginBottom: "25px",
                transition: "0.3s"
              }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "15px" }}>{s.title}</h3>
              <p style={{ color: "#e2e8f0", fontSize: "15px", lineHeight: "1.6", opacity: active === i ? 1 : 0.7 }}>{s.desc}</p>
            </div>

            <div style={{ 
              marginTop: "30px",
              opacity: active === i ? 1 : 0,
              transform: active === i ? "translateY(0)" : "translateY(15px)",
              transition: "0.5s",
              height: active === i ? "auto" : "0",
              overflow: "hidden"
            }}>
              {s.details.map((detail, d) => (
                <div key={d} style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fff", marginBottom: "12px", fontSize: "14px" }}>
                  <FaCheckCircle color={s.color} /> {detail}
                </div>
              ))}
            </div>

            <div style={{ marginTop: "40px", display: "flex", alignItems: "center", justifyContent: "space-between", color: s.color, fontWeight: "700" }}>
              <span style={{ fontSize: "14px" }}>{active === i ? "Configure Module" : ""}</span>
              <FaArrowRight style={{ transform: active === i ? "translateX(5px)" : "rotate(-45deg)", transition: "0.4s" }} />
            </div>
          </div>
        ))}
      </div>

      {/* 🏷️ FOOTER CTA */}
      <div style={{ marginTop: "60px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <button style={{ 
          padding: "18px 55px", borderRadius: "100px", background: services[active].color, color: "#fff", border: "none", fontWeight: "900", cursor: "pointer",
          boxShadow: `0 20px 40px ${services[active].color}44`, transition: "0.5s", letterSpacing: "1px"
        }}>
          DEPLOY {services[active].title.toUpperCase()}
        </button>
      </div>

    </div>
  );
};

export default Services;