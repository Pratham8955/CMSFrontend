import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Faculty/FacultyDashboard.css';

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
    <div className="container mt-5">
      <h1 className="text-center mb-4">Faculty Dashboard Overview</h1>

      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : counts ? (
        <div className="row g-4">
          {[
            { title: "Faculty Count", value: counts.countFaculty, color: "primary" },
            { title: "Student Count", value: counts.countStudent, color: "success" },
            { title: "Paid Students", value: counts.paidCount, color: "warning" },
            { title: "Unpaid Students", value: counts.unpaidCount, color: "danger" },
          ].map((item, index) => (
            <div className="col-md-3" key={index}>
              <div className={`card border-${item.color} h-100`}>
                <div className={`card-header bg-${item.color} text-white`}>
                  {item.title}
                </div>
                <div className="card-body d-flex align-items-center justify-content-center">
                  <h2 className="card-text">{item.value}</h2>
                </div>
              </div>
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