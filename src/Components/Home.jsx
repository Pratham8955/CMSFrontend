import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // ✅ Bootstrap Icons
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Home = () => {
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);        // New state for faculties
  const [searchTerm, setSearchTerm] = useState('');
  const [matchedDept, setMatchedDept] = useState(null);
  const [error, setError] = useState(null);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingFaculties, setLoadingFaculties] = useState(true);  // Loading state for faculties
  const navigate = useNavigate();
  useEffect(() => {
    fetch('https://localhost:7133/api/Department/GetDepartment')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.department) {
          setDepartments(data.department);
        } else {
          setError('Invalid department data');
        }
        setLoadingDepts(false);
      })
      .catch(err => {
        setError(err.message);
        setLoadingDepts(false);
      });
  }, []);

  useEffect(() => {
    fetch('https://localhost:7133/api/Student/GetStudents')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.student) {
          setStudents(data.student);
        } else {
          setError('Invalid student data');
        }
        setLoadingStudents(false);
      })
      .catch(err => {
        setError(err.message);
        setLoadingStudents(false);
      });
  }, []);

  // New useEffect to fetch faculties
  useEffect(() => {
    fetch('https://localhost:7133/api/Faculties/GetFaculties')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.faculty) {
          setFaculties(data.faculty);
        } else {
          setError('Invalid faculty data');
        }
        setLoadingFaculties(false);
      })
      .catch(err => {
        setError(err.message);
        setLoadingFaculties(false);
      });
  }, []);

  useEffect(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      setMatchedDept(null);
      return;
    }

    const found = departments.find(dept =>
      dept.deptName.toLowerCase().includes(trimmed)
    );
    setMatchedDept(found || null);
  }, [searchTerm, departments]);

  const getStudentCount = (deptId) =>
    students.filter(student => student.deptId === deptId).length;

  // ✅ Bootstrap icon mapping based on department name
  const getIconClass = (deptName) => {
    const name = deptName.toLowerCase();
    if (name.includes('bca')) return 'bi bi-pc-display';
    if (name.includes('b.com')) return 'bi bi-currency-dollar';
    if (name.includes('bba')) return 'bi bi-briefcase-fill';
    if (name.includes('mca')) return 'bi bi-code-slash';
    if (name.includes('mba')) return 'bi bi-bar-chart-line-fill';
    return 'bi bi-building';
  };
 const handleSearchClick = () => {
  const trimmed = searchTerm.trim().toLowerCase();
  if (!trimmed) return;

  const found = departments.find(dept =>
    dept.deptName.toLowerCase().includes(trimmed)
  );

  if (!found) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No department found!',
      confirmButtonColor: '#3085d6',
    });
    return;
  }

  navigate(`/Courses?search=${encodeURIComponent(trimmed)}`);
};
  return (
    <div className="home-container">
      <div className="home-content">
        <i className="bi bi-mortarboard-fill home-icon"></i>
        <h1 className="home-title">Welcome to ICT HOME</h1>
        <p className="home-subtitle">
          Where excellence meets opportunity! At College, we are committed to nurturing talent,
          fostering innovation, and empowering students for a bright future.
        </p>
   <div className="home-search">
          <input
            type="text"
            placeholder="Courses"
            className="home-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if(e.key === 'Enter') handleSearchClick();
            }}
          />
          <button className="home-button" onClick={handleSearchClick}>Search</button>
        </div>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}

      </div>

      <div className="home-image-container">
        <img src="campus.jpg" alt="Campus" />
      </div>

      {/* Undergraduate Programs */}
      <div className="undergraduate-programs">
        <h3>Invest in Your Future</h3>
        <p>
          Embark on your academic journey at ICT HOME and explore our diverse undergraduate and postgraduate programs! We offer:{' '}
          {
            loadingDepts ? (
              <span>Loading departments...</span>
            ) : (
              departments.map((dept, index) => (
                <span key={dept.deptId}>
                  <strong>{dept.deptName}</strong>{index < departments.length - 1 ? ', ' : '.'}
                </span>
              ))
            )
          } Choose your path and become a well-equipped professional in today's dynamic world.
        </p>

        {/* Student Count Cards with Icons */}
        <div className="student-count-cards">
          {
            loadingStudents ? (
              <p>Loading student data...</p>
            ) : (
              <>
                {departments.map(dept => (
                  <div key={dept.deptId} className="student-card">
                    <div className="card-icon">
                      <i className={getIconClass(dept.deptName)}></i>
                    </div>
                    <p><strong>{dept.deptName} : {getStudentCount(dept.deptId)} Students</strong></p>
                  </div>
                ))}

                <div className="student-card">
                  <div className="card-icon">
                    <i className="bi bi-globe2"></i>
                  </div>
                  <p><strong>Total : {students.length} Students</strong></p>
                </div>
              </>
            )
          }
        </div>

        {/* Our Highlights Section */}
        <div className="home-highlights">
          <h2 className="highlight-title">Our Highlights</h2>
          <div className="highlight-cards">
            <div className="highlight-card">
              <h4>UGC & AICTE Accredited</h4>
              <p>
                We are an AICTE recognized and UGC-affiliated university, further processing for NAAC accreditation.
              </p>
            </div>
            <div className="highlight-card">
              <h4>INFRASTRUCTURE</h4>
              <p>
                We have a wide range of facilities that are open to students, staff, visitors, and the local community.
              </p>
            </div>
            <div className="highlight-card">
              <h4>STUDENT PROGRESSION & SUPPORT</h4>
              <p>
                We provide comprehensive support to students for the optimal progression of their skills during these pandemic times.
              </p>
            </div>
          </div>
        </div>

        {/* ====== Faculty List Section ====== */}
        <div className="faculty-list-section" style={{ marginTop: '40px' }}>
          <h2>Our Faculty Members</h2>

          {loadingFaculties ? (
            <p>Loading faculty data...</p>
          ) : faculties.length === 0 ? (
            <p>No faculties found.</p>
          ) : (
            <div className="faculty-cards" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {faculties.map(faculty => (
                <div
                  key={faculty.facultyId}
                  className="faculty-card"
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    padding: '15px',
                    width: '250px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={`https://localhost:7133/Uploads/Faculty/${faculty.facultyImg}`}
                    alt={faculty.facultyName}
                    style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%', marginBottom: '10px' }}
                  />
                  <h3 style={{ marginBottom: '5px' }}>{faculty.facultyName}</h3>
                  <p style={{ margin: '5px 0' }}><strong>Email:</strong> {faculty.email}</p>
                  <p style={{ margin: '5px 0' }}><strong>Qualification:</strong> {faculty.qualification}</p>
                  <p style={{ margin: '5px 0' }}><strong>Experience:</strong> {faculty.experience} years</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <h2 className="highlight-title1">Mission to Empowering dreams and Transforming lives.</h2>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 25px',
              fontSize: '16px',
              backgroundColor: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#2980b9')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#3498db')}
          >
            Let's Get Started...
          </button>
        </div>
        <div className="home-image-container1">
          <img src="facimg.jpg" alt="facimg" />
        </div>
        <div className="footer">
          <div className="footer-left">
            <h2>Let's keep in touch!</h2>
            <h9>Opening doors through literacy. Don’t be mean behind the screen</h9>
          </div>

          <div className="footer-right">
            <ul className="navbar-nav">
              <li>
                <NavLink to="/" className="nav-link">
                  <i className="bi bi-house-door me-1"></i> Home
                </NavLink>
              </li>
              <li >
                <NavLink to="/courses" className="nav-link">
                  <i className="bi bi-check2-square me-1"></i> Courses
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="nav-link">
                  <i className="bi bi-envelope me-1"></i> Contact Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/aboutUs" className="nav-link">
                  <i className="bi bi-info-circle me-1"></i> About Us
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
