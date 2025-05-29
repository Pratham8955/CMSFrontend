import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaArrowLeft } from 'react-icons/fa';
import '../css/Courses.css';
import { NavLink, useLocation } from "react-router-dom";

const Courses = () => {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [selectedSemId, setSelectedSemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [highlightDeptId, setHighlightDeptId] = useState(null);

  const location = useLocation();

  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('search')?.toLowerCase().trim() || '';
  };

  useEffect(() => {
    Promise.all([
      fetch('https://localhost:7133/api/Department/GetDepartment').then(res => res.json()),
      fetch('https://localhost:7133/api/Subject/GetSubjects').then(res => res.json()),
      fetch('https://localhost:7133/api/FeeStructure/getFeeStructure').then(res => res.json())
    ]).then(([deptData, subjData, feeData]) => {
      if (deptData.success && subjData.success && feeData.success) {
        const depts = deptData.department || deptData.Department || [];
        setDepartments(depts);
        setSubjects(subjData.subject || subjData.Subject || []);
        setFeeStructures(feeData.feeStruct || feeData.FeeStruct || []);

        const query = getSearchQuery();
        if (query) {
          const matchedDept = depts.find(d => {
            const name = d.departmentName || d.deptName || '';
            return name.toLowerCase().includes(query);
          });
          if (matchedDept) {
            setHighlightDeptId(matchedDept.deptId);
            setTimeout(() => setHighlightDeptId(null), 10000);
          }
        }
      } else {
        setError('Failed to fetch data.');
      }
      setLoading(false);
    }).catch(err => {
      setError('Error: ' + err.message);
      setLoading(false);
    });
  }, [location.search]);

  const handleDepartmentClick = (deptId) => {
    setSelectedDeptId(deptId);
    setSelectedSemId(null);
  };

  const handleSemesterClick = (semId) => setSelectedSemId(semId);

  const handleBackClick = () => {
    if (selectedSemId) setSelectedSemId(null);
    else setSelectedDeptId(null);
  };

  const getCourseDuration = (name) => {
    if (!name) return '';
    return name.trim().toLowerCase().startsWith('m') ? '2 Year Course' : '3 Year Course';
  };

  const getTotalFees = (deptId) =>
    feeStructures.filter(f => f.deptId === deptId).reduce((sum, f) => sum + (f.defaultAmount || 0), 0);

  const getSemesters = (deptId) =>
    [...new Set(feeStructures.filter(f => f.deptId === deptId).map(f => f.semId))].sort();

  const getSemesterFees = (deptId, semId) =>
    feeStructures.filter(f => f.deptId === deptId && f.semId === semId).reduce((sum, f) => sum + (f.defaultAmount || 0), 0);

  const getSubjects = (deptId, semId) =>
    subjects.filter(sub => sub.deptId === deptId && sub.semId === semId);

  const selectedDept = departments.find(d => d.deptId === selectedDeptId);

  if (loading) return <div className="text-center mt-5 fs-4">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center mt-4">{error}</div>;

  return (
    <div>
      <div className="container my-5">
      {/* Show heading and description only on initial screen */}
      {!selectedDeptId && (
        <>
          <h2 className="text-center mb-4 fw-bold text-primary">Explore Our Courses</h2>
          <p className="text-center mb-5 lead text-secondary px-3">
            Welcome to our Courses page! Here you will find the full list of programs and courses we offer across various departments. Explore and choose the one that suits your career goals.
          </p>
        </>
      )}

      {!selectedDeptId ? (
        <div className="row g-4">
          {departments.map(dept => {
            const name = dept.departmentName || dept.deptName;
            const total = getTotalFees(dept.deptId);
            const isHighlighted = highlightDeptId === dept.deptId;

            return (
              <div className="col-md-4" key={dept.deptId}>
                <div
                  className={`card h-100 shadow-sm border-0 rounded-4 p-3 d-flex flex-column justify-content-center ${isHighlighted ? 'highlight-department' : ''}`}
                  onClick={() => handleDepartmentClick(dept.deptId)}
                  style={{
                    cursor: 'pointer',
                    minHeight: '140px',
                    background: 'linear-gradient(to bottom right, #8b9dc3, #3b5998)',
                    color: 'white',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{name}</h5>
                    <div className="fw-semibold fs-5">₹{total.toLocaleString()}</div>
                  </div>
                  <small className="mt-2 fst-italic">{getCourseDuration(name)}</small>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card shadow rounded-4">
          <div className="card-header bg-primary d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h4 className="text-white m-0">{selectedDept?.departmentName || selectedDept?.deptName}</h4>
            <button className="btn btn-light btn-sm d-flex align-items-center gap-2" onClick={handleBackClick}>
              <FaArrowLeft /> {selectedSemId ? 'Back to Semesters' : 'All Departments'}
            </button>
          </div>
          <div className="card-body">
            <p><strong>Course Duration:</strong> {getCourseDuration(selectedDept?.departmentName || selectedDept?.deptName)}</p>
            <p><strong>Total Fees:</strong> <span className="text-success">₹{getTotalFees(selectedDeptId).toLocaleString()}</span></p>

            {!selectedSemId ? (
              <>
                <h5 className="mt-4 mb-3">Semesters</h5>
                <ul className="list-group">
                  {getSemesters(selectedDeptId).map(semId => (
                    <li
                      key={semId}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center rounded-3 mb-2"
                      onClick={() => handleSemesterClick(semId)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span>Semester {semId}</span>
                      <span className="badge bg-primary rounded-pill">₹{getSemesterFees(selectedDeptId, semId).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h5 className="mt-4 mb-3">Subjects in Semester {selectedSemId}</h5>
                {getSubjects(selectedDeptId, selectedSemId).length === 0 ? (
                  <p className="text-muted fst-italic">No subjects found.</p>
                ) : (
                  <ul className="list-group">
                    {getSubjects(selectedDeptId, selectedSemId).map(sub => (
                      <li key={sub.subjectId} className="list-group-item subject-item rounded-3 mb-2">
                        {sub.subjectName}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      )}
    
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



    
    
  );
};

export default Courses;
