import React, { useState } from "react";
import "../../css/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import {
  FaUniversity,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaSignOutAlt,
  FaBars,
  FaTachometerAlt, // <-- Added Dashboard icon
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/adminFacultyLogin");
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Hello Its dashboard</h1>
         </div>
  );
};

export default AdminDashboard;
