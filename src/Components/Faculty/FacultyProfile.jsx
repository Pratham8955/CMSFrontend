import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; // fixed import (no curly braces)
import axios from "axios";
import "../../css/Faculty/FacultyProfile.css";

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
    <div className="facl container py-5">
      {faculty ? (
        <div className="faculty-profile">
          <div className="faculty-header text-center">
            <img
              src={
                faculty.facultyImg
                  ? `https://localhost:7133/Uploads/Faculty/${faculty.facultyImg}`
                  : "/default-faculty.png"
              }
              alt={faculty.facultyName}
              className="faculty-img mb-3"
            />
            <h2 className="faculty-name">{faculty.facultyName}</h2>
          </div>

          <div className="faculty-grid">
            <div className="profile-card border-info">
              <h4 className="profile-section-title text-info mb-2">Contact Details</h4>
              <p><strong>Email:</strong> {faculty.email}</p>
              <p><strong>Gender:</strong> {faculty.gender}</p>
            </div>

            <div className="profile-card border-success">
              <h4 className="profile-section-title text-success mb-2">Education & Experience</h4>
              <p><strong>Qualification:</strong> {faculty.qualification}</p>
              <p><strong>Experience:</strong> {faculty.experience} years</p>
            </div>

            <div className="profile-card border-warning">
              <h4 className="profile-section-title text-warning mb-2">Professional Details</h4>
              <p><strong>Date of Joining:</strong> {faculty.doj}</p>
              <p><strong>Department Name:</strong> {faculty.depname}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="loading-message text-center">Loading faculty profile...</p>
      )}
    </div>
  );
};

export default FacultyProfile;
