import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../../css/AdminDashboard.css";
import { FaUserCircle } from "react-icons/fa";

const FacultyProfile = () => {
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const facultyId = decoded.FacultyUserId;

        axios
          .get(`https://localhost:7133/api/Faculties/GetFacultyById/${facultyId}`)
          .then((res) => {
            if (res.data.success) {
              const data = res.data.faculty;
              if (Array.isArray(data) && data.length > 0) {
                setFaculty(data[0]);
              }
            }
          })
          .catch((err) => console.error("API Error:", err));
      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  }, []);

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1>
          <FaUserCircle style={{ marginRight: "10px" }} />
          Faculty Profile
        </h1>
      </div>

      {faculty ? (
        <div className="faculty-profile card p-4 mt-3">
          {faculty.facultyImg && (
            <img
              src={`https://localhost:7133/Uploads/Faculty/${faculty.facultyImg}`}
              alt="Faculty"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "20px",
              }}
            />
          )}
          <h2>👋 Hello, {faculty.facultyName}</h2>
          <p><strong>Email:</strong> {faculty.email}</p>
          <p><strong>Gender:</strong> {faculty.gender}</p>
          <p><strong>Qualification:</strong> {faculty.qualification}</p>
          <p><strong>Experience:</strong> {faculty.experience} years</p>
          <p><strong>Date of Joining:</strong> {faculty.doj}</p>
          <p><strong>Department Name:</strong> {faculty.depname}</p>
        </div>
      ) : (
        <p>Loading faculty profile...</p>
      )}
    </div>
  );
};

export default FacultyProfile;
