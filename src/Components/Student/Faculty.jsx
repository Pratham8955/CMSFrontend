import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';

const FacultyByStudent = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = jwtDecode(token);
    const studentId = decoded.StudentUserId;

    const fetchFaculty = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7133/api/Faculties/GetFacultyBystudentId/${studentId}`
        );
        setFacultyList(response.data.faculty);
      } catch (error) {
        console.error("Error fetching faculty by student ID:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [navigate]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!facultyList || facultyList.length === 0)
    return <p className="text-center mt-4">No faculty found for this student.</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Faculty Details</h3>
      <div className="row">
        {facultyList.map((faculty) => (
          <div key={faculty.facultyId} className="col-md-4 mb-4">
            <div
              className="card shadow-sm h-100"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                window.open(
                  `https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox`,
                  '_blank'
                )
              }
            >
              <div className="card-body">
                <h5 className="card-title">{faculty.facultyName}</h5>
                <p className="card-text">
                  <strong>Email:</strong> {faculty.email}
                </p>
                <p className="card-text">
                  <strong>Gender:</strong> {faculty.gender}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyByStudent;
