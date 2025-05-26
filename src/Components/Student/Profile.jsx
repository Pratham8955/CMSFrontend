import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [deptName, setDeptName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const id = decoded.StudentUserId;

      axios
        .get(`https://localhost:7133/api/Student/getStudentsById/${id}`)
        .then((res) => {
          if (res.data.success && res.data.student?.length > 0) {
            setStudent(res.data.student[0]);
          } else {
            console.error("Student not found");
          }
        })
        .catch((err) => {
          console.error("API error:", err);
        })
        .finally(() => setLoading(false));
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (student && student.deptId) {
      axios
        .get(`https://localhost:7133/api/Department/GetDepartmentById/${student.deptId}`)
        .then((res) => {
          if (res.data.success && res.data.department) {
            setDeptName(res.data.department.deptName);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch department name", err);
        });
    }
  }, [student]);

  return (
    <div className="container my-5">
      {/* Header */}
      <header className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary">
          <i className="bi bi-mortarboard-fill me-2"></i>Student Dashboard
        </h1>
        <p className="text-muted fs-5">Welcome to your student profile</p>
      </header>

      {/* Loading State */}
      {loading ? (
        <div className="d-flex flex-column align-items-center mt-5">
          <div className="spinner-border text-primary" role="status" style={{ width: "3.5rem", height: "3.5rem" }} />
          <p className="mt-4 fs-6 text-secondary">Loading student profile...</p>
        </div>
      ) : student ? (
        <div
          className="card mx-auto shadow rounded-4 border-0 p-4"
          style={{ maxWidth: "900px", backgroundColor: "#f8fbfc" }}
        >
          <div className="row gy-4 align-items-center">
            {/* Left: Profile Image + Basic Info */}
            <div className="col-md-4 d-flex flex-column align-items-center text-center">
              {student.studentImg ? (
                <img
                  src={`https://localhost:7133/uploads/students/studentProfile/${student.studentImg}`}
                  alt="Student"
                  className="rounded-circle border border-3 border-primary shadow"
                  style={{ width: "180px", height: "180px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow"
                  style={{ width: "180px", height: "180px", fontSize: "1.5rem", fontWeight: "600" }}
                >
                  No Image
                </div>
              )}
              <h3 className="mt-3 mb-1 text-primary fw-semibold">{student.studentName}</h3>
              <a
                href={`mailto:${student.email}`}
                className="text-decoration-none text-secondary fs-6 d-flex align-items-center gap-2"
              >
                <i className="bi bi-envelope-fill"></i> {student.email}
              </a>
              <hr className="w-50 mt-4" />
            </div>

            {/* Right: Info Items */}
            <div className="col-md-8">
              <div className="row row-cols-1 row-cols-md-2 g-3">
                <InfoItem icon="telephone-fill" label="Phone" value={student.phone} />
                <InfoItem icon="gender-ambiguous" label="Gender" value={student.gender} />
                <InfoItem icon="calendar-fill" label="Date of Birth" value={formatDate(student.dob)} />
                <InfoItem icon="house-fill" label="Address" value={student.address} />
                <InfoItem icon="geo-alt-fill" label="City" value={student.city} />
                <InfoItem icon="pin-map-fill" label="State" value={student.state} />
                <InfoItem icon="book-half" label="Current Semester" value={student.currentSemester +" Semester"} />
                <InfoItem icon="building" label="Department" value={deptName || student.deptId} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning text-center fs-6">Student profile not found.</div>
      )}
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="col">
    <div
      className="bg-white p-3 rounded-3 border shadow-sm h-100 d-flex align-items-center gap-3"
      style={{ transition: "background-color 0.3s ease" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e7f1ff")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
    >
      <i className={`bi bi-${icon} fs-4 text-primary`} />
      <div>
        <small className="text-muted">{label}</small>
        <div className="fw-semibold fs-6">{value || "—"}</div>
      </div>
    </div>
  </div>
);

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export default Profile;
