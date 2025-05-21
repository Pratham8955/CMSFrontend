import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import "../../css/Student/Material.css"
const Material = () => {
  
  const [subjects, setSubjects] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [courseContents, setCourseContents] = useState([]);
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);

  useEffect(() => {
    const fetchStudentAndSubjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode(token);
        const id = decoded.StudentUserId;
        setStudentId(id);

        const studentRes = await axios.get(`https://localhost:7133/api/Student/getStudentsById/${id}`);
        const studentData = studentRes.data?.student?.[0];

        if (studentData) {
          const subjectRes = await axios.get(
            `https://localhost:7133/api/Subject/GetSubjectsByStudent/${studentData.deptId}/${studentData.currentSemester}`
          );
          setSubjects(subjectRes.data?.subject || []);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchStudentAndSubjects();
  }, []);

  const fetchCourseContents = async () => {
    try {
      const res = await axios.get(`https://localhost:7133/api/CourseContent/GetByIdforstudent/${studentId}`);
      setCourseContents(res.data?.content || []);
    } catch (error) {
      console.error('Content error:', error);
    }
  };

  const handleToggle = (subjectId) => {
    setExpandedSubjectId(expandedSubjectId === subjectId ? null : subjectId);
    if (courseContents.length === 0) fetchCourseContents();
  };

  const getContentForSubject = (subjectId) =>
    courseContents.filter((content) => content.subjectId === subjectId);

  const getFullFileUrl = (filePath) => `https://localhost:7133/${filePath}`;

  return (
    
    <div className="container my-5">
      <div className="material-header">
        <h2>📘 Course Materials</h2>
        <p className="text-muted">Click on a subject to view uploaded course content.</p>
      </div>

      {subjects.length > 0 ? (
        <div className="accordion" id="materialAccordion">
          {subjects.map((subject, index) => (
            <div className="accordion-item custom-card" key={subject.subjectId}>
              <h2 className="accordion-header" id={`heading-${index}`}>
                <button
                  className={`accordion-button ${expandedSubjectId === subject.subjectId ? '' : 'collapsed'}`}
                  onClick={() => handleToggle(subject.subjectId)}
                  type="button"
                >
                  {subject.subjectName}
                </button>
              </h2>
              <div
                id={`collapse-${index}`}
                className={`accordion-collapse collapse ${expandedSubjectId === subject.subjectId ? 'show' : ''}`}
              >
                <div className="accordion-body">
                  {getContentForSubject(subject.subjectId).length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {getContentForSubject(subject.subjectId).map((content, idx) => (
                        <li className="list-group-item d-flex justify-content-between align-items-center" key={idx}>
                          <span>{content.title}</span>
                          <a
                            className="btn btn-sm view-btn"
                            href={getFullFileUrl(content.filePath)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View PDF
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">No content uploaded yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-warning mt-4">No subjects available for your semester.</div>
      )}
    </div>
  );
};

export default Material;
