import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaSignOutAlt,
  FaBars,
  FaTachometerAlt,
  FaBookOpen,
  FaBell,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const FacultyLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isHod, setIsHod] = useState(false);
  const [loading, setLoading] = useState(true); // Prevent rendering before API completes

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/AdminandFacultyLogin");
  };

  useEffect(() => {
    const checkIfHod = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const facultyId = Number(decoded.FacultyUserId);

        const response = await axios.get(`https://localhost:7133/api/Department/GetDepartmentByFacultyId/${facultyId}`);
        console.log("API Response:", response.data);

        const department = response.data?.department?.[0];
        if (department?.headOfDept === facultyId) {
          setIsHod(true);
        } else {
          console.log("This user is NOT HoD.");
        }
      } catch (err) {
        console.error("Error in HoD check:", err);
      } finally {
        setLoading(false);
      }
    };

    checkIfHod();
  }, []);

  if (loading) {
    return null; 
  }

  return (
    <div
      className="faculty-dashboard-container"
      style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f3f5" }}
    >
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
          {isHod && (
            <li onClick={() => navigate("/faculty/facultydashboard")}>
              <FaTachometerAlt className="icon" />
              {isSidebarOpen && <span>Dashboard</span>}
            </li>
          )}
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
          {isHod && (
            <li onClick={() => navigate("/faculty/Fees-Status")}>
              <FaBell className="icon" />
              {isSidebarOpen && <span>Fees Status</span>}
            </li>
          )}
          <li onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            {isSidebarOpen && <span>Logout</span>}
          </li>
        </ul>
      </div>

      <div className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="dashboard-content" style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FacultyLayout;
