import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaEnvelope, FaUser, FaGoogle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Student/FacultyByStudent.css';

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
        console.error("Error fetching faculty:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [navigate]);

  const openGmailWithEmail = (email, name) => {
    const subject = encodeURIComponent(`Formal Inquiry`);
    const body = encodeURIComponent(`Dear ${name},\n`);
    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailURL, '_blank');
  };

  if (loading) return <p className="text-center mt-5">Loading faculty details...</p>;
  if (!facultyList.length) return <p className="text-center mt-5">No faculty found.</p>;

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4 fw-semibold">My Faculty Members</h2>
      <div className="row justify-content-center">
        {facultyList.map((faculty) => (
          <div key={faculty.facultyId} className="col-md-6 col-lg-4 mb-4">
            <div
              className="faculty-card card h-100 text-center border-0 shadow-sm"
              onClick={() => openGmailWithEmail(faculty.email, faculty.facultyName)}
            >
              <div className="card-body">
                <FaUser size={50} className="text-primary mb-3" />
                <h5 className="card-title fw-bold">{faculty.facultyName}</h5>
                <p className="card-text text-muted mb-1">
                  <FaEnvelope className="me-2" />
                  {faculty.email}
                </p>
                <p className="card-text">
                  <strong>Gender:</strong> {faculty.gender}
                </p>
                <button className="btn btn-primary mt-2 px-4 py-2 d-flex align-items-center mx-auto">
                  <FaGoogle className="me-2" />
                  Contact via Gmail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyByStudent;
