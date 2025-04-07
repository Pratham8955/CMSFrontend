import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignUp = location.pathname === "/register";

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
            <li><a href="/" className="nav-item">Home</a></li>
            <li><a href="/courses" className="nav-item">Courses</a></li>
            <li><a href="/contact" className="nav-item">Contact</a></li>
            <li><a href="/aboutUs" className="nav-item">About Us</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          <div className="auth-toggle">
            <button
              className={`auth-btn ${!isSignUp ? "active" : ""}`}
              onClick={() => navigate("/Login")}
            >
              Sign In
            </button>
            <button
              className={`auth-btn ${isSignUp ? "active" : ""}`}
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
      
    </nav>
    
  );
};

export default Navbar;
