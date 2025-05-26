import React from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get login status and role
  const token = localStorage.getItem("token");
  const roleId = localStorage.getItem("roleId");

  // You can define role mappings if needed
  const isStudent = roleId === "1";
  const isFaculty = roleId === "2";
  const isAdmin = roleId === "3";

  // Routes where Navbar should be hidden
  const hideNavbarRoutes = ["/studentDashboard", "/facultyDashboard", "/adminDashboard"];
  const shouldHideNavbar = token && hideNavbarRoutes.includes(location.pathname);

  if (shouldHideNavbar) return null;

  // Highlight Sign Up button for all register routes
  const isSignUp = location.pathname.includes("register");

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Section */}
        <div className="navbar-left">
          <div className="navbar-logo" onClick={() => navigate("/")}>
            🎓 ICT'S HOME
          </div>
        </div>

        {/* Center Section */}
        <div className="navbar-center">
          <ul className="nav-links">
            <li>
              <NavLink to="/" className="nav-item">Home</NavLink>
            </li>
            <li>
              <NavLink to="/courses" className="nav-item">Courses</NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="nav-item">Contact</NavLink>
            </li>
            <li>
              <NavLink to="/aboutUs" className="nav-item">About Us</NavLink>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          <div className="auth-toggle">
            <button
              className={`auth-btn ${!isSignUp ? "active" : ""}`}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
           
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
