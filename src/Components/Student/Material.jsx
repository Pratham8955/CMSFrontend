import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Material = () => {
  const [deptId, setDeptId] = useState(null);
  const [currentSemester, setCurrentSemester] = useState(null);
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
          const deptId = studentData.deptId;
          const currentSem = studentData.currentSemester;

          setDeptId(deptId);
          setCurrentSemester(currentSem);

          const subjectRes = await axios.get(
            `https://localhost:7133/api/Subject/GetSubjectsByStudent/${deptId}/${currentSem}`
          );

          const subjectList = subjectRes.data?.subject || [];
          setSubjects(subjectList);
        }
      } catch (error) {
        console.error('Error fetching student/subjects:', error);
      }
    };

    fetchStudentAndSubjects();
  }, []);

  const fetchCourseContents = async () => {
    try {
      const res = await axios.get(`https://localhost:7133/api/CourseContent/GetByIdforstudent/${studentId}`);
      const contentList = res.data?.content || [];
      setCourseContents(contentList);
    } catch (error) {
      console.error('Error fetching course content:', error);
    }
  };

  const handleToggle = (subjectId) => {
    if (expandedSubjectId === subjectId) {
      setExpandedSubjectId(null);
    } else {
      setExpandedSubjectId(subjectId);
      if (courseContents.length === 0) {
        fetchCourseContents();
      }
    }
  };

  const getContentForSubject = (subjectId) => {
    return courseContents.filter((content) => content.subjectId === subjectId);
  };

  const getFullFileUrl = (filePath) => {
    return `https://localhost:7133/${filePath}`;
  };

  return (
    <div>
      <h2>Subjects</h2>
      {subjects.length > 0 ? (
        <ul>
          {subjects.map((subject) => (
            <li key={subject.subjectId}>
              <div
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => handleToggle(subject.subjectId)}
              >
                {subject.subjectName}
              </div>
              {expandedSubjectId === subject.subjectId && (
                <ul style={{ marginLeft: '20px' }}>
                  {getContentForSubject(subject.subjectId).length > 0 ? (
                    getContentForSubject(subject.subjectId).map((content, index) => (
                      <li key={index}>
                        {content.title} –{' '}
                        <a
                          href={getFullFileUrl(content.filePath)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </a>
                      </li>
                    ))
                  ) : (
                    <li>No content available.</li>
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No subjects found.</p>
      )}
    </div>
  );
};

export default Material;
