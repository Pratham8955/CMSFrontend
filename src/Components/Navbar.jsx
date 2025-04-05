import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css"; // Import styles

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
       
        <Link to="/" className="navbar-logo">ICT'S HOME</Link>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li><Link to="/" className="nav-item">Home</Link></li>
          <li><Link to="/courses" className="nav-item">Courses</Link></li>
          <li><Link to="/contact" className="nav-item">Contact</Link></li>
          <li><Link to="/aboutUs" className="nav-item">About Us</Link></li>
          <li><Link to="/register" className="nav-item">Register</Link></li>
          <li><Link to="/Login" className="nav-item">Login</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
