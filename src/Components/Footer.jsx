import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div style={{ 
      position: "fixed", 
      bottom: 0, 
      width: "100%", 
      textAlign: "center", 
      padding: "10px", 
      backgroundColor: "#f8f9fa"
    }}>
      <Link to="/AdminandFacultyLogin" className="nav-item">Admin & Faculty Login</Link>
    </div>
  );
};

export default Footer;
