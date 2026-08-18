import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaUserTie,
  FaEnvelope,
  FaVenusMars,
  FaGraduationCap,
  FaBriefcase,
  FaCalendarAlt,
  FaBuilding,
  FaBookOpen,
  FaFileUpload,
  FaCheckCircle,
  FaIdCard
} from "react-icons/fa";
import "../../css/Faculty/FacultyProfile.css";
import { API_BASE_URL, BASE_URL } from "../../config/api";

const FacultyProfile = () => {
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const facultyId = decoded.FacultyUserId;

        axios
          .get(`${API_BASE_URL}/Faculties/GetFacultyById/${facultyId}`)
          .then((res) => {
            if (res.data.success) {
              const data = res.data.faculty;
              if (Array.isArray(data) && data.length > 0) {
                setFaculty(data[0]);
              }
            }
          })
          .catch((err) => console.error("API Error:", err))
          .finally(() => setLoading(false));
      } catch (err) {
        console.error("Token decode error:", err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="faculty-profile-wrapper">
      {loading ? (
        <div className="profile-loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fw-medium">Loading faculty profile...</p>
        </div>
      ) : faculty ? (
        <div className="faculty-profile-container">
          {/* Hero Banner & Avatar */}
          <div className="faculty-hero-card">
            <div className="faculty-hero-bg"></div>
            <div className="faculty-hero-body">
              <div className="faculty-avatar-container">
                {faculty.facultyImg ? (
                  <img
                    src={`${BASE_URL}/Uploads/Faculty/${faculty.facultyImg}`}
                    alt={faculty.facultyName}
                    className="faculty-avatar-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80";
                    }}
                  />
                ) : (
                  <div className="faculty-avatar-placeholder">
                    <FaUserTie size={54} />
                  </div>
                )}
                <span className="status-badge" title="Active Faculty">
                  <span className="status-dot"></span>
                </span>
              </div>

              <div className="faculty-hero-info">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <h1 className="faculty-display-name">{faculty.facultyName}</h1>
                  <span className="badge-role">Faculty Member</span>
                </div>
                <p className="faculty-subtitle">
                  <span className="department-tag">{faculty.depname || "Department"}</span>
                  <span className="bullet-separator">•</span>
                  <span className="qualification-tag">{faculty.qualification || "Educator"}</span>
                </p>

                <div className="faculty-quick-actions">
                  <a
                    href={`mailto:${faculty.email}`}
                    className="quick-action-btn email-btn"
                  >
                    <FaEnvelope className="btn-icon" />
                    <span>{faculty.email}</span>
                  </a>
                  <span className="quick-chip id-chip">
                    <FaIdCard className="btn-icon text-primary" />
                    <span>ID: #{faculty.facultyId}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Cards Grid */}
          <div className="faculty-cards-grid">
            {/* Card 1: Contact Details */}
            <div className="faculty-info-card card-contact">
              <div className="card-header-custom">
                <div className="card-header-icon-box icon-blue">
                  <FaEnvelope />
                </div>
                <div>
                  <h3 className="card-section-title">Contact Information</h3>
                  <p className="card-section-desc">Reach out & communication channels</p>
                </div>
              </div>
              <div className="card-body-custom">
                <div className="info-row">
                  <div className="info-icon"><FaEnvelope /></div>
                  <div className="info-data">
                    <span className="info-label">Email Address</span>
                    <span className="info-value text-break">{faculty.email || "N/A"}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon"><FaVenusMars /></div>
                  <div className="info-data">
                    <span className="info-label">Gender</span>
                    <span className="info-value text-capitalize">{faculty.gender || "N/A"}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon"><FaCheckCircle className="text-success" /></div>
                  <div className="info-data">
                    <span className="info-label">Account Status</span>
                    <span className="info-value text-success fw-semibold">Verified & Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Academic & Experience */}
            <div className="faculty-info-card card-academic">
              <div className="card-header-custom">
                <div className="card-header-icon-box icon-purple">
                  <FaGraduationCap />
                </div>
                <div>
                  <h3 className="card-section-title">Education & Experience</h3>
                  <p className="card-section-desc">Academic background & expertise</p>
                </div>
              </div>
              <div className="card-body-custom">
                <div className="info-row">
                  <div className="info-icon"><FaGraduationCap /></div>
                  <div className="info-data">
                    <span className="info-label">Highest Qualification</span>
                    <span className="info-value badge-pill purple-pill">{faculty.qualification || "N/A"}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon"><FaBriefcase /></div>
                  <div className="info-data">
                    <span className="info-label">Total Experience</span>
                    <span className="info-value">{faculty.experience ? `${faculty.experience} Year(s)` : "N/A"}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon"><FaBookOpen /></div>
                  <div className="info-data">
                    <span className="info-label">Role Designation</span>
                    <span className="info-value">Professor / Lecturer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Professional & Employment */}
            <div className="faculty-info-card card-professional">
              <div className="card-header-custom">
                <div className="card-header-icon-box icon-emerald">
                  <FaBuilding />
                </div>
                <div>
                  <h3 className="card-section-title">Professional Details</h3>
                  <p className="card-section-desc">Institutional placement & tenure</p>
                </div>
              </div>
              <div className="card-body-custom">
                <div className="info-row">
                  <div className="info-icon"><FaBuilding /></div>
                  <div className="info-data">
                    <span className="info-label">Department</span>
                    <span className="info-value badge-pill blue-pill">{faculty.depname || "N/A"}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon"><FaCalendarAlt /></div>
                  <div className="info-data">
                    <span className="info-label">Date of Joining</span>
                    <span className="info-value">{formatDate(faculty.doj)}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon"><FaIdCard /></div>
                  <div className="info-data">
                    <span className="info-label">Department ID</span>
                    <span className="info-value">Dept #{faculty.deptId || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts Section */}
          <div className="faculty-shortcuts-section">
            <h4 className="shortcuts-title">Quick Actions & Shortcuts</h4>
            <div className="shortcuts-grid">
              <Link to="/faculty/AssignedSubjects" className="shortcut-card">
                <div className="shortcut-icon-box bg-blue-subtle text-primary">
                  <FaBookOpen size={20} />
                </div>
                <div className="shortcut-text">
                  <h5>My Assigned Subjects</h5>
                  <p>View semester subjects and courses</p>
                </div>
              </Link>

              <Link to="/faculty/ContentUpload" className="shortcut-card">
                <div className="shortcut-icon-box bg-emerald-subtle text-success">
                  <FaFileUpload size={20} />
                </div>
                <div className="shortcut-text">
                  <h5>Upload Materials</h5>
                  <p>Share notes, assignments & PDFs</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="faculty-error-state">
          <p className="text-danger fw-semibold">⚠️ Faculty profile not found. Please log in again.</p>
        </div>
      )}
    </div>
  );
};

export default FacultyProfile;
