import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  FaUserGraduate,
  FaSignOutAlt,
  FaBars,
  FaTachometerAlt,
} from "react-icons/fa";

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/StudentLogin");
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
            <FaUserGraduate className="icon" />
            {isSidebarOpen && <span>Fees</span>}
          </li>
          <li onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            {isSidebarOpen && <span>Logout</span>}
          </li>
        </ul>
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
