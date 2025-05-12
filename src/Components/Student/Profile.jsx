import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
// import "../../css/StudentDashboard.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);
  const [student, setStudent] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.StudentUserId; // Make sure your JWT has this claim
        setStudentId(id);

        axios
          .get(`https://localhost:7133/api/Student/getStudentsById/${id}`)
          .then((res) => {
            if (res.data.success) {
              const studentData = res.data.student;

              if (studentData && Array.isArray(studentData) && studentData.length > 0) {
                setStudent(studentData[0]);
              } else {
                console.error("No student data found.");
              }
            } else {
              console.error("Student fetch failed:", res.data.message || "Unknown error");
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
    <div className="student-dashboard-container">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        
      </div>

      {student ? (
        <div className="student-profile card p-4 mt-3">
          <h2>👋 Welcome, {student.studentName}</h2>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Phone:</strong> {student.phone}</p>
          <p><strong>Gender:</strong> {student.gender}</p>
          <p><strong>Date of Birth:</strong> {student.dob}</p>
          <p><strong>Address:</strong> {student.address}</p>
          <p><strong>City:</strong> {student.city}</p>
          <p><strong>State:</strong> {student.state}</p>
          <p><strong>Current Semester:</strong> {student.currentSemester}</p>
          <p><strong>Department ID:</strong> {student.deptId}</p>
          {student.studentImg && (
            <img
            src={`https://localhost:7133/uploads/students/${student.studentImg}`}
            alt="Student"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "50%",
              border: "2px solid #ccc"
            }}
          />
          )}
        </div>
      ) : (
        <p>Loading student profile...</p>
      )}
    </div>
  );
};

export default Profile