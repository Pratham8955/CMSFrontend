import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import "../../css/Student/Material.css";

const Material = () => {
  const [subjects, setSubjects] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [courseContents, setCourseContents] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = jwtDecode(token);
      const id = decoded.StudentUserId;
      setStudentId(id);

      const res = await axios.get(`https://localhost:7133/api/Student/getStudentsById/${id}`);
      const student = res.data.student[0];

      if (student) {
        const subjectsRes = await axios.get(
          `https://localhost:7133/api/Subject/GetSubjectsByStudent/${student.deptId}/${student.currentSemester}`
        );
        setSubjects(subjectsRes.data.subject || []);
      }
    };

    fetchStudent();
  }, []);

  const fetchContents = async () => {
    const res = await axios.get(`https://localhost:7133/api/CourseContent/GetByIdforstudent/${studentId}`);
    setCourseContents(res.data.content || []);
  };

  const toggleCard = (subjectId) => {
    setExpandedId(expandedId === subjectId ? null : subjectId);
    if (courseContents.length === 0) fetchContents();
  };

  const getSubjectContents = (id) => courseContents.filter((c) => c.subjectId === id);
  const getFullUrl = (path) => `https://localhost:7133/${path}`;

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="display-6 fw-bold text-dark">📘 Course Materials</h1>
        <p className="text-muted">Access your study materials by subject</p>
      </div>

      <div className="row g-4">
        {subjects.map((subj) => {
          const files = getSubjectContents(subj.subjectId);
          const isExpanded = expandedId === subj.subjectId;

          return (
            <div className="col-md-6 col-lg-4" key={subj.subjectId}>
              <div className={`material-card card p-3 ${isExpanded ? 'active' : ''}`} onClick={() => toggleCard(subj.subjectId)}>
                <div className="card-body">
                  <h5 className="card-title">{subj.subjectName}</h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary">{files.length} Files</span>
                    <span className="text-muted small">{isExpanded ? "Hide" : "View"}</span>
                  </div>

                  {isExpanded && (
                    <ul className="list-group mt-3">
                      {files.length > 0 ? files.map((file, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          {file.title}
                          <a href={getFullUrl(file.filePath)} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">Open</a>
                        </li>
                      )) : <li className="list-group-item text-muted">No materials uploaded</li>}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Material;
  