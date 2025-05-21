import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  FaUserGraduate,
  FaSignOutAlt,
  FaBars,
  FaTachometerAlt,
  FaMoneyBillAlt,
  FaBookOpen
} from "react-icons/fa";
import Swal from "sweetalert2"; // SweetAlert2
import "../../css/Student/StudentLayout.css"

const StudentLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
        Swal.fire("Logged out!", "You have been logged out.", "success");
      }
    });
  };

  return (
    <div
      className="student-dashboard-container"
      style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f3f5" }}
    >
      {/* Sidebar */}
      <div className={`sidebar-new ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="top-section">
          <div className="logo-area">
            <div className="menu-toggle" onClick={toggleSidebar}>
              <FaBars />
            </div>
            {isSidebarOpen && <div className="logo-text">Student Panel</div>}
          </div>
        </div>

        <ul className="nav-menu">
          <li onClick={() => navigate("/student/Studentdashboard")}>
            <FaTachometerAlt className="icon" />
            {isSidebarOpen && <span>Dashboard</span>}
          </li>
          <li onClick={() => navigate("/student/profile")}>
            <FaUserGraduate className="icon" />
            {isSidebarOpen && <span>Profile</span>}
          </li>
          <li onClick={() => navigate("/student/fees")}>
            <FaMoneyBillAlt className="icon" />
            {isSidebarOpen && <span>Fees</span>}
          </li>
          <li onClick={() => navigate("/student/material")}>
            <FaBookOpen className="icon" />
            {isSidebarOpen && <span>Materials</span>}
          </li>
        </ul>

        {/* Logout Button at Bottom */}
        <div className="logout-container">
          <li className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            {isSidebarOpen && <span>Logout</span>}
          </li>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="dashboard-content" style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
