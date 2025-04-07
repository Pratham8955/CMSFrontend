import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  // Hide footer on dashboard routes
  const hideFooterRoutes = [
    "/student/Studentdashboard",
    "/faculty/facultydashboard",
    "/admin/admindashboard"
  ];

  if (hideFooterRoutes.includes(location.pathname)) return null;

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        textAlign: "center",
        padding: "10px 0",
        backgroundColor: "#f8f9fa",
        borderTop: "1px solid #ddd",
        zIndex: 1000
      }}
    >
      <Link to="/AdminandFacultyLogin" className="nav-item" style={{ textDecoration: "none", color: "#007bff" }}>
        Admin & Faculty Login
      </Link>
    </footer>
  );
};

export default Footer;
