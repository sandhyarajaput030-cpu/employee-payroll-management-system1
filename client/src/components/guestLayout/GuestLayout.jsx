import React from "react";
import { Outlet } from "react-router-dom";
import GuestHeader from "./GuestHeader";
import GuestFooter from "./GuestFooter";

const GuestLayout = () => {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d)",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>

      <div style={{
        minHeight: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column"
      }}>

        <GuestHeader />

        <div style={{ flex: 1 }}>
          <Outlet />
        </div>

        <GuestFooter />

      </div>
    </div>
  );
};

export default GuestLayout;