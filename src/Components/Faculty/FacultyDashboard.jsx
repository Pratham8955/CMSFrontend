import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';  // fixed import to default import
import axios from 'axios';
import '../../css/Faculty/FacultyDashboard.css';  // import your custom CSS
import { redirect, useNavigate } from 'react-router-dom';
const FacultyDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
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
const handleCardClick = (redirect) => {
    if (redirect) {
      navigate(redirect);
    }
  };
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
        <>
       
        <div className="dashboard-cards">
          {[
            { title: "Faculty Count", value: counts.countFaculty, icon: "👩‍🏫" },
            { title: "Student Count", value: counts.countStudent, icon: "🎓" },
            { title: "Paid Students", value: counts.paidCount, icon: "💰" },
            { title: "Unpaid Students", value: counts.unpaidCount, icon: "⚠️" },
         
            
          ].map((item, index) => (
           <div
              className="dashboard-card"
              key={index}
              onClick={() => handleCardClick(item.redirect)}
              style={{ cursor: item.redirect ? 'pointer' : 'default' }}
            >
              <div className="card-content">
                <h4>{item.title}</h4>
                <h2>{item.value !== undefined ? item.value : ""}</h2>
              </div>
              <div className="card-icon">{item.icon}</div>
            </div>
          ))}
        </div>
         <div className="dashboard-cards dashboardcard2">
          {[
           
           { icon: "🧑‍💼", redirect: "/faculty/profile" ,title: "View My Profile"},
            {  icon: "📘",redirect:"/faculty/AssignedSubjects" ,title: "View Subjects"},
            { icon: "📁",redirect:"/faculty/AssignedSubjects" ,title: "View Content" },
            { icon: "🧾" ,redirect:"/faculty/Fees-Status",title: "Fees Records" },
            { icon: "🔔" ,redirect:"/faculty/notification",title: "Notification" },
            
          ].map((item, index) => (
           <div
              className="dashboard-card dashboard-card2 "
              key={index}
              onClick={() => handleCardClick(item.redirect)}
              style={{ cursor: item.redirect ? 'pointer' : 'default' }}
            >
              <div className="card-content">
              <div className="card-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <h2>{item.value !== undefined ? item.value : ""}</h2>
              </div>
            </div>
          ))}
        </div>
         </>
      ) : (
        <div className="alert alert-danger mt-4 text-center">
          ⚠️ Unable to load count data. Please try again later.
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
