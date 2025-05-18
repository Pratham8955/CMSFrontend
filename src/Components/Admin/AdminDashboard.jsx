import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "../../css/AdminDashboard.css"
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [faculty, setFaculty] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/adminFacultyLogin");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const facultyId = decoded.FacultyUserId;
        setUserId(facultyId);

        // Fetch faculty data using the correct endpoint
        axios
          .get(`https://localhost:7133/api/Faculties/GetFacultyById/${facultyId}`)
          .then((res) => {
            // Check if response is successful and data is valid
            if (res.data.success) {
              const facultyData = res.data.faculty;
              
              if (facultyData && Array.isArray(facultyData) && facultyData.length > 0) {
                setFaculty(facultyData[0]);
              } else {
                console.error("No faculty data found.");
              }
            } else {
              console.error("Faculty fetch failed:", res.data.message || "Unknown error");
            }
          })
          .catch((err) => {
            console.error("API error:", err);
          });
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        {/* <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
