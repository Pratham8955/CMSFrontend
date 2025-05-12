import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaSignOutAlt,
  FaBars,
  FaTachometerAlt,
  FaBookOpen,
  FaBell,
} from "react-icons/fa";

const FacultyLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/FacultyLogin");
  };

  return (
    <div
      className="faculty-dashboard-container"
      style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f3f5" }}
    >
      {/* Sidebar */}
      <div className={`sidebar-new ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="top-section">
          <div className="logo-area">
            <div className="menu-toggle" onClick={toggleSidebar}>
              <FaBars />
            </div>
            {isSidebarOpen && <div className="logo-text">Faculty Panel</div>}
          </div>
        </div>

        <ul className="nav-menu">
          <li onClick={() => navigate("/faculty/facultydashboard")}>
            <FaTachometerAlt className="icon" />
            {isSidebarOpen && <span>Dashboard</span>}
          </li>
          <li onClick={() => navigate("/faculty/profile")}>
            <FaChalkboardTeacher className="icon" />
            {isSidebarOpen && <span>Profile</span>}
          </li>
           <li onClick={() => navigate("/faculty/AssignedSubjects")}>
            <FaTachometerAlt className="icon" />
            {isSidebarOpen && <span>Subjects</span>}
          </li>
          <li onClick={() => navigate("/faculty/ContentUpload")}>
            <FaBookOpen className="icon" />
            {isSidebarOpen && <span>Content</span>}
          </li>
          <li onClick={() => navigate("/faculty/notifications")}>
            <FaBell className="icon" />
            {isSidebarOpen && <span>Notifications</span>}
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

export default FacultyLayout;
