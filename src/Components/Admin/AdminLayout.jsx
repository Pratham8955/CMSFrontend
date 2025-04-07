import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  FaUniversity,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaSignOutAlt,
  FaBars,
  FaTachometerAlt,
} from "react-icons/fa";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/AdminandFacultyLogin");
  };

  return (
    <div
      className="admin-dashboard-container"
      style={{ display: "flex", minHeight: "600vh", backgroundColor: "#f1f3f5" }}
    >
      {/* Sidebar */}
      <div className={`sidebar-new ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="top-section">
          <div className="logo-area">
            <div className="menu-toggle" onClick={toggleSidebar}>
              <FaBars />
            </div>
            {isSidebarOpen && <div className="logo-text">Admin Panel</div>}
          </div>
        </div>

        <ul className="nav-menu">
          <li onClick={() => navigate("/admin/AdminDashboard")}>
            <FaTachometerAlt className="icon" />
            <span>Dashboard</span>
          </li>
          <li onClick={() => navigate("/admin/departments")}>
            <FaUniversity className="icon" />
            <span>Departments</span>
          </li>
          <li onClick={() => navigate("/admin/faculties")}>
            <FaChalkboardTeacher className="icon" />
            <span>Faculties</span>
          </li>
          <li onClick={() => navigate("/admin/students")}>
            <FaUserGraduate className="icon" />
            <span>Students</span>
          </li>
          <li onClick={() => navigate("/admin/faculty-assignment")}>
            <FaChalkboardTeacher className="icon" />
            <span>Faculty Assignment</span>
          </li>
          <li onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            <span>Logout</span>
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

export default AdminLayout;
