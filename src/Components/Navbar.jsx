import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import logo from '../assets/logo.png';         

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Keep this logic
  const token = localStorage.getItem("token");
  const roleId = localStorage.getItem("roleId");

  const isStudent = roleId === "1";
  const isFaculty = roleId === "2";
  const isAdmin = roleId === "3";

  const hideNavbarRoutes = ["/studentDashboard", "/facultyDashboard", "/adminDashboard"];
  const shouldHideNavbar = token && hideNavbarRoutes.includes(location.pathname);
  if (shouldHideNavbar) return null;

  const isSignUp = location.pathname.includes("register");

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        {/* Logo and Title */}
        <span
          className="navbar-brand fw-bold d-flex align-items-center text-dark"
          role="button"
          onClick={() => navigate("/")}
        >
          <img
            src={logo} 
            alt="Logo"
            height="40"
            // width="40"
            className="me-3"
          />
          <span className="fs-3">Capus Wave</span>
        </span>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 text-center">
            <li className="nav-item">
              <NavLink to="/" className="nav-link text-dark">
                <i className="bi bi-house-door me-1"></i> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/courses" className="nav-link text-dark">
                <i className="bi bi-check2-square me-1"></i> Courses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link text-dark">
                <i className="bi bi-envelope me-1"></i> Contact Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/aboutUs" className="nav-link text-dark">
                <i className="bi bi-info-circle me-1"></i> About Us
              </NavLink>
            </li>
          </ul>

          {/* Login Button */}
          <div className="d-flex">
            <button
              className={`btn ${!isSignUp ? "btn-outline-dark" : "btn-dark"} rounded-pill px-3`}
              onClick={() => navigate("/login")}
            >
              <i className="bi bi-box-arrow-in-right me-1"></i> Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
