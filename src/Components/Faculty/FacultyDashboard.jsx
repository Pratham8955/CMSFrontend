import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaMoneyCheckAlt,
  FaExclamationCircle,
  FaUserCircle,
  FaBookOpen,
  FaFileUpload,
  FaReceipt,
  FaBell,
  FaArrowRight
} from 'react-icons/fa';
import '../../css/Faculty/FacultyDashboard.css';
import { API_BASE_URL } from '../../config/api';

const FacultyDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [deptInfo, setDeptInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const facultyId = decoded.FacultyUserId;

          const depRes = await axios.get(`${API_BASE_URL}/Department/GetDepartmentByFacultyId/${facultyId}`);
          const departments = depRes.data.department;

          if (departments && departments.length > 0) {
            const currentDept = departments[0];
            setDeptInfo(currentDept);
            const deptId = currentDept.deptId;
            const countRes = await axios.get(`${API_BASE_URL}/CommonApi/departmentCounts/${deptId}`);
            setCounts(countRes.data);
          } else {
            console.error("No department found for this faculty.");
            navigate('/faculty/profile'); 
          }
        } catch (error) {
          console.error('Error loading dashboard data:', error);
          navigate('/faculty/profile');
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/AdminandFacultyLogin'); 
        setLoading(false);
      }
    };

    fetchCounts();
  }, [navigate]);

  return (
    <div className="faculty-dash-page">
      {/* Header Banner */}
      <div className="faculty-dash-banner">
        <div className="banner-text">
          <span className="banner-pill">Faculty Head of Department</span>
          <h2>Department Overview & Analytics</h2>
          <p>
            Department: <strong>{deptInfo?.deptName || "Academic Department"}</strong> — Real-time student & fee tracking
          </p>
        </div>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading department analytics...</p>
        </div>
      ) : counts ? (
        <div className="faculty-dash-body">
          {/* Top Metric Cards */}
          <div className="metrics-grid">
            <div className="metric-card card-faculty">
              <div className="metric-icon-box">
                <FaChalkboardTeacher />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total Faculty</span>
                <h3 className="metric-value">{counts.countFaculty ?? 0}</h3>
                <span className="metric-subtext">Department educators</span>
              </div>
            </div>

            <div className="metric-card card-students">
              <div className="metric-icon-box">
                <FaUserGraduate />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total Students</span>
                <h3 className="metric-value">{counts.countStudent ?? 0}</h3>
                <span className="metric-subtext">Enrolled students</span>
              </div>
            </div>

            <div className="metric-card card-paid">
              <div className="metric-icon-box">
                <FaMoneyCheckAlt />
              </div>
              <div className="metric-info">
                <span className="metric-label">Paid Students</span>
                <h3 className="metric-value">{counts.paidCount ?? 0}</h3>
                <span className="metric-subtext text-success">Fees cleared</span>
              </div>
            </div>

            <div className="metric-card card-unpaid">
              <div className="metric-icon-box">
                <FaExclamationCircle />
              </div>
              <div className="metric-info">
                <span className="metric-label">Pending Fees</span>
                <h3 className="metric-value">{counts.unpaidCount ?? 0}</h3>
                <span className="metric-subtext text-warning">Dues pending</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Cards */}
          <div className="dash-section-header mt-4 mb-3">
            <h4>Quick Department Actions</h4>
            <p className="text-muted m-0">Access tools and management modules directly</p>
          </div>

          <div className="actions-grid">
            {[
              {
                icon: FaUserCircle,
                color: "blue",
                title: "My Profile",
                desc: "View personal & employment records",
                path: "/faculty/profile"
              },
              {
                icon: FaBookOpen,
                color: "indigo",
                title: "Assigned Subjects",
                desc: "Manage syllabus & teaching subjects",
                path: "/faculty/AssignedSubjects"
              },
              {
                icon: FaFileUpload,
                color: "emerald",
                title: "Course Materials",
                desc: "Upload notes & study resources",
                path: "/faculty/ContentUpload"
              },
              {
                icon: FaReceipt,
                color: "amber",
                title: "Fee Status",
                desc: "View department payment ledger",
                path: "/faculty/Fees-Status"
              },
              {
                icon: FaBell,
                color: "rose",
                title: "Send Reminders",
                desc: "Broadcast fee alerts to students",
                path: "/faculty/notification"
              }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className={`action-module-card color-${item.color}`}
                  onClick={() => navigate(item.path)}
                >
                  <div className="action-icon-circle">
                    <IconComp />
                  </div>
                  <div className="action-details">
                    <h5>{item.title}</h5>
                    <p>{item.desc}</p>
                  </div>
                  <div className="action-arrow">
                    <FaArrowRight />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="alert alert-danger text-center">
          ⚠️ Unable to load dashboard analytics.
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
