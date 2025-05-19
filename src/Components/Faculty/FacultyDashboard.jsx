import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';  // fixed import to default import
import axios from 'axios';
import '../../css/Faculty/FacultyDashboard.css';  // import your custom CSS

const FacultyDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const facultyId = decoded.FacultyUserId;

          const depRes = await axios.get(`https://localhost:7133/api/Department/GetDepartmentByFacultyId/${facultyId}`);
          const departments = depRes.data.department;

          if (departments && departments.length > 0) {
            const deptId = departments[0].deptId;
            const countRes = await axios.get(`https://localhost:7133/api/CommonApi/departmentCounts/${deptId}`);
            setCounts(countRes.data);
          } else {
            console.error("No department found for this faculty.");
          }
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="text-center mb-4">Faculty Dashboard Overview</h1>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : counts ? (
        <div className="dashboard-cards">
          {[
            { title: "Faculty Count", value: counts.countFaculty, icon: "👩‍🏫" },
            { title: "Student Count", value: counts.countStudent, icon: "🎓" },
            { title: "Paid Students", value: counts.paidCount, icon: "💰" },
            { title: "Unpaid Students", value: counts.unpaidCount, icon: "⚠️" },
          ].map((item, index) => (
            <div className="dashboard-card" key={index}>
              <div className="card-content">
                <h4>{item.title}</h4>
                <h2>{item.value}</h2>
              </div>
              <div className="card-icon">{item.icon}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-danger mt-4 text-center">
          ⚠️ Unable to load count data. Please try again later.
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
